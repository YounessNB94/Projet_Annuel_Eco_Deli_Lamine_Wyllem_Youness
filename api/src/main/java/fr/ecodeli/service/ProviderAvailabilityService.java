package fr.ecodeli.service;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.ProviderAvailability;
import fr.ecodeli.repository.ProviderAvailabilityRepository;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.util.List;

@ApplicationScoped
public class ProviderAvailabilityService {

    private final ProviderAvailabilityRepository repository;

    @Inject
    public ProviderAvailabilityService(ProviderAvailabilityRepository repository) {
        this.repository = repository;
    }

    public List<ProviderAvailability> listForUser(Long userId) {
        return repository.list("provider.id", userId);
    }

    @Transactional
    public List<ProviderAvailability> replaceAll(AppUser user, List<ProviderAvailability> slots) {
        repository.delete("provider.id", user.getId());
        repository.flush();
        for (var slot : slots) {
            slot.setProvider(user);
            repository.persist(slot);
        }
        return slots;
    }
}

