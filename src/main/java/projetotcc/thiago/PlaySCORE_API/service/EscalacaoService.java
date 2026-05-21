package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projetotcc.thiago.PlaySCORE_API.dto.EscalacaoRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.Atleta;
import projetotcc.thiago.PlaySCORE_API.model.EquipeFantasy;
import projetotcc.thiago.PlaySCORE_API.model.EquipeLiga;
import projetotcc.thiago.PlaySCORE_API.model.Escalacao;
import projetotcc.thiago.PlaySCORE_API.model.Rodada;
import projetotcc.thiago.PlaySCORE_API.repository.AtletaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.EquipeFantasyRepository;
import projetotcc.thiago.PlaySCORE_API.repository.EquipeLigaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.EscalacaoRepository;
import projetotcc.thiago.PlaySCORE_API.repository.RodadaRepository;

import java.util.List;

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

    public List<Escalacao> listarTodos() {
        return escalacaoRepository.findAll();
    }

    public Escalacao buscarPorId(String id) {
        return escalacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Escalacao", id));
    }

    public Escalacao salvar(EscalacaoRequest request) {
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
        return escalacaoRepository.save(escalacao);
    }
}
