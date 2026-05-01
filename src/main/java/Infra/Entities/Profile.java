package Infra.Entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Profile")
@Data // O Lombok cria os Getters e Setters automaticamente
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "Creation_Date", updatable = false)
    private LocalDateTime creationDate;

    @Column(name = "Is_Active")
    private Boolean isActive = true;

    // Construtor para inicializar a data de criação automaticamente
    @PrePersist
    protected void onCreate() {
        this.creationDate = LocalDateTime.now();
    }
}