package Domain.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Profile")
@Data
@NoArgsConstructor
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "Creation_Date", updatable = false)
    private LocalDateTime creationDate;

    public Profile(String name) {
        this.name = name;
    }

    @PrePersist
    protected void onCreate() {
        this.creationDate = LocalDateTime.now();
    }
}