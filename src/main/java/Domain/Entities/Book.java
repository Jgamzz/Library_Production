package Domain.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "book")
@Getter
@Setter
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT") // Para descrições longas
    private String description;

    @Column(nullable = false, length = 100)
    private String author;

    @Column(name = "release_year")
    private Integer releaseYear;

    @Column(length = 500) // URL ou caminho da imagem
    private String image;

    @Column(name = "creation_date", updatable = false)
    private LocalDateTime creationDate;

    // Executado automaticamente antes de salvar no banco
    @PrePersist
    protected void onCreate() {
        this.creationDate = LocalDateTime.now();
    }
}