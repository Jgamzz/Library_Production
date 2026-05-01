package Infra.Entities;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Entity
@Table(name = "User")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String username;
    private String password;
    private String name;

    @Column(name = "Creation_Date", updatable = false)
    @JsonIgnore // SOME DO SWAGGER
    private LocalDateTime creationDate;

    @Column(name = "Is_Active")
    @JsonIgnore // SOME DO SWAGGER
    private Boolean isActive = true;

    @Column(name = "Profile_ID")
    @JsonIgnore // SOME DO SWAGGER
    private Integer profileId;

    @PrePersist
    protected void onCreate() {
        this.creationDate = LocalDateTime.now();
        if (this.isActive == null) this.isActive = true;
    }
}