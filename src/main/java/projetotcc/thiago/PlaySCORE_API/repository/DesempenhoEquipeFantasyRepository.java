package projetotcc.thiago.PlaySCORE_API.repository;

import projetotcc.thiago.PlaySCORE_API.model.DesempenhoEquipeFantasy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DesempenhoEquipeFantasyRepository extends JpaRepository<DesempenhoEquipeFantasy, Long> {
    java.util.List<DesempenhoEquipeFantasy> findByEquipeLigaId(Long equipeLigaId);
    java.util.List<DesempenhoEquipeFantasy> findByEquipeLigaIdAndRodadaId(Long equipeLigaId, Long rodadaId);
    void deleteByEquipeLigaIdAndRodadaId(Long equipeLigaId, Long rodadaId);
}
