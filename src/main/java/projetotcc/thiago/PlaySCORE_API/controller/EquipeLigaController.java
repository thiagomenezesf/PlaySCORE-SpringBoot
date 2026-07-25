package projetotcc.thiago.PlaySCORE_API.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import projetotcc.thiago.PlaySCORE_API.dto.EquipeLigaRequest;
import projetotcc.thiago.PlaySCORE_API.model.EquipeLiga;
import projetotcc.thiago.PlaySCORE_API.service.EquipeLigaService;

import java.util.List;

@RestController
@RequestMapping("/equipe-liga")
public class EquipeLigaController {

    @Autowired
    private EquipeLigaService equipeLigaService;

    @GetMapping
    public List<EquipeLiga> listarTodos() {
        return equipeLigaService.listarTodos();
    }

    @GetMapping("/{id}")
    public EquipeLiga buscarPorId(@PathVariable Long id) {
        return equipeLigaService.buscarPorId(id);
    }

    @PostMapping
    public EquipeLiga salvar(@Valid @RequestBody EquipeLigaRequest request) {
        return equipeLigaService.salvar(request);
    }
}
