package projetotcc.thiago.PlaySCORE_API.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LigaRequest {
    @NotBlank(message = "O nome da liga é obrigatório")
    private String nome;

    private String logo;

    @NotNull(message = "O ID do campeonato é obrigatório")
    private Long idCampeonato;

    @NotNull(message = "O ID do usuário criador é obrigatório")
    private Long idUsuarioCriador;

    @NotBlank(message = "O código de acesso da liga é obrigatório")
    private String codigoAcesso;

    private Integer maximoParticipantes;

    private String descricao;
}
