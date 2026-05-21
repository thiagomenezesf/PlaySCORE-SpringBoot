package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projetotcc.thiago.PlaySCORE_API.dto.CampeonatoRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.Campeonato;
import projetotcc.thiago.PlaySCORE_API.model.Usuario;
import projetotcc.thiago.PlaySCORE_API.repository.CampeonatoRepository;
import projetotcc.thiago.PlaySCORE_API.repository.UsuarioRepository;

import java.util.List;

@Service
public class CampeonatoService {

    @Autowired
    private CampeonatoRepository campeonatoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Campeonato> listarTodos() {
        return campeonatoRepository.findAll();
    }

    public Campeonato buscarPorId(Long id) {
        return campeonatoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campeonato", id));
    }

    public Campeonato salvar(CampeonatoRequest request) {
        Usuario criador = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", request.getIdUsuario()));

        Campeonato campeonato = new Campeonato();
        campeonato.setNome(request.getNome());
        campeonato.setLogo(request.getLogo());
        campeonato.setTipoJogo(request.getTipoJogo());
        campeonato.setCriador(criador);
        campeonato.setDescricao(request.getDescricao());
        campeonato.setStatus(request.getStatus());
        campeonato.setNumeroDeJogadoresJogando(request.getNumeroDeJogadoresJogando());
        return campeonatoRepository.save(campeonato);
    }

    public List<Campeonato> listarPorUsuario(Long idUsuario) {
        return campeonatoRepository.findByCriadorId(idUsuario);
    }

    public Campeonato atualizar(Long id, CampeonatoRequest request) {
        Campeonato campeonato = buscarPorId(id);
        campeonato.setNome(request.getNome());
        campeonato.setLogo(request.getLogo());
        campeonato.setTipoJogo(request.getTipoJogo());
        campeonato.setDescricao(request.getDescricao());
        campeonato.setStatus(request.getStatus());
        campeonato.setNumeroDeJogadoresJogando(request.getNumeroDeJogadoresJogando());
        return campeonatoRepository.save(campeonato);
    }

    public void deletar(Long id) {
        Campeonato campeonato = buscarPorId(id);
        campeonatoRepository.delete(campeonato);
    }
}
