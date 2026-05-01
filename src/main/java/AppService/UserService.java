package AppService;

import Infra.Entities.User;
import Repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Busca todos os usuários do banco (Equivalente ao SELECT * FROM User)
     */
    public List<User> listarTodos() {
        log.info("Buscando todos os usuários no banco de dados");
        return userRepository.findAll();
    }

    /**
     * Filtra usuários por status ativo e ID de perfil
     */
    public List<User> buscarUsuariosAtivosPorPerfil(Integer profileId) {
        List<User> todosUsuarios = userRepository.findAll();

        return todosUsuarios.stream()
                .filter(user -> user.getIsActive() != null && user.getIsActive())
                .filter(user -> user.getProfileId() != null && user.getProfileId().equals(profileId))
                .collect(Collectors.toList());
    }

    /**
     * Salva um novo usuário no banco
     */
    public User salvarUsuario(User user) {
        log.info("Salvando novo usuário: {}", user.getUsername());
        return userRepository.save(user);
    }
}