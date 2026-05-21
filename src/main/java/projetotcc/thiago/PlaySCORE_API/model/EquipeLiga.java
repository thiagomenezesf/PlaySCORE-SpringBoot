package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "equipe_liga")
@Data
public class EquipeLiga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double patrimonio = 100.0; // Valor inicial para comprar atletas

    private Double pontuacaoTotal = 0.0; // Pontuação total acumulada da equipe na liga

    @ManyToOne
    @JoinColumn(name = "liga_id", nullable = false)
    private Liga liga;

    @ManyToOne
    @JoinColumn(name = "equipeFantasy_id", nullable = false)
    private EquipeFantasy equipeFantasy;
}