package Controllers;

import Domain.Entities.User;
import Infra.TokenService;
import Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class AuthenticationController {

    @Autowired
    private UserRepository repository;

    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity login(@RequestBody DadosAutenticacao dados) {
        var usuario = repository.findByUsername(dados.username());

        if (usuario != null && usuario.getPassword().equals(dados.password())) {
            var tokenJWT = tokenService.gerarToken(usuario);
            // Agora o JSON vai mostrar "accessToken": "token..."
            return ResponseEntity.ok(new DadosRetornoToken(tokenJWT));
        }

        return ResponseEntity.status(403).body("Usuário ou senha inválidos");
    }

    public record DadosAutenticacao(String username, String password) {}
    public record DadosRetornoToken(String accessToken) {}
}