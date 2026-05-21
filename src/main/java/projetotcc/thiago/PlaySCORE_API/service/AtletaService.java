package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projetotcc.thiago.PlaySCORE_API.dto.AtletaRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.Atleta;
import projetotcc.thiago.PlaySCORE_API.model.Clube;
import projetotcc.thiago.PlaySCORE_API.repository.AtletaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.ClubeRepository;

import java.util.List;

@Service
public class AtletaService {

    @Autowired
    private AtletaRepository atletaRepository;

    @Autowired
    private ClubeRepository clubeRepository;

    public List<Atleta> listarTodos() {
        return atletaRepository.findAll();
    }

    public Atleta buscarPorId(Long id) {
        return atletaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atleta", id));
    }

    public Atleta salvar(AtletaRequest request) {
        Clube clube = clubeRepository.findById(request.getIdClube())
                .orElseThrow(() -> new ResourceNotFoundException("Clube", request.getIdClube()));

        Atleta atleta = new Atleta();
        atleta.setNome(request.getNome());
        atleta.setFoto(request.getFoto());
        atleta.setPosicao(request.getPosicao());
        atleta.setPrecoInicial(request.getPrecoInicial());
        atleta.setPrecoAtual(request.getPrecoAtual());
        atleta.setClube(clube);
        return atletaRepository.save(atleta);
    }
}
