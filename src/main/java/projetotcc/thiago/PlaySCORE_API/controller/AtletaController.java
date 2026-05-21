package projetotcc.thiago.PlaySCORE_API.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import projetotcc.thiago.PlaySCORE_API.dto.AtletaRequest;
import projetotcc.thiago.PlaySCORE_API.model.Atleta;
import projetotcc.thiago.PlaySCORE_API.service.AtletaService;

import java.util.List;

@RestController
@RequestMapping("/atletas")
public class AtletaController {

    @Autowired
    private AtletaService atletaService;

    @GetMapping
    public List<Atleta> listarTodos() {
        return atletaService.listarTodos();
    }

    @GetMapping("/{id}")
    public Atleta buscarPorId(@PathVariable Long id) {
        return atletaService.buscarPorId(id);
    }

    @PostMapping
    public Atleta salvar(@Valid @RequestBody AtletaRequest request) {
        return atletaService.salvar(request);
    }
}
