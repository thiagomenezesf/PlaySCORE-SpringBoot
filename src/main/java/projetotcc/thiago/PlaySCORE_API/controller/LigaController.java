package projetotcc.thiago.PlaySCORE_API.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import projetotcc.thiago.PlaySCORE_API.dto.LigaRequest;
import projetotcc.thiago.PlaySCORE_API.model.Liga;
import projetotcc.thiago.PlaySCORE_API.service.LigaService;

import java.util.List;

@RestController
@RequestMapping("/ligas")
public class LigaController {

    @Autowired
    private LigaService ligaService;

    @GetMapping
    public List<Liga> listarTodos() {
        return ligaService.listarTodos();
    }

    @GetMapping("/{id}")
    public Liga buscarPorId(@PathVariable Long id) {
        return ligaService.buscarPorId(id);
    }

    @PostMapping
    public Liga salvar(@Valid @RequestBody LigaRequest request) {
        return ligaService.salvar(request);
    }
}
