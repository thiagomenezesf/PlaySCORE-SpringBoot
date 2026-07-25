package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projetotcc.thiago.PlaySCORE_API.dto.EquipeLigaRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.EquipeLiga;
import projetotcc.thiago.PlaySCORE_API.model.EquipeFantasy;
import projetotcc.thiago.PlaySCORE_API.model.Liga;
import projetotcc.thiago.PlaySCORE_API.repository.EquipeFantasyRepository;
import projetotcc.thiago.PlaySCORE_API.repository.EquipeLigaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.LigaRepository;

import java.util.List;

@Service
public class EquipeLigaService {

    @Autowired
    private EquipeLigaRepository equipeLigaRepository;

    @Autowired
    private LigaRepository ligaRepository;

    @Autowired
    private EquipeFantasyRepository equipeFantasyRepository;

    public List<EquipeLiga> listarTodos() {
        return equipeLigaRepository.findAll();
    }

    public EquipeLiga buscarPorId(Long id) {
        return equipeLigaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EquipeLiga", id));
    }

    public EquipeLiga salvar(EquipeLigaRequest request) {
        Liga liga = ligaRepository.findById(request.getIdLiga())
                .orElseThrow(() -> new ResourceNotFoundException("Liga", request.getIdLiga()));

        EquipeFantasy equipeFantasy = equipeFantasyRepository.findById(request.getIdEquipeFantasy())
                .orElseThrow(() -> new ResourceNotFoundException("EquipeFantasy", request.getIdEquipeFantasy()));

        EquipeLiga equipeLiga = new EquipeLiga();
        equipeLiga.setPatrimonio(request.getPatrimonio());
        equipeLiga.setPontuacaoTotal(request.getPontuacaoTotal() == null ? 0.0 : request.getPontuacaoTotal());
        equipeLiga.setLiga(liga);
        equipeLiga.setEquipeFantasy(equipeFantasy);
        return equipeLigaRepository.save(equipeLiga);
    }
}
