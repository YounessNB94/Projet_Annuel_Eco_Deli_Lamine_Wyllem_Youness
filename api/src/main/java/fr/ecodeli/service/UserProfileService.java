package fr.ecodeli.service;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.UserProfile;
import fr.ecodeli.repository.UserProfileRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UserProfileService {

    private final UserProfileRepository repository;

    @Inject
    public UserProfileService(UserProfileRepository repository) {
        this.repository = repository;
    }

    public List<UserProfile> listAll() {
        return repository.listAll();
    }

    public Optional<UserProfile> findByUserId(Long userId) {
        return repository.findByIdOptional(userId);
    }

    public UserProfile getRequired(Long userId) {
        return findByUserId(userId).orElseThrow(NotFoundException::new);
    }

    @Transactional
    public UserProfile saveForUser(AppUser user, UserProfile payload) {
        var profile = repository.findByIdOptional(user.getId()).orElseGet(() -> {
            var created = new UserProfile();
            created.setUserId(user.getId());
            created.setUser(user);
            return created;
        });
        profile.setFirstName(payload.getFirstName());
        profile.setLastName(payload.getLastName());
        profile.setBirthDate(payload.getBirthDate());
        profile.setDefaultLanguage(payload.getDefaultLanguage());
        profile.setTutorialShownAt(payload.getTutorialShownAt());
        profile.setTutorialCompletedAt(payload.getTutorialCompletedAt());
        if (!repository.isPersistent(profile)) {
            repository.persist(profile);
        }
        return profile;
    }

    @Transactional
    public UserProfile create(UserProfile profile) {
        repository.persist(profile);
        return profile;
    }

    @Transactional
    public UserProfile update(UserProfile profile) {
        return repository.getEntityManager().merge(profile);
    }

    @Transactional
    public boolean deleteByUserId(Long userId) {
        return repository.deleteById(userId);
    }
}
