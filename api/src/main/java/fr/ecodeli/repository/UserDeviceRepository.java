package fr.ecodeli.repository;

import fr.ecodeli.entity.UserDevice;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UserDeviceRepository implements PanacheRepository<UserDevice> {

    public List<UserDevice> findByUserId(Long userId) {
        return list("user.id", userId);
    }

    public Optional<UserDevice> findByPlayerId(String playerId) {
        return find("onesignalPlayerId", playerId).firstResultOptional();
    }
}

