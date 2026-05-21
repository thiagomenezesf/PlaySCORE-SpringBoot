package projetotcc.thiago.PlaySCORE_API.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EquipeLigaRequest {
    @NotNull(message = "O patrimônio da equipe é obrigatório")
    private Double patrimonio;

    private Double pontuacaoTotal;

    @NotNull(message = "O ID da liga é obrigatório")
    private Long idLiga;

    @NotNull(message = "O ID da equipe fantasy é obrigatório")
    private Long idEquipeFantasy;
}
