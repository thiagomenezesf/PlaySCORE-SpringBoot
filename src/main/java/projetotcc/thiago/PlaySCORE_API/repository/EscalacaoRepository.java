package projetotcc.thiago.PlaySCORE_API.repository;

import projetotcc.thiago.PlaySCORE_API.model.Escalacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EscalacaoRepository extends JpaRepository<Escalacao, String> {
    java.util.List<Escalacao> findByEquipeLigaId(Long equipeLigaId);
    java.util.List<Escalacao> findByEquipeLigaIdAndRodadaId(Long equipeLigaId, Long rodadaId);
    java.util.List<Escalacao> findByRodadaId(Long rodadaId);
    java.util.List<Escalacao> findByAtletaIdAndRodadaId(Long atletaId, Long rodadaId);
    void deleteByEquipeLigaIdAndRodadaId(Long equipeLigaId, Long rodadaId);
}
