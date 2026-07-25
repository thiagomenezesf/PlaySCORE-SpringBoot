package projetotcc.thiago.PlaySCORE_API.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CampeonatoRodadaRequest {
    @NotNull(message = "O ID do campeonato é obrigatório")
    private Long idCampeonato;

    @NotNull(message = "O ID da rodada é obrigatório")
    private Long idRodada;
}
