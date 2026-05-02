package AppService;

import Infra.Entities.User;
import Repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> listarTodos() {
        log.info("Buscando todos os usuários no banco de dados");
        return userRepository.findAll();
    }

    public List<User> buscarUsuariosAtivosPorPerfil(Integer profileId) {
        List<User> todosUsuarios = userRepository.findAll();

        return todosUsuarios.stream()
                .filter(user -> user.getIsActive() != null && user.getIsActive())
                .filter(user -> user.getProfileId() != null && user.getProfileId().equals(profileId))
                .collect(Collectors.toList());
    }

    public User salvarUsuario(User user) {
        log.info("Persistindo usuário: {}", user.getUsername());
        return userRepository.save(user);
    }

    @Transactional
    public void deletarUsuario(Integer id) {
        log.info("Removendo usuário com ID: {}", id);
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new RuntimeException("Usuário não encontrado");
        }
    }
}