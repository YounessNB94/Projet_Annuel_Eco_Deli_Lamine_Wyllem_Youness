package fr.ecodeli.repository;

import fr.ecodeli.entity.AppUser;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

@ApplicationScoped
public class AppUserRepository implements PanacheRepository<AppUser> {

    public Optional<AppUser> findByKeycloakId(String keycloakUserId) {
        return find("keycloakUserId", keycloakUserId).firstResultOptional();
    }

    public Optional<AppUser> findByEmail(String email) {
        return find("email", email).firstResultOptional();
    }
}
