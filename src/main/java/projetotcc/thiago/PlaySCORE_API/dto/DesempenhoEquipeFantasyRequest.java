package projetotcc.thiago.PlaySCORE_API.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DesempenhoEquipeFantasyRequest {
    @NotNull(message = "O ID da equipe liga é obrigatório")
    private Long idEquipeLiga;

    @NotNull(message = "O ID da rodada é obrigatório")
    private Long idRodada;

    private Double pontuacaoRodada = 0.0;
}
