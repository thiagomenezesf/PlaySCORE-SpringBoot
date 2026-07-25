package projetotcc.thiago.PlaySCORE_API.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EscalacaoRequest {
    @NotNull(message = "O ID do atleta é obrigatório")
    private Long idAtleta;

    @NotNull(message = "O ID da rodada é obrigatório")
    private Long idRodada;

    @NotNull(message = "O ID da equipe da liga é obrigatório")
    private Long idEquipeLiga;

    @NotNull(message = "O ID da equipe fantasy é obrigatório")
    private Long idEquipeFantasy;

    private Boolean isCapitao;
}
