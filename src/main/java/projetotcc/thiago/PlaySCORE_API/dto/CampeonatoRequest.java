package projetotcc.thiago.PlaySCORE_API.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CampeonatoRequest {
    @NotBlank(message = "O nome do campeonato é obrigatório")
    private String nome;

    private String logo;

    @NotBlank(message = "O tipo de jogo é obrigatório")
    private String tipoJogo;

    @NotNull(message = "O ID do usuário criador é obrigatório")
    private Long idUsuario;

    private String descricao;

    private String status;

    private Integer numeroDeJogadoresJogando;
}
