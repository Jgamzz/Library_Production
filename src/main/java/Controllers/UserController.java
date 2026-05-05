package Controllers;

import AppService.UserAppService;
import DTO.UserAddDTO;
import DTO.UserListDTO;
import DTO.UserProfileDTO;
import Domain.Entities.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import static java.lang.String.format;

@RestController
@Slf4j
@RequestMapping(value = "/api/users", produces = {"application/json"})
@Tag(name = "Usuários", description = "Endpoints para gerenciamento de usuários")
public class UserController {

    private final UserAppService userService;

    public UserController(UserAppService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Lista todos os usuários do banco", method = "GET")
    @GetMapping
    public ResponseEntity<List<UserListDTO>> listarUsuarios() {
        log.info("Chamando listagem de usuários do banco.");
        return ResponseEntity.ok(userService.GetAll());
    }

    @Operation(summary = "Busca perfil do usuário logado via Token", method = "GET")
    @GetMapping("/profile/me")
    public ResponseEntity<UserProfileDTO> buscarMeuPerfil() {
        User usuarioLogado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        log.info("Buscando perfil para o usuário logado: {}", usuarioLogado.getUsername());

        UserProfileDTO profile = userService.buscarUserProfile(usuarioLogado.getId());

        return ResponseEntity.ok(profile);
    }

    @Operation(summary = "Cria um novo usuário", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro na operação - Dados inválidos ou regra de negócio violada"),
            @ApiResponse(responseCode = "401", description = "Acesso negado - Você precisa estar logado"),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor ou falha no banco de dados")
    })
    @PostMapping
    public ResponseEntity<User> criarUsuario(@RequestBody UserAddDTO userAdd) {
        User usuarioSalvo = userService.Insert(userAdd.username, userAdd.password, userAdd.name);
        return ResponseEntity.status(201).body(usuarioSalvo);
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