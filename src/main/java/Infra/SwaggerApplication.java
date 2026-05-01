package Infra;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"Controllers", "AppService", "Infra", "Repository"})
@EnableJpaRepositories(basePackages = "Repository") // Força o Spring a ler os Repositories
@EntityScan(basePackages = "Infra.Entities")        // Força o Spring a ler as Entities
public class SwaggerApplication {
    public static void main(String[] args) {
        SpringApplication.run(SwaggerApplication.class, args);
    }
}
