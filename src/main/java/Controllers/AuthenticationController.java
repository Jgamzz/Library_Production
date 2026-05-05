package Controllers;

import AppService.AuthenticationAppService;
import DTO.AuthenticationDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/authentication/login")
@Tag(name = "Autenticação", description = "Endpoint para obter o token de acesso")
public class AuthenticationController {

    @Autowired
    private AuthenticationAppService authService;

    @Operation(summary = "Realiza o login e retorna o Access Token", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Usuário ou senha inválidos"),
            @ApiResponse(responseCode = "500", description = "Erro de comunicação com o banco ou erro interno")
    })
    @PostMapping
    public ResponseEntity<?> efetuarLogin(@RequestBody @Valid AuthenticationDTO dados) {
        String tokenJWT = authService.login(dados);
        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }

    private record DadosTokenJWT(String accessToken) {}
}