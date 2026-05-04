package DTO;

import java.time.LocalDateTime;

public class UserListDTO {
    public Integer id;

    public UserListDTO(Boolean isActive,
                       Integer profileId,
                       LocalDateTime creationDate,
                       String name,
                       String username,
                       Integer id) {
        this.isActive = isActive;
        this.profileId = profileId;
        this.creationDate = creationDate;
        this.name = name;
        this.username = username;
        this.id = id;
    }

    public String username;
    public String name;
    public LocalDateTime creationDate;
    public Integer profileId;
    public Boolean isActive;
}
