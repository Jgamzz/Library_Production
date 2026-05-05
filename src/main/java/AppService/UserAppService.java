package AppService;

import DTO.UserListDTO;
import DTO.UserProfileDTO; // Import necessário para o novo método
import Domain.Entities.User;
import Repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class UserAppService {

    @Autowired
    private UserRepository userRepository;
    public UserProfileDTO buscarUserProfile(Integer id) {
        log.info("Buscando perfil resumido (JOIN) para o usuário ID: {}", id);
        return userRepository.findUserProfileById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o ID: " + id));
    }

    public List<User> listarTodos() {
        log.info("Buscando todos os usuários no banco de dados");
        return userRepository.findAll();
    }

    public List<UserListDTO> GetAll() {
        try {
            var users = userRepository.findAll();
            List<UserListDTO> items = new ArrayList<>();
            for (User user : users) {
                var userAdd = new UserListDTO(user.getIsActive(),
                        user.getProfileId(),
                        user.getCreationDate(),
                        user.getName(),
                        user.getUsername(),
                        user.getId());
                items.add(userAdd);
            }

            return items;
        } catch (Exception e) {
            throw new RuntimeException("Falha ao tentar obter os usuários");
        }
    }

    public List<User> buscarUsuariosAtivosPorPerfil(Integer profileId) {
        try {
            List<User> todosUsuarios = userRepository.findAll();

            return todosUsuarios.stream()
                    .filter(user -> user.getIsActive() != null && user.getIsActive())
                    .filter(user -> user.getProfileId() != null && user.getProfileId().equals(profileId))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Falha ao buscarUsuariosAtivosPorPerfil. profileId: {}", profileId, e);
            throw new RuntimeException(e);
        }
    }

    public User salvarUsuario(User user) {
        log.info("Persistindo usuário: {}", user.getUsername());
        return userRepository.save(user);
    }

    public User Insert(String userName, String password, String name) {
        try {
            var user = new User(userName, password, name);
            return userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao inserir usuário: " + e.getMessage());
        }
    }

    @Transactional
    public void deletarUsuario(Integer id) {
        try {
            log.info("Removendo usuário com ID: {}", id);
            if (userRepository.existsById(id)) {
                userRepository.deleteById(id);
            } else {
                throw new RuntimeException("Usuário não encontrado");
            }
        } catch (Exception e) {
            throw new RuntimeException("Falha ao deletar o usuário");
        }
    }
}