package Domain.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "User")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;



    public User(String username, String password, String name) {
        this.username = username;
        this.password = password;
        this.name = name;
        onCreate();
    }

    public  User(){
        
    }

    private String username;
    private String password;
    private String name;

    @Column(name = "Creation_Date", updatable = false)
    @JsonIgnore
    private LocalDateTime creationDate;

    @Column(name = "Is_Active")
    @JsonIgnore
    private Boolean isActive = true;

    @Column(name = "Profile_ID")
    @JsonIgnore
    private Integer profileId;

    @PrePersist
    protected void onCreate() {
        this.creationDate = LocalDateTime.now();
        if (this.isActive == null) this.isActive = true;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}