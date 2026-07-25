package projetotcc.thiago.PlaySCORE_API.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import projetotcc.thiago.PlaySCORE_API.dto.EquipeFantasyRequest;
import projetotcc.thiago.PlaySCORE_API.model.EquipeFantasy;
import projetotcc.thiago.PlaySCORE_API.service.EquipeFantasyService;

import java.util.List;

@RestController
@RequestMapping("/equipe-fantasy")
public class EquipeFantasyController {

    @Autowired
    private EquipeFantasyService equipeFantasyService;

    @GetMapping
    public List<EquipeFantasy> listarTodos() {
        return equipeFantasyService.listarTodos();
    }

    @GetMapping("/{id}")
    public EquipeFantasy buscarPorId(@PathVariable Long id) {
        return equipeFantasyService.buscarPorId(id);
    }

    @PostMapping
    public EquipeFantasy salvar(@Valid @RequestBody EquipeFantasyRequest request) {
        return equipeFantasyService.salvar(request);
    }

    @PutMapping("/{id}")
    public EquipeFantasy atualizar(@PathVariable Long id, @Valid @RequestBody EquipeFantasyRequest request) {
        return equipeFantasyService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        equipeFantasyService.deletar(id);
    }
}
