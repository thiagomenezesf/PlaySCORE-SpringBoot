package projetotcc.thiago.PlaySCORE_API.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import projetotcc.thiago.PlaySCORE_API.dto.LoginRequest;
import projetotcc.thiago.PlaySCORE_API.dto.UsuarioRequest;
import projetotcc.thiago.PlaySCORE_API.model.Usuario;
import projetotcc.thiago.PlaySCORE_API.service.UsuarioService;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/login")
    public Map<String, String> loginInfo() {
        return Map.of("message", "Use POST /auth/login with JSON {email, senha}");
    }

    @PostMapping("/login")
    public Usuario login(@Valid @RequestBody LoginRequest request) {
        return usuarioService.autenticar(request.getEmail(), request.getSenha());
    }

    @GetMapping("/register")
    public Map<String, String> registerInfo() {
        return Map.of("message", "Use POST /auth/register with JSON {nome, email, senha}");
    }

    @PostMapping("/register")
    public Usuario register(@Valid @RequestBody UsuarioRequest request) {
        return usuarioService.salvar(request);
    }
}
