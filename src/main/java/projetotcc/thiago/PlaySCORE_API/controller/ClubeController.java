package projetotcc.thiago.PlaySCORE_API.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import projetotcc.thiago.PlaySCORE_API.dto.ClubeRequest;
import projetotcc.thiago.PlaySCORE_API.model.Clube;
import projetotcc.thiago.PlaySCORE_API.service.ClubeService;

import java.util.List;

@RestController
@RequestMapping("/clubes")
public class ClubeController {

    @Autowired
    private ClubeService clubeService;

    @GetMapping
    public List<Clube> listarTodos() {
        return clubeService.listarTodos();
    }

    @GetMapping("/{id}")
    public Clube buscarPorId(@PathVariable Long id) {
        return clubeService.buscarPorId(id);
    }

    @PostMapping
    public Clube salvar(@Valid @RequestBody ClubeRequest request) {
        return clubeService.salvar(request);
    }
}
