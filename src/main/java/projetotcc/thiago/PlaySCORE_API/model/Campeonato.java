package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotNull(message = "O formato (ex: 5x5, 11x11) deve ser definido")
    private Integer formatoJogadores; // Ex: 5 para 5x5, 11 para 11x11

    // Relacionamento: Um campeonato é criado por um Usuário (Dono)
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario criador;
}