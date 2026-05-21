package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import projetotcc.thiago.PlaySCORE_API.model.*;
import projetotcc.thiago.PlaySCORE_API.repository.*;

import java.util.List;
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
            double pontosCalculados = calcularPontosCalculados(desempenhoAtleta, regrasLiga);
            desempenhoAtleta.setPontosCalculados(pontosCalculados);
            desempenhoAtleta.setValorAtualizado(calcularValorAtualizado(desempenhoAtleta));
            desempenhoAtletaRepository.save(desempenhoAtleta);
        }

        // Para cada equipe na rodada, cria registros de desempenho e atualiza pontuação total
        List<EquipeLiga> equipesNaRodada = escalacoes.stream()
                .map(Escalacao::getEquipeLiga)
                .filter(e -> e != null)
                .distinct()
                .collect(Collectors.toList());

        for (EquipeLiga equipeLiga : equipesNaRodada) {
            List<Escalacao> escalacoesEquipe = escalacaoRepository.findByEquipeLigaIdAndRodadaId(equipeLiga.getId(), rodadaId);
            if (escalacoesEquipe.isEmpty()) continue;

            // Remove resultados antigos desta equipe nesta rodada antes de recalcular
            desempenhoEquipeFantasyRepository.deleteByEquipeLigaIdAndRodadaId(equipeLiga.getId(), rodadaId);

            double pontuacaoRodadaTotal = 0.0;
            for (Escalacao esc : escalacoesEquipe) {
                DesempenhoAtleta desempenhoAtleta = desempenhoAtletaRepository.findByAtletaIdAndRodadaId(esc.getAtleta().getId(), rodadaId)
                        .stream().findFirst().orElse(null);
                if (desempenhoAtleta == null) continue;

                double contribution = desempenhoAtleta.getPontosCalculados() == null ? 0.0 : desempenhoAtleta.getPontosCalculados();
                pontuacaoRodadaTotal += contribution;

                DesempenhoEquipeFantasy registro = new DesempenhoEquipeFantasy();
                registro.setEquipeLiga(equipeLiga);
                registro.setRodada(rodada);
                registro.setDesempenhoAtleta(desempenhoAtleta);
                registro.setPontuacaoRodada(contribution);
                desempenhoEquipeFantasyRepository.save(registro);
            }

            Double totalAnterior = equipeLiga.getPontuacaoTotal();
            equipeLiga.setPontuacaoTotal((totalAnterior == null ? 0.0 : totalAnterior) + pontuacaoRodadaTotal);
            equipeLigaRepository.save(equipeLiga);
        }

        rodada.setStatus("FECHADO");
        rodadaRepository.save(rodada);
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

    private double calcularValorAtualizado(DesempenhoAtleta desempenhoAtual) {
        Atleta atleta = desempenhoAtual.getAtleta();
        if (atleta == null) {
            return desempenhoAtual.getValorAtualizado() == null ? 0.0 : desempenhoAtual.getValorAtualizado();
        }

        Double precoInicial = atleta.getPrecoAtual() != null ? atleta.getPrecoAtual() : atleta.getPrecoInicial();
        if (precoInicial == null) {
            precoInicial = 0.0;
        }

        Optional<DesempenhoAtleta> anterior = desempenhoAtletaRepository
                .findTopByAtletaIdAndRodadaNumeroLessThanOrderByRodadaNumeroDesc(atleta.getId(), desempenhoAtual.getRodada().getNumero());

        double pontosAtuais = desempenhoAtual.getPontosCalculados() == null ? 0.0 : desempenhoAtual.getPontosCalculados();
        if (anterior.isEmpty()) {
            return Math.round(precoInicial * 100.0) / 100.0;
        }

        double pontosAnteriores = anterior.get().getPontosCalculados() == null ? 0.0 : anterior.get().getPontosCalculados();
        if (pontosAnteriores <= 0) {
            return Math.round(precoInicial * 100.0) / 100.0;
        }

        double diferencaRelativa = (pontosAtuais - pontosAnteriores) / pontosAnteriores;
        double ajustePercentual = Math.max(-0.25, Math.min(0.25, diferencaRelativa * 0.20));
        double valorAtualizado = precoInicial * (1 + ajustePercentual);
        return Math.round(valorAtualizado * 100.0) / 100.0;
    }
}

