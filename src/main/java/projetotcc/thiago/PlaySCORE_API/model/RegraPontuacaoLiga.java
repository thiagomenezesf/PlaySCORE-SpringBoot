package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "regra_pontuacao_liga")
@Data
public class RegraPontuacaoLiga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String acao; // Ex: "GOL", "ASSISTENCIA", "AMARELO"
    private Double valor; // Ex: 5.0, 3.0, -2.0

    @ManyToOne
    @JoinColumn(name = "liga_id", nullable = false)
    private Liga liga;
}