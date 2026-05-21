package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projetotcc.thiago.PlaySCORE_API.dto.CampeonatoRodadaRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.CampeonatoRodada;
import projetotcc.thiago.PlaySCORE_API.model.Campeonato;
import projetotcc.thiago.PlaySCORE_API.model.Rodada;
import projetotcc.thiago.PlaySCORE_API.repository.CampeonatoRepository;
import projetotcc.thiago.PlaySCORE_API.repository.CampeonatoRodadaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.RodadaRepository;

import java.util.List;

@Service
public class CampeonatoRodadaService {

    @Autowired
    private CampeonatoRodadaRepository campeonatoRodadaRepository;

    @Autowired
    private CampeonatoRepository campeonatoRepository;

    @Autowired
    private RodadaRepository rodadaRepository;

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

        CampeonatoRodada registro = new CampeonatoRodada();
        registro.setCampeonato(campeonato);
        registro.setRodada(rodada);
        return campeonatoRodadaRepository.save(registro);
    }
}
