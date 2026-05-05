package Infra.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Mapeia a URL /uploads/** para a sua pasta específica no Desktop
        // O uso de file:/// é obrigatório para caminhos absolutos no Windows
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///C:/Users/kaua.moraes/Desktop/Library/imagens/");
    }
}