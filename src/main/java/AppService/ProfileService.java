package AppService;

import Infra.Entities.Profile;
import Repository.ProfileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@Slf4j
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    public List<Profile> listarPerfis() {
        log.info("Executando SELECT * FROM Profile");
        return profileRepository.findAll();
    }
}