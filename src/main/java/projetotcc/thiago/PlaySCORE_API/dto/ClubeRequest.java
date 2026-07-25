package projetotcc.thiago.PlaySCORE_API.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClubeRequest {
    @NotBlank(message = "O nome do clube é obrigatório")
    private String nome;

    private String logo;

    @NotNull(message = "O ID do campeonato é obrigatório")
    private Long idCampeonato;

    private String sigla;
}
