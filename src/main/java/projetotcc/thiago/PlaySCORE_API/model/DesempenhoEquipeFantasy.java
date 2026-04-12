package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "desempenho_equipe_fantasy")
@Data
public class DesempenhoEquipeFantasy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double pontuacaoRodada = 0.0;

    @ManyToOne
    @JoinColumn(name = "equipe_fantasy_id")
    private EquipeFantasy equipeFantasy;

    @ManyToOne
    @JoinColumn(name = "rodada_id")
    private Rodada rodada;
}