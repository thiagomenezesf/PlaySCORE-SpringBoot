package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "campeonato_rodada")
@Data
public class CampeonatoRodada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "campeonato_id", nullable = false)
    private Campeonato campeonato;

    @ManyToOne
    @JoinColumn(name = "rodada_id", nullable = false)
    private Rodada rodada;
}
