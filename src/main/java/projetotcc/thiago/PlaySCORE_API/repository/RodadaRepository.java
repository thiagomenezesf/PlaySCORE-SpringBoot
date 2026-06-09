package projetotcc.thiago.PlaySCORE_API.repository;

import projetotcc.thiago.PlaySCORE_API.model.Rodada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RodadaRepository extends JpaRepository<Rodada, Long> {
    List<Rodada> findByCampeonatoId(Long campeonatoId);
    Optional<Rodada> findByCampeonatoIdAndNumero(Long campeonatoId, Integer numero);
    Optional<Rodada> findTopByCampeonatoIdOrderByNumeroDesc(Long campeonatoId);
}