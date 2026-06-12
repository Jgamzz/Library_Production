package Infra.Swagger;

import Domain.Entities.Profile;
import Domain.Entities.User;
import Repository.ProfileRepository;
import Repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {"Domain.Entities"})
@EnableJpaRepositories(basePackages = {"Repository"})
@ComponentScan(basePackages = {"Controllers", "AppService", "Repository", "Infra", "Exceptions"})
@Slf4j
public class SwaggerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SwaggerApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(ProfileRepository profileRepository,
                                   UserRepository userRepository) {
        return args -> {
            if (profileRepository.count() == 0) {
                log.info("Inserindo perfis padrão...");
                profileRepository.save(new Profile("Administrator"));
                profileRepository.save(new Profile("User"));
            }

            if (userRepository.findByUsername("admin") == null) {
                log.info("Criando usuário administrativo com senha limpa...");

                User admin = new User();
                admin.setName("admin");
                admin.setUsername("admin");
                admin.setPassword("1234");
                admin.setIsActive(true);

                userRepository.save(admin);
                log.info("Usuário 'admin' criado com sucesso no banco de dados!");
            }
        };
    }
}