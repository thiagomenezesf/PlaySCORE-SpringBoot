package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import projetotcc.thiago.PlaySCORE_API.model.*;
import projetotcc.thiago.PlaySCORE_API.repository.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GameRulesService {

    @Autowired
    private RegraPontuacaoLigaRepository regraRepository;

    @Autowired
    private DesempenhoAtletaRepository desempenhoAtletaRepository;

    @Autowired
    private EscalacaoRepository escalacaoRepository;

    @Autowired
    private DesempenhoEquipeFantasyRepository desempenhoEquipeFantasyRepository;

    @Autowired
    private EquipeLigaRepository equipeLigaRepository;

    @Autowired
    private RodadaRepository rodadaRepository;

    @Autowired
    private AtletaRepository atletaRepository;

    @Autowired
    private DesempenhoAtletaLigaRepository desempenhoAtletaLigaRepository;

    @Autowired
    private LigaRepository ligaRepository;

    @Transactional
    public void fecharRodada(Long rodadaId) {
        Rodada rodada = rodadaRepository.findById(rodadaId)
                .orElseThrow(() -> new RuntimeException("Rodada não encontrada"));

        Campeonato campeonato = rodada.getCampeonato();
        if (campeonato == null) {
            throw new RuntimeException("Rodada não está vinculada a um campeonato");
        }

        // Recalcula todos os desempenhos da rodada com base nas regras da liga de cada equipe
        List<Escalacao> escalacoes = escalacaoRepository.findByRodadaId(rodadaId);
        Map<String, DesempenhoAtletaLiga> desempenhoLigaPorAtletaELiga = new HashMap<>();

        for (Escalacao escalacao : escalacoes) {
            Atleta atleta = escalacao.getAtleta();
            if (atleta == null) continue;

            EquipeLiga equipeLiga = escalacao.getEquipeLiga();
            if (equipeLiga == null || equipeLiga.getLiga() == null) continue;

            List<RegraPontuacaoLiga> regrasLiga = regraRepository.findByLigaId(equipeLiga.getLiga().getId());
            if (regrasLiga.isEmpty()) continue;

            List<DesempenhoAtleta> desempenhosAtleta = desempenhoAtletaRepository.findByAtletaIdAndRodadaId(atleta.getId(), rodadaId);
            if (desempenhosAtleta.isEmpty()) continue;

            DesempenhoAtleta desempenhoAtleta = desempenhosAtleta.get(0);
            String desempenhoKey = desempenhoAtleta.getId() + "_" + equipeLiga.getLiga().getId();
            if (desempenhoLigaPorAtletaELiga.containsKey(desempenhoKey)) {
                continue;
            }

            double pontosCalculados = calcularPontosCalculados(desempenhoAtleta, regrasLiga);

            Optional<DesempenhoAtletaLiga> desempenhoAnteriorLigaOpt =
                    desempenhoAtletaLigaRepository
                            .findFirstByDesempenhoAtletaAtletaIdAndLigaIdAndRodadaNumeroLessThanOrderByRodadaNumeroDesc(
                                    atleta.getId(), equipeLiga.getLiga().getId(), rodada.getNumero());

            double valorAnterior = desempenhoAnteriorLigaOpt
                    .map(DesempenhoAtletaLiga::getValorAtualizado)
                    .orElse(atleta.getPrecoInicial() != null ? atleta.getPrecoInicial() : 0.0);
            double valorAtual = valorAnterior;
            double valorAtualizado = calcularValorAtualizado(valorAnterior, pontosCalculados, desempenhoAnteriorLigaOpt);

            DesempenhoAtletaLiga desempenhoAtletaLiga = desempenhoAtletaLigaRepository
                    .findByDesempenhoAtletaIdAndLigaIdAndRodadaId(desempenhoAtleta.getId(), equipeLiga.getLiga().getId(), rodada.getId())
                    .orElse(new DesempenhoAtletaLiga());

            desempenhoAtletaLiga.setDesempenhoAtleta(desempenhoAtleta);
            desempenhoAtletaLiga.setLiga(equipeLiga.getLiga());
            desempenhoAtletaLiga.setRodada(rodada);
            desempenhoAtletaLiga.setPontosCalculados(pontosCalculados);
            desempenhoAtletaLiga.setValorAtual(valorAtual);
            desempenhoAtletaLiga.setValorAtualizado(valorAtualizado);
            desempenhoAtletaLigaRepository.save(desempenhoAtletaLiga);
            desempenhoLigaPorAtletaELiga.put(desempenhoKey, desempenhoAtletaLiga);
        }

        // Para cada equipe na rodada, cria registros de desempenho e atualiza pontuação total
        List<EquipeLiga> equipesNaRodada = escalacoes.stream()
                .map(Escalacao::getEquipeLiga)
                .filter(e -> e != null)
                .distinct()
                .collect(Collectors.toList());

        for (EquipeLiga equipeLiga : equipesNaRodada) {
            updatePontuacaoEquipeParaRodada(equipeLiga.getId(), rodadaId);
        }

        rodada.setStatus("FECHADO");
        rodadaRepository.save(rodada);
    }

        @Transactional
        private void updatePontuacaoEquipeParaRodada(Long equipeLigaId, Long rodadaId) {
        List<Escalacao> escalacoesEquipe = escalacaoRepository.findByEquipeLigaIdAndRodadaId(equipeLigaId, rodadaId);
        if (escalacoesEquipe.isEmpty()) return;

        double pontuacaoRodadaTotal = 0.0;
        for (Escalacao esc : escalacoesEquipe) {
            DesempenhoAtleta desempenhoAtleta = desempenhoAtletaRepository.findByAtletaIdAndRodadaId(esc.getAtleta().getId(), rodadaId)
                .stream().findFirst().orElse(null);
            if (desempenhoAtleta == null) continue;

            DesempenhoAtletaLiga desempenhoAtletaLiga = desempenhoAtletaLigaRepository
                .findByDesempenhoAtletaIdAndLigaIdAndRodadaId(desempenhoAtleta.getId(), esc.getEquipeLiga().getLiga().getId(), rodadaId)
                .orElse(null);
            if (desempenhoAtletaLiga == null) continue;

            double contribution = desempenhoAtletaLiga.getPontosCalculados() == null ? 0.0 : desempenhoAtletaLiga.getPontosCalculados();
            pontuacaoRodadaTotal += contribution;
        }

        // Remover registros antigos e criar/atualizar registro agregado único
        desempenhoEquipeFantasyRepository.deleteByEquipeLigaIdAndRodadaId(equipeLigaId, rodadaId);
        EquipeLiga equipeLiga = equipeLigaRepository.findById(equipeLigaId).orElse(null);
        Rodada rodada = rodadaRepository.findById(rodadaId).orElse(null);
        if (equipeLiga == null || rodada == null) return;

        DesempenhoEquipeFantasy registro = new DesempenhoEquipeFantasy();
        registro.setEquipeLiga(equipeLiga);
        registro.setRodada(rodada);
        registro.setPontuacaoRodada(pontuacaoRodadaTotal);
        desempenhoEquipeFantasyRepository.save(registro);

        // Atualiza pontuação total da equipe a partir dos registros atuais
        List<DesempenhoEquipeFantasy> resultadosEquipe = desempenhoEquipeFantasyRepository.findByEquipeLigaId(equipeLigaId);
        double pontuacaoTotal = resultadosEquipe.stream()
            .mapToDouble(d -> d.getPontuacaoRodada() == null ? 0.0 : d.getPontuacaoRodada())
            .sum();
        equipeLiga.setPontuacaoTotal(pontuacaoTotal);
        equipeLigaRepository.save(equipeLiga);
        }

    private double calcularPontosCalculados(DesempenhoAtleta desempenho, List<RegraPontuacaoLiga> regras) {
        return regras.stream()
                .mapToDouble(regra -> regra.getValor() * obterQuantidadePorAcao(desempenho, regra.getAcao()))
                .sum();
    }

    private double obterQuantidadePorAcao(DesempenhoAtleta d, String acao) {
        if (acao == null) return 0.0;
        return switch (acao) {
            case "GOLS" -> d.getGols() == null ? 0 : d.getGols();
            case "ASSISTENCIAS" -> d.getAssistencias() == null ? 0 : d.getAssistencias();
            case "CARTOES_AMARELOS" -> d.getCartoesAmarelos() == null ? 0 : d.getCartoesAmarelos();
            case "CARTOES_VERMELHOS" -> d.getCartoesVermelhos() == null ? 0 : d.getCartoesVermelhos();
            case "FINALIZACOES" -> d.getFinalizacoes() == null ? 0 : d.getFinalizacoes();
            case "IMPEDIMENTOS" -> d.getImpedimentos() == null ? 0 : d.getImpedimentos();
            case "FALTAS_COMETIDAS" -> d.getFaltasCometidas() == null ? 0 : d.getFaltasCometidas();
            case "FALTAS_RECEBIDAS" -> d.getFaltasRecebidas() == null ? 0 : d.getFaltasRecebidas();
            case "CANETAS" -> d.getCanetas() == null ? 0 : d.getCanetas();
            case "CHAPEUS" -> d.getChapeus() == null ? 0 : d.getChapeus();
            case "DRIBLES_SIMPLES" -> d.getDriblesSimples() == null ? 0 : d.getDriblesSimples();
            default -> 0.0;
        };
    }

    private double calcularValorAtualizado(double valorAnterior, double pontosAtuais, Optional<DesempenhoAtletaLiga> desempenhoAnteriorLigaOpt) {
        if (valorAnterior <= 0) {
            return 0.0;
        }

        double ajustePercentual = pontosAtuais * 0.02;
        ajustePercentual = Math.max(-0.12, Math.min(0.12, ajustePercentual));

        if (pontosAtuais > 0 && ajustePercentual < 0.01) {
            ajustePercentual = 0.01;
        }

        if (pontosAtuais < 0 && ajustePercentual > -0.01) {
            ajustePercentual = -0.01;
        }

        double valorAtualizado = valorAnterior * (1 + ajustePercentual);
        return Math.round(valorAtualizado * 100.0) / 100.0;
    }

    @Transactional
    public void atualizarDesempenhoAtletaLiga(DesempenhoAtleta desempenho) {
        if (desempenho == null) return;
        Rodada rodada = desempenho.getRodada();
        Atleta atleta = desempenho.getAtleta();
        if (rodada == null || atleta == null || rodada.getCampeonato() == null) return;

        List<Liga> ligasDoCampeonato = ligaRepository.findByCampeonatoId(rodada.getCampeonato().getId());
        for (Liga liga : ligasDoCampeonato) {
            if (liga == null || liga.getId() == null) continue;

            List<RegraPontuacaoLiga> regrasLiga = regraRepository.findByLigaId(liga.getId());
            if (regrasLiga.isEmpty()) continue;

            double pontosCalculados = calcularPontosCalculados(desempenho, regrasLiga);

            Optional<DesempenhoAtletaLiga> desempenhoAnteriorLigaOpt =
                    desempenhoAtletaLigaRepository
                            .findFirstByDesempenhoAtletaAtletaIdAndLigaIdAndRodadaNumeroLessThanOrderByRodadaNumeroDesc(
                                    atleta.getId(), liga.getId(), rodada.getNumero());

            double valorAnterior = desempenhoAnteriorLigaOpt
                    .map(DesempenhoAtletaLiga::getValorAtualizado)
                    .orElse(atleta.getPrecoInicial() != null ? atleta.getPrecoInicial() : 0.0);
            double valorAtual = valorAnterior;
            double valorAtualizado = calcularValorAtualizado(valorAnterior, pontosCalculados, desempenhoAnteriorLigaOpt);

            DesempenhoAtletaLiga ent = desempenhoAtletaLigaRepository
                    .findByDesempenhoAtletaIdAndLigaIdAndRodadaId(desempenho.getId(), liga.getId(), rodada.getId())
                    .orElse(new DesempenhoAtletaLiga());

            ent.setDesempenhoAtleta(desempenho);
            ent.setLiga(liga);
            ent.setRodada(rodada);
            ent.setPontosCalculados(pontosCalculados);
            ent.setValorAtual(valorAtual);
            ent.setValorAtualizado(valorAtualizado);

            desempenhoAtletaLigaRepository.save(ent);
            // Após atualizar o desempenho do atleta na liga, atualiza a pontuação da(s) equipe(s) que
            // têm esse atleta escalado na rodada, para que a pontuação agregada reflita a mudança.
            List<Escalacao> escalacoesDoAtleta = escalacaoRepository.findByAtletaIdAndRodadaId(atleta.getId(), rodada.getId());
            if (escalacoesDoAtleta != null && !escalacoesDoAtleta.isEmpty()) {
                for (Escalacao esc : escalacoesDoAtleta) {
                    if (esc.getEquipeLiga() != null && esc.getEquipeLiga().getId() != null) {
                        updatePontuacaoEquipeParaRodada(esc.getEquipeLiga().getId(), rodada.getId());
                    }
                }
            }
        }
    }
}


