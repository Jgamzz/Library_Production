package Repository;

import DTO.UserProfileDTO;
import Domain.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    User findByUsername(String username);

    @Query("SELECT new DTO.UserProfileDTO(u.id, p.name) " +
            "FROM User u INNER JOIN Profile p ON u.profileId = p.id " +
            "WHERE u.id = :id")
    Optional<UserProfileDTO> findUserProfileById(@Param("id") Integer id);
}