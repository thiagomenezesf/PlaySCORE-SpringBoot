package projetotcc.thiago.PlaySCORE_API.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import projetotcc.thiago.PlaySCORE_API.dto.DesempenhoAtletaLigaRequest;
import projetotcc.thiago.PlaySCORE_API.model.DesempenhoAtletaLiga;
import projetotcc.thiago.PlaySCORE_API.service.DesempenhoAtletaLigaService;

import java.util.List;

@RestController
@RequestMapping("/desempenho-atleta-liga")
public class DesempenhoAtletaLigaController {

    @Autowired
    private DesempenhoAtletaLigaService desempenhoAtletaLigaService;

    @GetMapping
    public List<DesempenhoAtletaLiga> listarTodos() {
        return desempenhoAtletaLigaService.listarTodos();
    }

    @GetMapping("/{id}")
    public DesempenhoAtletaLiga buscarPorId(@PathVariable Long id) {
        return desempenhoAtletaLigaService.buscarPorId(id);
    }

    @PostMapping
    public DesempenhoAtletaLiga salvar(@Valid @RequestBody DesempenhoAtletaLigaRequest request) {
        return desempenhoAtletaLigaService.salvar(request);
    }
}
