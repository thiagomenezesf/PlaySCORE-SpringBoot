package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import projetotcc.thiago.PlaySCORE_API.dto.EscalacaoRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.Atleta;
import projetotcc.thiago.PlaySCORE_API.model.DesempenhoAtleta;
import projetotcc.thiago.PlaySCORE_API.model.DesempenhoAtletaLiga;
import projetotcc.thiago.PlaySCORE_API.model.EquipeFantasy;
import projetotcc.thiago.PlaySCORE_API.model.EquipeLiga;
import projetotcc.thiago.PlaySCORE_API.model.Escalacao;
import projetotcc.thiago.PlaySCORE_API.model.Rodada;
import projetotcc.thiago.PlaySCORE_API.repository.AtletaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.DesempenhoAtletaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.DesempenhoAtletaLigaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.EquipeFantasyRepository;
import projetotcc.thiago.PlaySCORE_API.repository.EquipeLigaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.EscalacaoRepository;
import projetotcc.thiago.PlaySCORE_API.repository.RodadaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EscalacaoService {

    @Autowired
    private EscalacaoRepository escalacaoRepository;

    @Autowired
    private AtletaRepository atletaRepository;

    @Autowired
    private RodadaRepository rodadaRepository;

    @Autowired
    private EquipeLigaRepository equipeLigaRepository;

    @Autowired
    private EquipeFantasyRepository equipeFantasyRepository;

    @Autowired
    private DesempenhoAtletaRepository desempenhoAtletaRepository;

    @Autowired
    private DesempenhoAtletaLigaRepository desempenhoAtletaLigaRepository;

    public List<Escalacao> listarTodos() {
        return escalacaoRepository.findAll();
    }

    public Escalacao buscarPorId(String id) {
        return escalacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Escalacao", id));
    }

    @Transactional
    public Escalacao salvar(EscalacaoRequest request) {
        Escalacao escalacao = criarEscalacao(request);
        Escalacao saved = escalacaoRepository.save(escalacao);
        recalcularPatrimonio(saved.getEquipeLiga().getId());
        return saved;
    }

    @Transactional
    public java.util.List<Escalacao> salvarEmLote(java.util.List<EscalacaoRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return java.util.Collections.emptyList();
        }

        Long equipeLigaId = requests.get(0).getIdEquipeLiga();
        Long rodadaId = requests.get(0).getIdRodada();

        // Remover escalações antigas da mesma equipe na mesma rodada antes de recriar
        escalacaoRepository.deleteByEquipeLigaIdAndRodadaId(equipeLigaId, rodadaId);

        java.util.List<Escalacao> escalacoes = new java.util.ArrayList<>();
        for (EscalacaoRequest request : requests) {
            if (!request.getIdEquipeLiga().equals(equipeLigaId) || !request.getIdRodada().equals(rodadaId)) {
                throw new IllegalArgumentException("Todas as escalações em lote devem pertencer à mesma equipe e rodada.");
            }
            escalacoes.add(criarEscalacao(request));
        }

        java.util.List<Escalacao> saved = escalacaoRepository.saveAll(escalacoes);
        recalcularPatrimonio(equipeLigaId);
        return saved;
    }

    @Transactional
    public Escalacao atualizar(String id, EscalacaoRequest request) {
        Escalacao escalacao = buscarPorId(id);

        Atleta atleta = atletaRepository.findById(request.getIdAtleta())
                .orElseThrow(() -> new ResourceNotFoundException("Atleta", request.getIdAtleta()));

        Rodada rodada = rodadaRepository.findById(request.getIdRodada())
                .orElseThrow(() -> new ResourceNotFoundException("Rodada", request.getIdRodada()));

        EquipeLiga equipeLiga = equipeLigaRepository.findById(request.getIdEquipeLiga())
                .orElseThrow(() -> new ResourceNotFoundException("EquipeLiga", request.getIdEquipeLiga()));

        EquipeFantasy equipeFantasy = equipeFantasyRepository.findById(request.getIdEquipeFantasy())
                .orElseThrow(() -> new ResourceNotFoundException("EquipeFantasy", request.getIdEquipeFantasy()));

        escalacao.setAtleta(atleta);
        escalacao.setRodada(rodada);
        escalacao.setEquipeLiga(equipeLiga);
        escalacao.setEquipeFantasy(equipeFantasy);
        escalacao.setIsCapitao(request.getIsCapitao() == null ? false : request.getIsCapitao());

        Escalacao updated = escalacaoRepository.save(escalacao);
        recalcularPatrimonio(updated.getEquipeLiga().getId());
        return updated;
    }

    /**
     * Recalcula o patrimonio de uma EquipeLiga baseado no valor_atual
     * de todos os atletas que estão escalados (soma de valores).
     */
    @Transactional
    private void recalcularPatrimonio(Long equipeLigaId) {
        EquipeLiga equipeLiga = equipeLigaRepository.findById(equipeLigaId)
                .orElseThrow(() -> new ResourceNotFoundException("EquipeLiga", equipeLigaId));

        if (equipeLiga.getLiga() == null) {
            return;
        }

        // Buscar todas as escalações da equipe
        List<Escalacao> escalacoes = escalacaoRepository.findByEquipeLigaId(equipeLigaId);

        double patrimonioAtualizado = 0.0;

        // Para cada escalação, buscar o valor_atual do atleta na liga
        for (Escalacao escalacao : escalacoes) {
            Atleta atleta = escalacao.getAtleta();
            Long ligaId = equipeLiga.getLiga().getId();

            // Buscar o DesempenhoAtletaLiga mais recente da rodada
            if (escalacao.getRodada() != null) {
                // Primeiro buscar DesempenhoAtleta
                java.util.List<DesempenhoAtleta> desempenhosAtleta = desempenhoAtletaRepository
                        .findByAtletaIdAndRodadaId(atleta.getId(), escalacao.getRodada().getId());

                if (!desempenhosAtleta.isEmpty()) {
                    // Pegar o primeiro (deveria haver apenas um)
                    DesempenhoAtleta desempenhoAtleta = desempenhosAtleta.get(0);

                    // Agora buscar DesempenhoAtletaLiga usando o ID correto
                    Optional<DesempenhoAtletaLiga> desempenhoOpt = desempenhoAtletaLigaRepository
                            .findByDesempenhoAtletaIdAndLigaIdAndRodadaId(
                                    desempenhoAtleta.getId(),
                                    ligaId,
                                    escalacao.getRodada().getId()
                            );

                    if (desempenhoOpt.isPresent()) {
                        Double valorAtual = desempenhoOpt.get().getValorAtual();
                        if (valorAtual != null) {
                            patrimonioAtualizado += valorAtual;
                        }
                    } else {
                        // Se não houver desempenho ainda, usar preço inicial
                        if (atleta.getPrecoInicial() != null) {
                            patrimonioAtualizado += atleta.getPrecoInicial();
                        }
                    }
                } else {
                    // Se não houver desempenho, usar preço inicial
                    if (atleta.getPrecoInicial() != null) {
                        patrimonioAtualizado += atleta.getPrecoInicial();
                    }
                }
            }
        }

        equipeLiga.setPatrimonio(patrimonioAtualizado);
        equipeLigaRepository.save(equipeLiga);
    }

    private Escalacao criarEscalacao(EscalacaoRequest request) {
        Atleta atleta = atletaRepository.findById(request.getIdAtleta())
                .orElseThrow(() -> new ResourceNotFoundException("Atleta", request.getIdAtleta()));

        Rodada rodada = rodadaRepository.findById(request.getIdRodada())
                .orElseThrow(() -> new ResourceNotFoundException("Rodada", request.getIdRodada()));

        EquipeLiga equipeLiga = equipeLigaRepository.findById(request.getIdEquipeLiga())
                .orElseThrow(() -> new ResourceNotFoundException("EquipeLiga", request.getIdEquipeLiga()));

        EquipeFantasy equipeFantasy = equipeFantasyRepository.findById(request.getIdEquipeFantasy())
                .orElseThrow(() -> new ResourceNotFoundException("EquipeFantasy", request.getIdEquipeFantasy()));

        Escalacao escalacao = new Escalacao();
        escalacao.setAtleta(atleta);
        escalacao.setRodada(rodada);
        escalacao.setEquipeLiga(equipeLiga);
        escalacao.setEquipeFantasy(equipeFantasy);
        escalacao.setIsCapitao(request.getIsCapitao() == null ? false : request.getIsCapitao());
        return escalacao;
    }
}