package projetotcc.thiago.PlaySCORE_API.repository;

import projetotcc.thiago.PlaySCORE_API.model.EquipeFantasy;
import projetotcc.thiago.PlaySCORE_API.model.Usuario;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EquipeFantasyRepository extends JpaRepository<EquipeFantasy, Long> {
    // Aqui o Spring já te dá de graça os métodos:
    // save(), findAll(), findById(), delete()... sem você digitar nada!
    Optional<EquipeFantasy> findByCriador(Usuario criador);

}