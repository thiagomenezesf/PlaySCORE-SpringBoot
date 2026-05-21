package projetotcc.thiago.PlaySCORE_API.repository;

import projetotcc.thiago.PlaySCORE_API.model.EquipeLiga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EquipeLigaRepository extends JpaRepository<EquipeLiga, Long> {
    java.util.List<EquipeLiga> findByLigaId(Long ligaId);
}
