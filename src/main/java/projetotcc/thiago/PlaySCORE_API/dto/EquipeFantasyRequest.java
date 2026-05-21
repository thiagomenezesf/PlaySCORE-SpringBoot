package projetotcc.thiago.PlaySCORE_API.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EquipeFantasyRequest {
    @NotBlank(message = "O nome da equipe fantasy é obrigatório")
    private String nome;

    private String logo;

    @NotNull(message = "O ID do usuário criador é obrigatório")
    private Long idUsuario;

    private Double patrimonio;

    private Integer titulos;
}
