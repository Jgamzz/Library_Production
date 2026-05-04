package Controllers;

import AppService.UserService;
import DTO.UserAddDTO;
import DTO.UserListDTO;
import Domain.Entities.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import static java.lang.String.format;

@RestController
@Slf4j
@RequestMapping(value = "/api/users", produces = {"application/json"})
@Tag(name = "Usuários", description = "Endpoints para gerenciamento de usuários")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Lista todos os usuários do banco", method = "GET")
    @GetMapping
    public ResponseEntity<List<UserListDTO>> listarUsuarios() {
        log.info("Chamando listagem de usuários do banco.");
        return ResponseEntity.ok(userService.GetAll());
    }

    @Operation(summary = "Cria um novo usuário", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário salvo com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro ao salvar no banco")
    })
    @PostMapping
    public ResponseEntity<User> criarUsuario(@RequestBody UserAddDTO userAdd) {
        User usuarioSalvo = userService.Insert(userAdd.name, userAdd.username, userAdd.password);
        return ResponseEntity.ok(usuarioSalvo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Integer id) {
        log.info(format("Removendo usuário ID: %s", id));
        userService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> atualizarUsuario(@PathVariable Integer id, @RequestBody User user) {
        log.info(format("Atualizando dados do usuário ID: %s", id));

        user.setId(id);

        User usuarioAtualizado = userService.salvarUsuario(user);
        return ResponseEntity.ok(usuarioAtualizado);
    }
}