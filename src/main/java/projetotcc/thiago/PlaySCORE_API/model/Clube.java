package projetotcc.thiago.PlaySCORE_API.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    private String logo;

    private String sigla;

    @ManyToOne
    @JoinColumn(name = "campeonato_id")
    private Campeonato campeonato;

    @JsonIgnore
    @OneToMany(mappedBy = "clube")
    private List<Atleta> atletas;
}
