package projetotcc.thiago.PlaySCORE_API.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DesempenhoAtletaRequest {
    @NotNull(message = "O ID da rodada é obrigatório")
    private Long idRodada;

    @NotNull(message = "O ID do atleta é obrigatório")
    private Long idAtleta;

    private Integer gols = 0;
    private Integer assistencias = 0;
    private Integer cartoesAmarelos = 0;
    private Integer cartoesVermelhos = 0;
    private Integer finalizacoes = 0;
    private Integer impedimentos = 0;
    private Integer faltasCometidas = 0;
    private Integer faltasRecebidas = 0;
    private Integer canetas = 0;
    private Integer chapeus = 0;
    private Integer driblesSimples = 0;

    private Double pontosCalculados = 0.0;
    private Double valorAtualizado = 0.0;
}
