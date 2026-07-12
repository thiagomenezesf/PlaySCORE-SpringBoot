package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "rodada")
@Data
public class Rodada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status = "ABERTO"; // ["ABERTO", "FECHADO"]

    private Integer numero; // Numero da rodada

    @ManyToOne
    @JoinColumn(name = "campeonato_id", nullable = false)
    private Campeonato campeonato;

    // Relacionamentos com cascade delete para garantir integridade referencial
    @JsonIgnore
    @OneToMany(mappedBy = "rodada", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CampeonatoRodada> campeonatoRodadas;

    @JsonIgnore
    @OneToMany(mappedBy = "rodada", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DesempenhoAtleta> desempenhosAtletas;

    @JsonIgnore
    @OneToMany(mappedBy = "rodada", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DesempenhoEquipeFantasy> desempenhosEquipesFantasy;

    @JsonIgnore
    @OneToMany(mappedBy = "rodada", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Escalacao> escalacoes;

    @JsonIgnore
    @OneToMany(mappedBy = "rodada", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DesempenhoAtletaLiga> desempenhosAtletasLiga;
}