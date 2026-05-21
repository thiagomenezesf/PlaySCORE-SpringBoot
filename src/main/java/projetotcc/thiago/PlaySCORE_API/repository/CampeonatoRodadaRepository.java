package projetotcc.thiago.PlaySCORE_API.repository;

import projetotcc.thiago.PlaySCORE_API.model.CampeonatoRodada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampeonatoRodadaRepository extends JpaRepository<CampeonatoRodada, Long> {
}
