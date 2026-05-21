package projetotcc.thiago.PlaySCORE_API.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import projetotcc.thiago.PlaySCORE_API.dto.RodadaRequest;
import projetotcc.thiago.PlaySCORE_API.model.Rodada;
import projetotcc.thiago.PlaySCORE_API.service.RodadaService;
import projetotcc.thiago.PlaySCORE_API.service.GameRulesService;

import java.util.List;

@RestController
@RequestMapping("/rodadas")
public class RodadaController {

    @Autowired
    private RodadaService rodadaService;

    @Autowired
    private GameRulesService gameRulesService;

    @GetMapping
    public List<Rodada> listarTodos() {
        return rodadaService.listarTodos();
    }

    @GetMapping("/{id}")
    public Rodada buscarPorId(@PathVariable Long id) {
        return rodadaService.buscarPorId(id);
    }

    @PostMapping
    public Rodada salvar(@Valid @RequestBody RodadaRequest request) {
        return rodadaService.salvar(request);
    }

    @PostMapping("/{id}/fechar")
    public String fecharRodada(@PathVariable Long id) {
        // Executa o fechamento da rodada usando o GameRulesService
        gameRulesService.fecharRodada(id);
        return "Rodada " + id + " fechada";
    }
}
