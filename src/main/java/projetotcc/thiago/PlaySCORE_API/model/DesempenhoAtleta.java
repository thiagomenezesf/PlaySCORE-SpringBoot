package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "desempenho_atleta") // Nome corrigido
@Data
public class DesempenhoAtleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mudamos para Integer para poder somar e calcular pontos depois
    private Integer gols = 0;
    private Integer assistencias = 0;
    private Integer cartoesAmarelos = 0;
    private Integer cartoesVermelhos = 0;
    private Integer finalizacoes = 0;
    private Integer impedimentos = 0;
    private Integer faltasCometidas = 0;
    private Integer faltasRecebidas = 0;
    private Integer canetas = 0;
    private Integer chapeus = 0;
    private Integer driblesSimples = 0;

    private Double pontosCalculados = 0.0;
    private Double valorAtualizado = 0.0; // Valor do atleta atualizado após a rodada

    @ManyToOne
    @JoinColumn(name = "rodada_id")
    private Rodada rodada;

    @ManyToOne // Um atleta pode ter vários desempenhos (um para cada rodada que jogou)
    @JoinColumn(name = "atleta_id")
    private Atleta atleta;
}