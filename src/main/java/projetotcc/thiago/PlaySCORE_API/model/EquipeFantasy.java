package projetotcc.thiago.PlaySCORE_API.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "equipe_fantasy")
@Data
public class EquipeFantasy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Dê um nome à sua equipe")
    private String nome;

    private String logo;

    private Integer titulos; // Quantidade de títulos conquistados pela equipe fantasy

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario criador;

    @oneToMany(mappedBy = "equipeFantasy")
    private List<EquipeLiga> equipesLiga; // Lista de ligas em que a equipe participa
}