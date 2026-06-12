package Domain.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "User")
@Data
@NoArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String username;
    private String password;
    private String name;

    @Column(name = "creation_date", updatable = false)
    private LocalDateTime creationDate;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "profile_id")
    private Integer profileId;

    // Construtor padrão para novos cadastros (ex: via formulário)
    public User(String username, String password, String name) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.isActive = true;
        this.profileId = 2; // Default para novos usuários comuns
    }

    @PrePersist
    protected void onCreate() {
        this.creationDate = LocalDateTime.now();

        if (this.isActive == null) this.isActive = true;

        // REGRA DE OURO:
        // Se for o primeiro usuário ("admin"), o profileId deve ser 1.
        // Se for qualquer outro e o profileId veio vazio, vira 2.
        if (this.profileId == null) {
            if ("admin".equalsIgnoreCase(this.username)) {
                this.profileId = 1;
            } else {
                this.profileId = 2;
            }
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Se profileId for 1, ele é ADMIN
        if (Integer.valueOf(1).equals(this.profileId)) {
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() { return this.password; }

    @Override
    public String getUsername() { return this.username; }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() { return true; }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() { return true; }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return this.isActive != null && this.isActive;
    }
}