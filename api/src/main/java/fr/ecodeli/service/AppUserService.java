package fr.ecodeli.service;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.repository.AppUserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class AppUserService {

    private final AppUserRepository repository;

    @Inject
    public AppUserService(AppUserRepository repository) {
        this.repository = repository;
    }

    public List<AppUser> listAll() {
        return repository.listAll();
    }

    public Optional<AppUser> findById(Long id) {
        return repository.findByIdOptional(id);
    }

    public Optional<AppUser> findByKeycloakUserId(String keycloakUserId) {
        return repository.findByKeycloakId(keycloakUserId);
    }

    public Optional<AppUser> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Transactional
    public AppUser create(AppUser user) {
        repository.persist(user);
        return user;
    }

    @Transactional
    public AppUser update(AppUser user) {
        return repository.getEntityManager().merge(user);
    }

    @Transactional
    public boolean delete(Long id) {
        return repository.deleteById(id);
    }
}
