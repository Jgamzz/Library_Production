package AppService;

import DTO.AuthenticationDTO;
import Domain.Entities.User;
import Infra.JwtToken.TokenService;
import Repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthenticationAppService implements UserDetailsService {

    @Autowired
    @Lazy
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository userRepository;

    public String login(AuthenticationDTO authDTO) {
        try {
            log.info("Iniciando processo de autenticação para o usuário: {}", authDTO.username());

            var authenticationToken = new UsernamePasswordAuthenticationToken(authDTO.username(), authDTO.password());

            // Se a senha estiver errada, o manager lança BadCredentialsException automaticamente
            var authentication = manager.authenticate(authenticationToken);

            log.info("Usuário autenticado com sucesso. Gerando Token JWT...");
            return tokenService.gerarToken((User) authentication.getPrincipal());

        } catch (BadCredentialsException e) {
            log.warn("Falha no login: Credenciais inválidas para o usuário {}", authDTO.username());
            // Lançamos a exceção que será capturada pelo TratadorDeErros global
            throw new BadCredentialsException("Usuário ou senha inválidos.");
        } catch (Exception e) {
            log.error("Erro interno no processo de login: ", e);
            throw new RuntimeException("Erro ao processar o login no servidor.");
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Spring Security buscando usuário no banco: {}", username);
        User user = userRepository.findByUsername(username);

        if (user == null) {
            log.error("Usuário {} não encontrado no banco de dados.", username);
            throw new UsernameNotFoundException("Usuário não encontrado.");
        }

        return user;
    }
}