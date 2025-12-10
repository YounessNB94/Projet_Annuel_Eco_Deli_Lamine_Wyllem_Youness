package fr.ecodeli.service;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.UserDevice;
import fr.ecodeli.repository.UserDeviceRepository;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.util.List;

@ApplicationScoped
public class UserDeviceService {

    private final UserDeviceRepository repository;

    @Inject
    public UserDeviceService(UserDeviceRepository repository) {
        this.repository = repository;
    }

    public List<UserDevice> listByUser(AppUser user) {
        return repository.findByUserId(user.getId());
    }

    @Transactional
    public UserDevice register(AppUser user, UserDevice device) {
        repository.find("user.id = ?1 and onesignalPlayerId = ?2", user.getId(), device.getOnesignalPlayerId())
                .firstResultOptional()
                .ifPresent(repository::delete);

        device.setUser(user);
        var now = OffsetDateTime.now();
        device.setCreatedAt(now);
        device.setLastActiveAt(now);
        repository.persist(device);
        return device;
    }

    @Transactional
    public void delete(AppUser user, Long deviceId) {
        var device = repository.findByIdOptional(deviceId)
                .orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                        "USER_DEVICE_NOT_FOUND",
                        "Device not found"));
        if (!device.getUser().getId().equals(user.getId())) {
            throw new EcodeliException(Response.Status.FORBIDDEN,
                    "USER_DEVICE_FORBIDDEN",
                    "Device not owned by user");
        }
        repository.delete(device);
    }

    @Transactional
    public void touch(AppUser user, String playerId) {
        repository.find("user.id = ?1 and onesignalPlayerId = ?2", user.getId(), playerId)
                .firstResultOptional()
                .ifPresent(device -> device.setLastActiveAt(OffsetDateTime.now()));
    }
}
