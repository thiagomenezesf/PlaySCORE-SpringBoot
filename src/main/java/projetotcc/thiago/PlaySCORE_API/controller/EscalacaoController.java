package projetotcc.thiago.PlaySCORE_API.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import projetotcc.thiago.PlaySCORE_API.dto.EscalacaoRequest;
import projetotcc.thiago.PlaySCORE_API.model.Escalacao;
import projetotcc.thiago.PlaySCORE_API.service.EscalacaoService;

import java.util.List;

@RestController
@RequestMapping("/escalacoes")
public class EscalacaoController {

    @Autowired
    private EscalacaoService escalacaoService;

    @GetMapping
    public List<Escalacao> listarTodos() {
        return escalacaoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Escalacao buscarPorId(@PathVariable String id) {
        return escalacaoService.buscarPorId(id);
    }

    @PostMapping
    public Escalacao salvar(@Valid @RequestBody EscalacaoRequest request) {
        return escalacaoService.salvar(request);
    }
}
