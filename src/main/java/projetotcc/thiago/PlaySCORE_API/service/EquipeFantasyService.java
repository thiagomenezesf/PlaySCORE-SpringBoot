package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projetotcc.thiago.PlaySCORE_API.dto.EquipeFantasyRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.EquipeFantasy;
import projetotcc.thiago.PlaySCORE_API.model.Usuario;
import projetotcc.thiago.PlaySCORE_API.repository.EquipeFantasyRepository;
import projetotcc.thiago.PlaySCORE_API.repository.UsuarioRepository;

import java.util.List;

@Service
public class EquipeFantasyService {

    @Autowired
    private EquipeFantasyRepository equipeFantasyRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<EquipeFantasy> listarTodos() {
        return equipeFantasyRepository.findAll();
    }

    public EquipeFantasy buscarPorId(Long id) {
        return equipeFantasyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EquipeFantasy", id));
    }

    public EquipeFantasy salvar(EquipeFantasyRequest request) {
        Usuario criador = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", request.getIdUsuario()));

        EquipeFantasy equipeFantasy = new EquipeFantasy();
        equipeFantasy.setNome(request.getNome());
        equipeFantasy.setLogo(request.getLogo());
        equipeFantasy.setPatrimonio(request.getPatrimonio() == null ? 100.0 : request.getPatrimonio());
        equipeFantasy.setTitulos(request.getTitulos() == null ? 0 : request.getTitulos());
        equipeFantasy.setCriador(criador);
        return equipeFantasyRepository.save(equipeFantasy);
    }

    public EquipeFantasy atualizar(Long id, EquipeFantasyRequest request) {
        EquipeFantasy equipeFantasy = buscarPorId(id);
        equipeFantasy.setNome(request.getNome());
        equipeFantasy.setLogo(request.getLogo());
        if (request.getPatrimonio() != null) {
            equipeFantasy.setPatrimonio(request.getPatrimonio());
        }
        if (request.getTitulos() != null) {
            equipeFantasy.setTitulos(request.getTitulos());
        }
        return equipeFantasyRepository.save(equipeFantasy);
    }

    public void deletar(Long id) {
        EquipeFantasy equipeFantasy = buscarPorId(id);
        equipeFantasyRepository.delete(equipeFantasy);
    }
}
