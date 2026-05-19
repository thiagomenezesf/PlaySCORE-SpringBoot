package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "escalacao")
@Data
public class Escalacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "atleta_id", nullable = false)
    private Atleta atleta;

    @ManyToOne
    @JoinColumn(name = "rodada_id", nullable = false)
    private Rodada rodada;

    @ManyToOne
    @JoinColumn(name = "equipe_liga_id", nullable = false)
    private EquipeLiga equipeLiga; // Equipe de uma Liga específica em que a equipe fantasy está competindo

    private Boolean isCapitao; //Para determinar se o jogador escalado é o capitão

    //Double precoMomento; //Para calcular se o Usuário teve lucro de uma escalação para outra.
}