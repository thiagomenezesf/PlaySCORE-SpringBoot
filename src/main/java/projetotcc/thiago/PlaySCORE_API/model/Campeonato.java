package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "campeonato")
@Data
public class Campeonato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do campeonato é obrigatório")
    private String nome;

    private String logo; // Aqui guardaremos o caminho ou URL da imagem

    @NotBlank(message = "O tipo de jogo (ex: 'FUSTAL', 'CAMPO', 'SOCIETY') deve ser definido")
    private String tipoJogo; // Ex: "FUSTAL", "CAMPO", "SOCIETY"

    private String descricao;

    // Relacionamento: Um campeonato é criado por um Usuário (Dono)
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario criador;
}