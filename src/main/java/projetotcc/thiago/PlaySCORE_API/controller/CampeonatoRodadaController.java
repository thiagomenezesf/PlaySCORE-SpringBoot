package projetotcc.thiago.PlaySCORE_API.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import projetotcc.thiago.PlaySCORE_API.dto.CampeonatoRodadaRequest;
import projetotcc.thiago.PlaySCORE_API.model.CampeonatoRodada;
import projetotcc.thiago.PlaySCORE_API.service.CampeonatoRodadaService;

import java.util.List;

@RestController
@RequestMapping("/campeonato-rodadas")
public class CampeonatoRodadaController {

    @Autowired
    private CampeonatoRodadaService campeonatoRodadaService;

    @GetMapping
    public List<CampeonatoRodada> listarTodos() {
        return campeonatoRodadaService.listarTodos();
    }

    @GetMapping("/{id}")
    public CampeonatoRodada buscarPorId(@PathVariable Long id) {
        return campeonatoRodadaService.buscarPorId(id);
    }

    @PostMapping
    public CampeonatoRodada salvar(@Valid @RequestBody CampeonatoRodadaRequest request) {
        return campeonatoRodadaService.salvar(request);
    }
}
