package projetotcc.thiago.PlaySCORE_API.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import projetotcc.thiago.PlaySCORE_API.model.DesempenhoAtletaLiga;

import java.util.List;
import java.util.Optional;

@Repository
public interface DesempenhoAtletaLigaRepository extends JpaRepository<DesempenhoAtletaLiga, Long> {
    Optional<DesempenhoAtletaLiga> findByDesempenhoAtletaIdAndLigaId(Long desempenhoAtletaId, Long ligaId);
    Optional<DesempenhoAtletaLiga> findByDesempenhoAtletaIdAndLigaIdAndRodadaId(Long desempenhoAtletaId, Long ligaId, Long rodadaId);
    Optional<DesempenhoAtletaLiga> findFirstByDesempenhoAtletaAtletaIdAndLigaIdAndRodadaNumeroLessThanOrderByRodadaNumeroDesc(Long atletaId, Long ligaId, Integer rodadaNumero);
    List<DesempenhoAtletaLiga> findByLigaId(Long ligaId);
    List<DesempenhoAtletaLiga> findByLigaIdAndRodadaId(Long ligaId, Long rodadaId);
}
