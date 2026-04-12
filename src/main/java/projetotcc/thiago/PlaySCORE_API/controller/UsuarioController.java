package projetotcc.thiago.PlaySCORE_API.controller;

import projetotcc.thiago.PlaySCORE_API.model.Usuario;
import projetotcc.thiago.PlaySCORE_API.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Diz que esta classe é uma API
@RequestMapping("/usuarios") // Define que a URL base será http://localhost:8080/usuarios
public class UsuarioController {

    @Autowired // Faz o Spring "injetar" o repositório aqui automaticamente
    private UsuarioRepository usuarioRepository;

    // ROTA PARA LISTAR TODOS (GET)
    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // ROTA PARA SALVAR UM NOVO (POST)
    @PostMapping
    public Usuario salvar(@RequestBody Usuario usuario) {
        // O @RequestBody pega o JSON que o Front enviar e transforma em objeto Usuario
        return usuarioRepository.save(usuario);
    }
}