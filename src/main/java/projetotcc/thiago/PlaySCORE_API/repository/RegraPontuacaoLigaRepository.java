package projetotcc.thiago.PlaySCORE_API.repository;

import projetotcc.thiago.PlaySCORE_API.model.RegraPontuacaoLiga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegraPontuacaoLigaRepository extends JpaRepository<RegraPontuacaoLiga, Long> {
    java.util.List<RegraPontuacaoLiga> findByLigaId(Long ligaId);
}
