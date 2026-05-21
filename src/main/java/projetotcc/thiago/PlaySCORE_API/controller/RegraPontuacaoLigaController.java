package projetotcc.thiago.PlaySCORE_API.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import projetotcc.thiago.PlaySCORE_API.dto.RegraPontuacaoLigaRequest;
import projetotcc.thiago.PlaySCORE_API.model.RegraPontuacaoLiga;
import projetotcc.thiago.PlaySCORE_API.service.RegraPontuacaoLigaService;

import java.util.List;

@RestController
@RequestMapping("/regras-pontuacao-liga")
public class RegraPontuacaoLigaController {

    @Autowired
    private RegraPontuacaoLigaService regraService;

    @GetMapping
    public List<RegraPontuacaoLiga> listarTodos() {
        return regraService.listarTodos();
    }

    @GetMapping("/{id}")
    public RegraPontuacaoLiga buscarPorId(@PathVariable Long id) {
        return regraService.buscarPorId(id);
    }

    @PostMapping
    public RegraPontuacaoLiga salvar(@Valid @RequestBody RegraPontuacaoLigaRequest request) {
        return regraService.salvar(request);
    }
}
