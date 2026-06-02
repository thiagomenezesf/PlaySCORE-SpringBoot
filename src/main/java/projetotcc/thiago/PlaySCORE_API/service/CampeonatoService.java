package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projetotcc.thiago.PlaySCORE_API.dto.CampeonatoRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.Campeonato;
import projetotcc.thiago.PlaySCORE_API.model.Clube;
import projetotcc.thiago.PlaySCORE_API.model.Liga;
import projetotcc.thiago.PlaySCORE_API.model.Usuario;
import projetotcc.thiago.PlaySCORE_API.repository.AtletaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.CampeonatoRepository;
import projetotcc.thiago.PlaySCORE_API.repository.ClubeRepository;
import projetotcc.thiago.PlaySCORE_API.repository.LigaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.UsuarioRepository;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CampeonatoService {

    @Autowired
    private CampeonatoRepository campeonatoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClubeRepository clubeRepository;

    @Autowired
    private AtletaRepository atletaRepository;

    @Autowired
    private LigaRepository ligaRepository;

    public List<Campeonato> listarTodos() {
        List<Campeonato> campeonatos = campeonatoRepository.findAll();

        for (Campeonato c : campeonatos) {
            long clubesCount = clubeRepository.countByCampeonatoId(c.getId());
            c.setTotalClubes((int) clubesCount);

            if (clubesCount > 0) {
                // obter ids dos clubes para contar atletas
                List<Clube> clubes = clubeRepository.findByCampeonatoId(c.getId());
                List<Long> clubeIds = clubes.stream().map(Clube::getId).collect(Collectors.toList());
                long atletasCount = atletaRepository.countByClubeIdIn(clubeIds);
                c.setTotalAtletas((int) atletasCount);
            } else {
                c.setTotalAtletas(0);
            }
        }

        return campeonatos;
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

    @Transactional
    public void deletar(Long id) {
        Campeonato campeonato = buscarPorId(id);

        List<Clube> clubes = clubeRepository.findByCampeonatoId(campeonato.getId());
        List<Long> clubeIds = clubes.stream().map(Clube::getId).collect(Collectors.toList());

        if (!clubeIds.isEmpty()) {
            atletaRepository.deleteByClubeIdIn(clubeIds);
            clubeRepository.deleteAll(clubes);
        }

        List<Liga> ligas = ligaRepository.findByCampeonatoId(campeonato.getId());
        if (!ligas.isEmpty()) {
            ligaRepository.deleteAll(ligas);
        }

        campeonatoRepository.delete(campeonato);
    }
}
