package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import lombok.Data;

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
}