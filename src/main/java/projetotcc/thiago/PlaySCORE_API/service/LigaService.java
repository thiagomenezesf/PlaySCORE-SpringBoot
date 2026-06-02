package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import projetotcc.thiago.PlaySCORE_API.dto.LigaRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.Campeonato;
import projetotcc.thiago.PlaySCORE_API.model.Liga;
import projetotcc.thiago.PlaySCORE_API.model.Usuario;
import projetotcc.thiago.PlaySCORE_API.repository.CampeonatoRepository;
import projetotcc.thiago.PlaySCORE_API.repository.EquipeLigaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.LigaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.RegraPontuacaoLigaRepository;
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

    @Autowired
    private RegraPontuacaoLigaRepository regraPontuacaoLigaRepository;

    @Autowired
    private EquipeLigaRepository equipeLigaRepository;

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

    public Liga atualizar(Long id, LigaRequest request) {
        Liga liga = buscarPorId(id);

        Campeonato campeonato = campeonatoRepository.findById(request.getIdCampeonato())
                .orElseThrow(() -> new ResourceNotFoundException("Campeonato", request.getIdCampeonato()));

        liga.setNome(request.getNome());
        liga.setLogo(request.getLogo());
        liga.setCodigoAcesso(request.getCodigoAcesso());
        liga.setMaximoParticipantes(request.getMaximoParticipantes());
        liga.setDescricao(request.getDescricao());
        liga.setCampeonato(campeonato);

        return ligaRepository.save(liga);
    }

    @Transactional
    public void deletar(Long id) {
        Liga liga = buscarPorId(id);

        regraPontuacaoLigaRepository.deleteAll(regraPontuacaoLigaRepository.findByLigaId(liga.getId()));
        equipeLigaRepository.deleteAll(equipeLigaRepository.findByLigaId(liga.getId()));

        ligaRepository.delete(liga);
    }
}

