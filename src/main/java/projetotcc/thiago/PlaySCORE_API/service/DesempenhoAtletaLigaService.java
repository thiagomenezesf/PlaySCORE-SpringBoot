package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projetotcc.thiago.PlaySCORE_API.dto.DesempenhoAtletaLigaRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.DesempenhoAtleta;
import projetotcc.thiago.PlaySCORE_API.model.DesempenhoAtletaLiga;
import projetotcc.thiago.PlaySCORE_API.model.Liga;
import projetotcc.thiago.PlaySCORE_API.model.Rodada;
import projetotcc.thiago.PlaySCORE_API.repository.DesempenhoAtletaLigaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.DesempenhoAtletaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.LigaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.RodadaRepository;

import java.util.List;

@Service
public class DesempenhoAtletaLigaService {

    @Autowired
    private DesempenhoAtletaLigaRepository desempenhoAtletaLigaRepository;

    @Autowired
    private DesempenhoAtletaRepository desempenhoAtletaRepository;

    @Autowired
    private LigaRepository ligaRepository;

    @Autowired
    private RodadaRepository rodadaRepository;

    public List<DesempenhoAtletaLiga> listarTodos() {
        return desempenhoAtletaLigaRepository.findAll();
    }

    public DesempenhoAtletaLiga buscarPorId(Long id) {
        return desempenhoAtletaLigaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DesempenhoAtletaLiga", id));
    }

    public DesempenhoAtletaLiga salvar(DesempenhoAtletaLigaRequest request) {
        DesempenhoAtleta desempenhoAtleta = desempenhoAtletaRepository.findById(request.getIdDesempenhoAtleta())
                .orElseThrow(() -> new ResourceNotFoundException("DesempenhoAtleta", request.getIdDesempenhoAtleta()));

        Liga liga = ligaRepository.findById(request.getIdLiga())
                .orElseThrow(() -> new ResourceNotFoundException("Liga", request.getIdLiga()));

        Rodada rodada = rodadaRepository.findById(request.getIdRodada())
                .orElseThrow(() -> new ResourceNotFoundException("Rodada", request.getIdRodada()));

        DesempenhoAtletaLiga desempenhoAtletaLiga = new DesempenhoAtletaLiga();
        desempenhoAtletaLiga.setDesempenhoAtleta(desempenhoAtleta);
        desempenhoAtletaLiga.setLiga(liga);
        desempenhoAtletaLiga.setRodada(rodada);
        desempenhoAtletaLiga.setPontosCalculados(request.getPontosCalculados() == null ? 0.0 : request.getPontosCalculados());
        desempenhoAtletaLiga.setValorAtual(request.getValorAtual() == null ? 0.0 : request.getValorAtual());
        desempenhoAtletaLiga.setValorAtualizado(request.getValorAtualizado() == null ? 0.0 : request.getValorAtualizado());

        return desempenhoAtletaLigaRepository.save(desempenhoAtletaLiga);
    }
}
