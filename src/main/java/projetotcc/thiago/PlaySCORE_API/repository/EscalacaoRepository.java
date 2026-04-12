package projetotcc.thiago.PlaySCORE_API.repository;

import projetotcc.thiago.PlaySCORE_API.model.Escalacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EscalacaoRepository extends JpaRepository<Escalacao, Long> {
    // Aqui o Spring já te dá de graça os métodos:
    // save(), findAll(), findById(), delete()... sem você digitar nada!
}