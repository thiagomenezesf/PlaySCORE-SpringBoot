package projetotcc.thiago.PlaySCORE_API.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DesempenhoAtletaLigaRequest {

    @NotNull(message = "O ID do desempenho do atleta é obrigatório")
    private Long idDesempenhoAtleta;

    @NotNull(message = "O ID da liga é obrigatório")
    private Long idLiga;

    @NotNull(message = "O ID da rodada é obrigatório")
    private Long idRodada;

    private Double pontosCalculados;
    private Double valorAtual;
    private Double valorAtualizado;
}
