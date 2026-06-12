package Infra.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    public WebConfig() {
        // Verifica e cria a pasta C:\Images se ela não existir ao iniciar o sistema
        try {
            Path path = Paths.get("C:\\Images");
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
        } catch (IOException e) {
            System.err.println("Erro ao criar a pasta C:\\Images: " + e.getMessage());
        }
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Mapeia a URL /uploads/** para a pasta C:\Images\
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///C:/Images/");
    }
}