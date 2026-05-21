package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "atleta")
@Data
public class Atleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do atleta é obrigatório")
    private String nome;

    private String foto;

    @NotBlank(message = "A posição é obrigatória")
    private String posicao; // Ex: GOL, LAT, ZAG, MEI, ATA

    @NotNull(message = "O preço inicial deve ser definido")
    private Double precoInicial;

    private Double precoAtual;

    // Relacionamento: O atleta pertence a uma equipe
    @ManyToOne
    @JoinColumn(name = "clube_id", nullable = false)
    private Clube clube;
}