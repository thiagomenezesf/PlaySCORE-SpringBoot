package projetotcc.thiago.PlaySCORE_API.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import projetotcc.thiago.PlaySCORE_API.dto.DesempenhoAtletaRequest;
import projetotcc.thiago.PlaySCORE_API.model.DesempenhoAtleta;
import projetotcc.thiago.PlaySCORE_API.service.DesempenhoAtletaService;

import java.util.List;

@RestController
@RequestMapping("/desempenho-atleta")
public class DesempenhoAtletaController {

    @Autowired
    private DesempenhoAtletaService desempenhoAtletaService;

    @GetMapping
    public List<DesempenhoAtleta> listarTodos() {
        return desempenhoAtletaService.listarTodos();
    }

    @GetMapping("/{id}")
    public DesempenhoAtleta buscarPorId(@PathVariable Long id) {
        return desempenhoAtletaService.buscarPorId(id);
    }

    @PostMapping
    public DesempenhoAtleta salvar(@Valid @RequestBody DesempenhoAtletaRequest request) {
        return desempenhoAtletaService.salvar(request);
    }
}
