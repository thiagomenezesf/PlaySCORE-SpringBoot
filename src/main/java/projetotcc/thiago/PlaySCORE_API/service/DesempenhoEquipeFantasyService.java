package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projetotcc.thiago.PlaySCORE_API.dto.DesempenhoEquipeFantasyRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.DesempenhoEquipeFantasy;
import projetotcc.thiago.PlaySCORE_API.model.EquipeLiga;
import projetotcc.thiago.PlaySCORE_API.repository.DesempenhoEquipeFantasyRepository;
import projetotcc.thiago.PlaySCORE_API.repository.EquipeLigaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.RodadaRepository;

import java.util.List;

@Service
public class DesempenhoEquipeFantasyService {

    @Autowired
    private DesempenhoEquipeFantasyRepository desempenhoEquipeFantasyRepository;

    @Autowired
    private EquipeLigaRepository equipeLigaRepository;

    @Autowired
    private RodadaRepository rodadaRepository;

    public List<DesempenhoEquipeFantasy> listarTodos() {
        return desempenhoEquipeFantasyRepository.findAll();
    }

    public DesempenhoEquipeFantasy buscarPorId(Long id) {
        return desempenhoEquipeFantasyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DesempenhoEquipeFantasy", id));
    }

    public DesempenhoEquipeFantasy salvar(DesempenhoEquipeFantasyRequest request) {
        EquipeLiga equipeLiga = equipeLigaRepository.findById(request.getIdEquipeLiga())
                .orElseThrow(() -> new ResourceNotFoundException("EquipeLiga", request.getIdEquipeLiga()));
        var rodada = rodadaRepository.findById(request.getIdRodada())
            .orElseThrow(() -> new ResourceNotFoundException("Rodada", request.getIdRodada()));

        DesempenhoEquipeFantasy desempenho = new DesempenhoEquipeFantasy();
        desempenho.setEquipeLiga(equipeLiga);
        desempenho.setRodada(rodada);
        desempenho.setPontuacaoRodada(request.getPontuacaoRodada());
        return desempenhoEquipeFantasyRepository.save(desempenho);
    }
}
