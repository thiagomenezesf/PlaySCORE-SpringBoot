package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projetotcc.thiago.PlaySCORE_API.dto.RegraPontuacaoLigaRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.Liga;
import projetotcc.thiago.PlaySCORE_API.model.RegraPontuacaoLiga;
import projetotcc.thiago.PlaySCORE_API.repository.LigaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.RegraPontuacaoLigaRepository;

import java.util.List;

@Service
public class RegraPontuacaoLigaService {

    @Autowired
    private RegraPontuacaoLigaRepository regraRepository;

    @Autowired
    private LigaRepository ligaRepository;

    public List<RegraPontuacaoLiga> listarTodos() {
        return regraRepository.findAll();
    }

    public RegraPontuacaoLiga buscarPorId(Long id) {
        return regraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RegraPontuacaoLiga", id));
    }

    public RegraPontuacaoLiga salvar(RegraPontuacaoLigaRequest request) {
        Liga liga = ligaRepository.findById(request.getIdLiga())
                .orElseThrow(() -> new ResourceNotFoundException("Liga", request.getIdLiga()));

        RegraPontuacaoLiga regra = new RegraPontuacaoLiga();
        regra.setAcao(request.getAcao());
        regra.setValor(request.getValor());
        regra.setLiga(liga);
        return regraRepository.save(regra);
    }
}
