package projetotcc.thiago.PlaySCORE_API.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AtletaRequest {
    @NotBlank(message = "O nome do atleta é obrigatório")
    private String nome;

    private String foto;

    @NotBlank(message = "A posição do atleta é obrigatória")
    private String posicao;

    @NotNull(message = "O preço inicial é obrigatório")
    private Double precoInicial;

    private Double precoAtual;

    @NotNull(message = "O ID do clube é obrigatório")
    private Long idClube;
}
