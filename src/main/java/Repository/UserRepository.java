package Repository;

import Domain.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Certifique-se de que isso está aqui
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);

    // Ajuste o tipo para Integer para bater com o ID da sua classe User
    void deleteById(Integer id);
}