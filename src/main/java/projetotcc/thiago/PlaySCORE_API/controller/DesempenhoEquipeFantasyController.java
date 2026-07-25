package projetotcc.thiago.PlaySCORE_API.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import projetotcc.thiago.PlaySCORE_API.dto.DesempenhoEquipeFantasyRequest;
import projetotcc.thiago.PlaySCORE_API.model.DesempenhoEquipeFantasy;
import projetotcc.thiago.PlaySCORE_API.service.DesempenhoEquipeFantasyService;

import java.util.List;

@RestController
@RequestMapping("/desempenho-equipe-fantasy")
public class DesempenhoEquipeFantasyController {

    @Autowired
    private DesempenhoEquipeFantasyService desempenhoEquipeFantasyService;

    @GetMapping
    public List<DesempenhoEquipeFantasy> listarTodos() {
        return desempenhoEquipeFantasyService.listarTodos();
    }

    @GetMapping("/{id}")
    public DesempenhoEquipeFantasy buscarPorId(@PathVariable Long id) {
        return desempenhoEquipeFantasyService.buscarPorId(id);
    }

    @PostMapping
    public DesempenhoEquipeFantasy salvar(@Valid @RequestBody DesempenhoEquipeFantasyRequest request) {
        return desempenhoEquipeFantasyService.salvar(request);
    }
}
