package projetotcc.thiago.PlaySCORE_API.model;

import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "clube")
@Data
public class Clube {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do clube é obrigatório")
    private String nome;

    @NotBlank(message = "A logo do clube é obrigatoria")
    private String logo;

    @ManyToOne
    @JoinColumn(name = "campeonato_id")
    private Campeonato campeonato;

    // Uma equipe tem muitos atletas (opcional colocar o mapeamento aqui agora)
    @OneToMany(mappedBy = "clube")
    private List<Atleta> atletas;
}
