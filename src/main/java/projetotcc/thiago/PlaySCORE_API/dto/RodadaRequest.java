package projetotcc.thiago.PlaySCORE_API.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RodadaRequest {
    @NotNull(message = "O número da rodada é obrigatório")
    private Integer numero;

    private String status;

    @NotNull(message = "O ID do campeonato é obrigatório")
    private Long idCampeonato;
}
