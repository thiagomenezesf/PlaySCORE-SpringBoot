package projetotcc.thiago.PlaySCORE_API.service;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import projetotcc.thiago.PlaySCORE_API.dto.CampeonatoRodadaRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.Atleta;
import projetotcc.thiago.PlaySCORE_API.model.Clube;
import projetotcc.thiago.PlaySCORE_API.model.CampeonatoRodada;
import projetotcc.thiago.PlaySCORE_API.model.Campeonato;
import projetotcc.thiago.PlaySCORE_API.model.DesempenhoAtleta;
import projetotcc.thiago.PlaySCORE_API.model.DesempenhoAtletaLiga;
import projetotcc.thiago.PlaySCORE_API.model.DesempenhoEquipeFantasy;
import projetotcc.thiago.PlaySCORE_API.model.EquipeLiga;
import projetotcc.thiago.PlaySCORE_API.model.Liga;
import projetotcc.thiago.PlaySCORE_API.model.Rodada;
import projetotcc.thiago.PlaySCORE_API.repository.AtletaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.ClubeRepository;
import projetotcc.thiago.PlaySCORE_API.repository.CampeonatoRepository;
import projetotcc.thiago.PlaySCORE_API.repository.CampeonatoRodadaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.DesempenhoAtletaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.DesempenhoEquipeFantasyRepository;
import projetotcc.thiago.PlaySCORE_API.repository.EquipeLigaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.LigaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.RodadaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.EscalacaoRepository;
import projetotcc.thiago.PlaySCORE_API.repository.DesempenhoAtletaLigaRepository;
import projetotcc.thiago.PlaySCORE_API.model.Escalacao;

import java.util.List;
import java.util.Optional;

@Service
public class CampeonatoRodadaService {

    @Autowired
    private CampeonatoRodadaRepository campeonatoRodadaRepository;

    @Autowired
    private CampeonatoRepository campeonatoRepository;

    @Autowired
    private RodadaRepository rodadaRepository;

    @Autowired
    private ClubeRepository clubeRepository;

    @Autowired
    private AtletaRepository atletaRepository;

    @Autowired
    private DesempenhoAtletaRepository desempenhoAtletaRepository;

    @Autowired
    private EquipeLigaRepository equipeLigaRepository;

    @Autowired
    private DesempenhoEquipeFantasyRepository desempenhoEquipeFantasyRepository;

    @Autowired
    private LigaRepository ligaRepository;

    @Autowired
    private GameRulesService gameRulesService;

    @Autowired
    private EscalacaoRepository escalacaoRepository;

    @Autowired
    private DesempenhoAtletaLigaRepository desempenhoAtletaLigaRepository;

    public List<CampeonatoRodada> listarTodos() {
        return campeonatoRodadaRepository.findAll();
    }

    public CampeonatoRodada buscarPorId(Long id) {
        return campeonatoRodadaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CampeonatoRodada", id));
    }

    public CampeonatoRodada salvar(CampeonatoRodadaRequest request) {
        Campeonato campeonato = campeonatoRepository.findById(request.getIdCampeonato())
                .orElseThrow(() -> new ResourceNotFoundException("Campeonato", request.getIdCampeonato()));

        Rodada rodada = rodadaRepository.findById(request.getIdRodada())
                .orElseThrow(() -> new ResourceNotFoundException("Rodada", request.getIdRodada()));

        Optional<CampeonatoRodada> existente = campeonatoRodadaRepository.findByCampeonatoId(campeonato.getId());
        if (existente.isPresent()) {
            CampeonatoRodada registro = existente.get();
            registro.setRodada(rodada);
            return campeonatoRodadaRepository.save(registro);
        }

        CampeonatoRodada registro = new CampeonatoRodada();
        registro.setCampeonato(campeonato);
        registro.setRodada(rodada);
        return campeonatoRodadaRepository.save(registro);
    }

    public CampeonatoRodada obterRodadaAtual(Long campeonatoId) {
        CampeonatoRodada atual = campeonatoRodadaRepository.findByCampeonatoId(campeonatoId)
                .orElse(null);

        if (atual == null || atual.getRodada() == null) {
            Campeonato campeonato = campeonatoRepository.findById(campeonatoId)
                    .orElseThrow(() -> new ResourceNotFoundException("Campeonato", campeonatoId));

            Rodada primeiraRodada = new Rodada();
            primeiraRodada.setNumero(1);
            primeiraRodada.setStatus("ABERTO");
            primeiraRodada.setCampeonato(campeonato);
            primeiraRodada = rodadaRepository.save(primeiraRodada);

            if (atual == null) {
                atual = new CampeonatoRodada();
                atual.setCampeonato(campeonato);
            }
            atual.setRodada(primeiraRodada);
            CampeonatoRodada salvo = campeonatoRodadaRepository.save(atual);
            criarDesempenhosIniciaisRodada(primeiraRodada);
            return salvo;
        }

        criarDesempenhosIniciaisRodada(atual.getRodada());
        return atual;
    }

    public CampeonatoRodada avancarRodada(Long campeonatoId) {
        Campeonato campeonato = campeonatoRepository.findById(campeonatoId)
                .orElseThrow(() -> new ResourceNotFoundException("Campeonato", campeonatoId));

        CampeonatoRodada atual = campeonatoRodadaRepository.findByCampeonatoId(campeonatoId)
                .orElse(null);

        if (atual == null) {
            Rodada primeiraRodada = new Rodada();
            primeiraRodada.setNumero(1);
            primeiraRodada.setStatus("ABERTO");
            primeiraRodada.setCampeonato(campeonato);
            primeiraRodada = rodadaRepository.save(primeiraRodada);

            CampeonatoRodada novo = new CampeonatoRodada();
            novo.setCampeonato(campeonato);
            novo.setRodada(primeiraRodada);
            CampeonatoRodada salvo = campeonatoRodadaRepository.save(novo);
            criarDesempenhosIniciaisRodada(primeiraRodada);
            return salvo;
        }

        Rodada rodadaAtual = atual.getRodada();
        if (rodadaAtual == null) {
            throw new RuntimeException("Rodada atual não configurada para o campeonato");
        }

        if (!"FECHADO".equals(rodadaAtual.getStatus())) {
            rodadaAtual.setStatus("FECHADO");
            rodadaRepository.save(rodadaAtual);
        }

        Integer proximoNumero = rodadaAtual.getNumero() + 1;
        Rodada proximaRodada = rodadaRepository.findByCampeonatoIdAndNumero(campeonatoId, proximoNumero)
                .orElseGet(() -> {
                    Rodada novaRodada = new Rodada();
                    novaRodada.setNumero(proximoNumero);
                    novaRodada.setStatus("ABERTO");
                    novaRodada.setCampeonato(campeonato);
                    return rodadaRepository.save(novaRodada);
                });

        if (!"ABERTO".equals(proximaRodada.getStatus())) {
            proximaRodada.setStatus("ABERTO");
            rodadaRepository.save(proximaRodada);
        }

        atual.setRodada(proximaRodada);
        CampeonatoRodada salvo = campeonatoRodadaRepository.save(atual);
        criarDesempenhosIniciaisRodada(proximaRodada);
        return salvo;
    }

    @Transactional
    private void criarDesempenhosIniciaisRodada(Rodada rodada) {
        if (rodada == null || rodada.getCampeonato() == null) {
            return;
        }

        List<Clube> clubes = clubeRepository.findByCampeonatoId(rodada.getCampeonato().getId());
        if (clubes.isEmpty()) {
            return;
        }

        List<Long> clubeIds = clubes.stream().map(Clube::getId).toList();
        List<Atleta> atletas = atletaRepository.findByClubeIdIn(clubeIds);

        for (Atleta atleta : atletas) {
            List<DesempenhoAtleta> existentes = desempenhoAtletaRepository.findByAtletaIdAndRodadaId(atleta.getId(), rodada.getId());
            if (existentes.isEmpty()) {
                DesempenhoAtleta desempenho = new DesempenhoAtleta();
                desempenho.setAtleta(atleta);
                desempenho.setRodada(rodada);
                DesempenhoAtleta saved = desempenhoAtletaRepository.save(desempenho);
                try {
                    gameRulesService.atualizarDesempenhoAtletaLiga(saved);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        List<Liga> ligas = ligaRepository.findByCampeonatoId(rodada.getCampeonato().getId());
        for (Liga liga : ligas) {
            List<EquipeLiga> equipes = equipeLigaRepository.findByLigaId(liga.getId());
            for (EquipeLiga equipeLiga : equipes) {
                boolean exists = !desempenhoEquipeFantasyRepository.findByEquipeLigaIdAndRodadaId(equipeLiga.getId(), rodada.getId()).isEmpty();
                if (!exists) {
                    DesempenhoEquipeFantasy registro = new DesempenhoEquipeFantasy();
                    registro.setEquipeLiga(equipeLiga);
                    registro.setRodada(rodada);
                    registro.setPontuacaoRodada(0.0);
                    desempenhoEquipeFantasyRepository.save(registro);
                }
            }
        }

        // Copiar escalações da rodada anterior e recalcular patrimônio
        copiarEscalacoesRodadaAnterior(rodada);
    }

    @Transactional
    private void copiarEscalacoesRodadaAnterior(Rodada rodadaAtual) {
        Integer numeroRodadaAnterior = rodadaAtual.getNumero() - 1;
        if (numeroRodadaAnterior < 1) return;

        Campeonato campeonato = rodadaAtual.getCampeonato();
        if (campeonato == null) return;

        java.util.Optional<Rodada> rodadaAnteriorOpt = rodadaRepository.findByCampeonatoIdAndNumero(campeonato.getId(), numeroRodadaAnterior);
        if (!rodadaAnteriorOpt.isPresent()) return;

        Rodada rodadaAnterior = rodadaAnteriorOpt.get();

        // Buscar todas as escalações da rodada anterior
        java.util.List<Escalacao> escalacoesAnterior = escalacaoRepository.findByRodadaId(rodadaAnterior.getId());
        if (escalacoesAnterior.isEmpty()) return;

        // Copiar escalações para a nova rodada e recalcular patrimônio de cada equipe
        for (Escalacao escalaçãoAnterior : escalacoesAnterior) {
            Escalacao novaEscalacao = new Escalacao();
            novaEscalacao.setAtleta(escalaçãoAnterior.getAtleta());
            novaEscalacao.setEquipeLiga(escalaçãoAnterior.getEquipeLiga());
            novaEscalacao.setRodada(rodadaAtual);
            novaEscalacao.setEquipeFantasy(escalaçãoAnterior.getEquipeFantasy());
            novaEscalacao.setIsCapitao(escalaçãoAnterior.getIsCapitao());
            escalacaoRepository.save(novaEscalacao);
        }

        // Agrupar escalações por equipeLiga e recalcular patrimônio
        java.util.Map<Long, java.util.List<Escalacao>> escalacoesPerEquipe = escalacoesAnterior.stream()
                .collect(java.util.stream.Collectors.groupingBy(e -> e.getEquipeLiga().getId()));

        for (java.util.Map.Entry<Long, java.util.List<Escalacao>> entry : escalacoesPerEquipe.entrySet()) {
            Long equipeLigaId = entry.getKey();
            java.util.List<Escalacao> escalacoes = entry.getValue();

            // Calcular patrimônio = soma dos valor_atual de cada atleta escalado
            double patrimonioAtualizado = 0.0;
            for (Escalacao esc : escalacoes) {
                Atleta atleta = esc.getAtleta();
                java.util.Optional<DesempenhoAtletaLiga> desempenhoLiga = desempenhoAtletaLigaRepository
                        .findByDesempenhoAtletaIdAndLigaIdAndRodadaId(atleta.getId(), esc.getEquipeLiga().getLiga().getId(), rodadaAtual.getId());
                if (desempenhoLiga.isPresent()) {
                    Double valorAtual = desempenhoLiga.get().getValorAtual();
                    patrimonioAtualizado += (valorAtual != null ? valorAtual : 0.0);
                }
            }

            // Atualizar patrimônio da equipeLiga
            java.util.Optional<EquipeLiga> equipeLigaOpt = equipeLigaRepository.findById(equipeLigaId);
            if (equipeLigaOpt.isPresent()) {
                EquipeLiga equipeLiga = equipeLigaOpt.get();
                equipeLiga.setPatrimonio(patrimonioAtualizado);
                equipeLigaRepository.save(equipeLiga);
            }
        }
    }
}

