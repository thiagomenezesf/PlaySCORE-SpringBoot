package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "desempenho_atleta_liga")
@Data
public class DesempenhoAtletaLiga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double pontosCalculados = 0.0;
    private Double valorAtual = 0.0;
    private Double valorAtualizado = 0.0;

    @ManyToOne
    @JoinColumn(name = "desempenho_atleta_id", nullable = false)
    private DesempenhoAtleta desempenhoAtleta;

    @ManyToOne
    @JoinColumn(name = "liga_id", nullable = false)
    private Liga liga;

    @ManyToOne
    @JoinColumn(name = "rodada_id", nullable = false)
    private Rodada rodada;
}