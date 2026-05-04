package Controllers;

import AppService.ProfileAppService;
import Domain.Entities.Profile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequestMapping(value = "/api/profiles", produces = {"application/json"})
@Tag(name = "Perfis", description = "Endpoints para gerenciamento de perfis")
public class ProfileController {

    private final ProfileAppService profileAppService;

    public ProfileController(ProfileAppService profileAppService) {
        this.profileAppService = profileAppService;
    }


    @Operation(summary = "Lista todos os perfis do banco", method = "GET")
    @GetMapping
    public ResponseEntity<List<Profile>> listarPerfis() {
        log.info("Chamando listagem de perfis do banco.");
        return ResponseEntity.ok(profileAppService.listarPerfis());
    }
}