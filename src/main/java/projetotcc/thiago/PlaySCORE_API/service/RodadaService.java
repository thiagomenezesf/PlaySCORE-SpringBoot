package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projetotcc.thiago.PlaySCORE_API.dto.RodadaRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.Campeonato;
import projetotcc.thiago.PlaySCORE_API.model.Rodada;
import projetotcc.thiago.PlaySCORE_API.repository.CampeonatoRepository;
import projetotcc.thiago.PlaySCORE_API.repository.RodadaRepository;

import java.util.List;

@Service
public class RodadaService {

    @Autowired
    private RodadaRepository rodadaRepository;

    @Autowired
    private CampeonatoRepository campeonatoRepository;

    public List<Rodada> listarTodos() {
        return rodadaRepository.findAll();
    }

    public Rodada buscarPorId(Long id) {
        return rodadaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rodada", id));
    }

    public Rodada salvar(RodadaRequest request) {
        Campeonato campeonato = campeonatoRepository.findById(request.getIdCampeonato())
                .orElseThrow(() -> new ResourceNotFoundException("Campeonato", request.getIdCampeonato()));

        Rodada rodada = new Rodada();
        rodada.setNumero(request.getNumero());
        rodada.setStatus(request.getStatus() == null ? "ABERTO" : request.getStatus());
        rodada.setCampeonato(campeonato);
        return rodadaRepository.save(rodada);
    }
}
