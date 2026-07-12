package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

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


    @ManyToOne
    @JoinColumn(name = "rodada_id")
    private Rodada rodada;

    @ManyToOne // Um atleta pode ter vários desempenhos (um para cada rodada que jogou)
    @JoinColumn(name = "atleta_id")
    private Atleta atleta;

    // Relacionamentos com cascade delete para garantir integridade referencial
    @JsonIgnore
    @OneToMany(mappedBy = "desempenhoAtleta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DesempenhoAtletaLiga> desempenhosAtletasLiga;
}