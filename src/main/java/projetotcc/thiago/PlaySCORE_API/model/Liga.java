package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "liga")
@Data
public class Liga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da liga é obrigatório")
    private String nome;

    @NotBlank(message = "O código de acesso da liga é obrigatório")
    private String codigoAcesso; //Senha para entrar na liga

    private String logo; // Aqui guardaremos o caminho ou URL da imagem

    @NotNull(message = "O máximo de participantes na liga é obrigatório")
    private Integer maximoParticipantes; // Limite de participantes na liga

    private String descricao; // Descrição da liga

    // Relacionamento: Uma liga é criada por um Usuário (Dono)
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario criador;

    @ManyToOne
    @JoinColumn(name = "campeonato_id")
    private Campeonato campeonato;
}