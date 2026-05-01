package Controllers;

import AppService.SwaggerService;
import AppService.UserService;
import AppService.ProfileService;
import Infra.Entities.Pessoa;
import Infra.Entities.Profissao;
import Infra.Entities.User;
import Infra.Entities.Profile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static java.lang.String.format;

@RestController
@Slf4j
@RequestMapping(value = "/api", produces = {"application/json"})
@Tag(name = "Gerenciamento de Usuários e Arquivos")
public class SwaggerController {

    private final SwaggerService swaggerService;
    private final UserService userService;
    private final ProfileService profileService;

    public SwaggerController(SwaggerService swaggerService, UserService userService, ProfileService profileService) {
        this.swaggerService = swaggerService;
        this.userService = userService;
        this.profileService = profileService;
    }

    @Operation(summary = "Realiza o upload de arquivos", method = "POST")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadDocuments(@RequestPart MultipartFile file) {
        log.info(format("Upload do arquivo %s iniciado!", file.getOriginalFilename()));
        return swaggerService.uploadDocument(file);
    }

    @Operation(summary = "Busca pessoas (estático) por idade e cargo", method = "GET")
    @GetMapping("/pessoas-estatico")
    public ResponseEntity<List<Pessoa>> buscaDadosProfissionais(@RequestParam("Profissão") Profissao profissao,
                                                                @RequestParam("Idade") Integer idade) {
        log.info(format("Buscando pessoas estáticas: profissão = %s e idade = %s!", profissao, idade));
        return ResponseEntity.ok(swaggerService.buscaPessoasPor(profissao, idade));
    }

    @Operation(summary = "Lista todos os usuários do banco (SELECT * FROM User)", method = "GET")
    @GetMapping("/users")
    public ResponseEntity<List<User>> listarUsuarios() {
        log.info("Chamando listagem de usuários do banco.");
        return ResponseEntity.ok(userService.listarTodos());
    }

    @Operation(summary = "Lista todos os perfis do banco (SELECT * FROM Profile)", method = "GET")
    @GetMapping("/profiles")
    public ResponseEntity<List<Profile>> listarPerfis() {
        log.info("Chamando listagem de perfis do banco.");
        return ResponseEntity.ok(profileService.listarPerfis());
    }

    @Operation(summary = "Cria um novo usuário (Username, Password, Name)", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário salvo com sucesso no banco"),
            @ApiResponse(responseCode = "500", description = "Erro ao salvar no banco (Verifique o Profile_ID)")
    })
    @PostMapping("/users")
    public ResponseEntity<User> criarUsuario(@RequestBody User user) {
        log.info(format("Iniciando persistência do usuário: %s", user.getName()));

        // Forçamos o ID como null para garantir que o Hibernate faça um INSERT e não um UPDATE
        user.setId(null);

        // Chama o service que utiliza o userRepository.save()
        User usuarioSalvo = userService.salvarUsuario(user);

        return ResponseEntity.ok(usuarioSalvo);
    }
}