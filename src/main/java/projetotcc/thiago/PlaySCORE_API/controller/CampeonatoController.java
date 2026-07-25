package projetotcc.thiago.PlaySCORE_API.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import projetotcc.thiago.PlaySCORE_API.dto.CampeonatoRequest;
import projetotcc.thiago.PlaySCORE_API.model.Campeonato;
import projetotcc.thiago.PlaySCORE_API.service.CampeonatoService;

import java.util.List;

@RestController
@RequestMapping("/campeonatos")
public class CampeonatoController {

    @Autowired
    private CampeonatoService campeonatoService;

    @GetMapping
    public List<Campeonato> listarTodos() {
        return campeonatoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Campeonato buscarPorId(@PathVariable Long id) {
        return campeonatoService.buscarPorId(id);
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<Campeonato> listarPorUsuario(@PathVariable Long idUsuario) {
        return campeonatoService.listarPorUsuario(idUsuario);
    }

    @PostMapping
    public Campeonato salvar(@Valid @RequestBody CampeonatoRequest request) {
        return campeonatoService.salvar(request);
    }

    @PutMapping("/{id}")
    public Campeonato atualizar(@PathVariable Long id, @Valid @RequestBody CampeonatoRequest request) {
        return campeonatoService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        campeonatoService.deletar(id);
    }
}
