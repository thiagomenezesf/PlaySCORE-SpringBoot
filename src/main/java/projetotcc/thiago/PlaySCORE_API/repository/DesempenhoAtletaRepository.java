package projetotcc.thiago.PlaySCORE_API.repository;

import projetotcc.thiago.PlaySCORE_API.model.DesempenhoAtleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DesempenhoAtletaRepository extends JpaRepository<DesempenhoAtleta, Long> {
    java.util.List<DesempenhoAtleta> findByRodadaId(Long rodadaId);
    java.util.List<DesempenhoAtleta> findByAtletaIdAndRodadaId(Long atletaId, Long rodadaId);
    java.util.Optional<DesempenhoAtleta> findTopByAtletaIdAndRodadaNumeroLessThanOrderByRodadaNumeroDesc(Long atletaId, Integer rodadaNumero);
}

