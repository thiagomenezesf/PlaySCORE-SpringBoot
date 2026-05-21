package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projetotcc.thiago.PlaySCORE_API.dto.LigaRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.Campeonato;
import projetotcc.thiago.PlaySCORE_API.model.Liga;
import projetotcc.thiago.PlaySCORE_API.model.Usuario;
import projetotcc.thiago.PlaySCORE_API.repository.CampeonatoRepository;
import projetotcc.thiago.PlaySCORE_API.repository.LigaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.UsuarioRepository;

import java.util.List;

@Service
public class LigaService {

    @Autowired
    private LigaRepository ligaRepository;

    @Autowired
    private CampeonatoRepository campeonatoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Liga> listarTodos() {
        return ligaRepository.findAll();
    }

    public Liga buscarPorId(Long id) {
        return ligaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Liga", id));
    }

    public Liga salvar(LigaRequest request) {
        Campeonato campeonato = campeonatoRepository.findById(request.getIdCampeonato())
                .orElseThrow(() -> new ResourceNotFoundException("Campeonato", request.getIdCampeonato()));

        Usuario criador = usuarioRepository.findById(request.getIdUsuarioCriador())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", request.getIdUsuarioCriador()));

        Liga liga = new Liga();
        liga.setNome(request.getNome());
        liga.setLogo(request.getLogo());
        liga.setCodigoAcesso(request.getCodigoAcesso());
        liga.setMaximoParticipantes(request.getMaximoParticipantes());
        liga.setDescricao(request.getDescricao());
        liga.setCampeonato(campeonato);
        liga.setCriador(criador);
        return ligaRepository.save(liga);
    }
}
