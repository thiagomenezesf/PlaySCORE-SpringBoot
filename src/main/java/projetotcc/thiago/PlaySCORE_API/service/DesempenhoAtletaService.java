package projetotcc.thiago.PlaySCORE_API.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projetotcc.thiago.PlaySCORE_API.dto.DesempenhoAtletaRequest;
import projetotcc.thiago.PlaySCORE_API.exception.ResourceNotFoundException;
import projetotcc.thiago.PlaySCORE_API.model.Atleta;
import projetotcc.thiago.PlaySCORE_API.model.DesempenhoAtleta;
import projetotcc.thiago.PlaySCORE_API.model.Rodada;
import projetotcc.thiago.PlaySCORE_API.repository.AtletaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.DesempenhoAtletaRepository;
import projetotcc.thiago.PlaySCORE_API.repository.RodadaRepository;

import java.util.List;

@Service
public class DesempenhoAtletaService {

    @Autowired
    private DesempenhoAtletaRepository desempenhoAtletaRepository;

    @Autowired
    private AtletaRepository atletaRepository;

    @Autowired
    private RodadaRepository rodadaRepository;

    public List<DesempenhoAtleta> listarTodos() {
        return desempenhoAtletaRepository.findAll();
    }

    public DesempenhoAtleta buscarPorId(Long id) {
        return desempenhoAtletaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DesempenhoAtleta", id));
    }

    public DesempenhoAtleta salvar(DesempenhoAtletaRequest request) {
        Atleta atleta = atletaRepository.findById(request.getIdAtleta())
                .orElseThrow(() -> new ResourceNotFoundException("Atleta", request.getIdAtleta()));

        Rodada rodada = rodadaRepository.findById(request.getIdRodada())
                .orElseThrow(() -> new ResourceNotFoundException("Rodada", request.getIdRodada()));

        DesempenhoAtleta desempenho = new DesempenhoAtleta();
        desempenho.setAtleta(atleta);
        desempenho.setRodada(rodada);
        desempenho.setGols(request.getGols());
        desempenho.setAssistencias(request.getAssistencias());
        desempenho.setCartoesAmarelos(request.getCartoesAmarelos());
        desempenho.setCartoesVermelhos(request.getCartoesVermelhos());
        desempenho.setFinalizacoes(request.getFinalizacoes());
        desempenho.setImpedimentos(request.getImpedimentos());
        desempenho.setFaltasCometidas(request.getFaltasCometidas());
        desempenho.setFaltasRecebidas(request.getFaltasRecebidas());
        desempenho.setCanetas(request.getCanetas());
        desempenho.setChapeus(request.getChapeus());
        desempenho.setDriblesSimples(request.getDriblesSimples());
        desempenho.setPontosCalculados(request.getPontosCalculados());
        desempenho.setValorAtualizado(request.getValorAtualizado());
        return desempenhoAtletaRepository.save(desempenho);
    }
}
