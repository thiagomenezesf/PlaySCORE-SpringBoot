package projetotcc.thiago.PlaySCORE_API.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegraPontuacaoLigaRequest {
    @NotBlank(message = "A ação da regra de pontuação é obrigatória")
    private String acao;

    @NotNull(message = "O valor da regra de pontuação é obrigatório")
    private Double valor;

    @NotNull(message = "O ID da liga é obrigatório")
    private Long idLiga;
}
