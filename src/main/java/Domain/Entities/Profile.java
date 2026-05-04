package Domain.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "profile") // Nome da tabela no MySQL
@Getter @Setter // Ou @Data do Lombok
@NoArgsConstructor
@AllArgsConstructor
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "Creation_Date", updatable = false)
    private LocalDateTime creationDate;

    @Column(name = "Is_Active")
    private Boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        this.creationDate = LocalDateTime.now();
    }
}