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
    @JoinColumn(name = "equipe_liga_id")
    private EquipeLiga equipeLiga; // Relacionamento com EquipeLiga para saber a qual equipe fantasy e liga esse desempenho pertence

    @ManyToOne
    @JoinColumn(name = "rodada_id")
    private Rodada rodada;

    @ManyToOne
    @JoinColumn(name = "desempenho_atleta_id")
    private DesempenhoAtleta desempenhoAtleta;
}