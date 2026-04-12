package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "equipe_fantasy")
@Data
public class EquipeFantasy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Dê um nome à sua equipe")
    private String nome;

    private String logo;

    private Double patrimonio = 100.0; // Valor inicial para comprar atletas
    private Double pontuacaoTotalAcumulada = 0.0; // Soma de todas as rodadas

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario criador;

    @ManyToOne
    @JoinColumn(name = "liga_id", nullable = false)
    private Liga liga;
}