package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import projetotcc.thiago.PlaySCORE_API.dto.ClubeRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.Campeonato;
import projetotcc.thiago.PlaySCORE_API.model.Clube;
import projetotcc.thiago.PlaySCORE_API.repository.CampeonatoRepository;
import projetotcc.thiago.PlaySCORE_API.repository.ClubeRepository;

import java.util.List;

@Service
public class ClubeService {

    @Autowired
    private ClubeRepository clubeRepository;

    @Autowired
    private CampeonatoRepository campeonatoRepository;

    public List<Clube> listarTodos() {
        return clubeRepository.findAll();
    }

    public Clube buscarPorId(Long id) {
        return clubeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clube", id));
    }

    public Clube salvar(ClubeRequest request) {
        Campeonato campeonato = campeonatoRepository.findById(request.getIdCampeonato())
                .orElseThrow(() -> new ResourceNotFoundException("Campeonato", request.getIdCampeonato()));

        Clube clube = new Clube();
        clube.setNome(request.getNome());
        clube.setLogo(request.getLogo());
        clube.setSigla(request.getSigla());
        clube.setCampeonato(campeonato);
        return clubeRepository.save(clube);
    }

    public Clube atualizar(Long id, ClubeRequest request) {
        Clube clube = buscarPorId(id);
        clube.setNome(request.getNome());
        clube.setLogo(request.getLogo());
        clube.setSigla(request.getSigla());
        if (request.getIdCampeonato() != null) {
            Campeonato campeonato = campeonatoRepository.findById(request.getIdCampeonato())
                    .orElseThrow(() -> new ResourceNotFoundException("Campeonato", request.getIdCampeonato()));
            clube.setCampeonato(campeonato);
        }
        return clubeRepository.save(clube);
    }

    @Transactional
    public void deletar(Long id) {
        Clube clube = buscarPorId(id);
        clubeRepository.delete(clube);
    }
}
