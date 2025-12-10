package fr.ecodeli.service;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.ProviderProfile;
import fr.ecodeli.entity.ValidationStatus;
import fr.ecodeli.repository.ProviderProfileRepository;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.util.Optional;

@ApplicationScoped
public class ProviderProfileService {

    private final ProviderProfileRepository repository;

    @Inject
    public ProviderProfileService(ProviderProfileRepository repository) {
        this.repository = repository;
    }

    public Optional<ProviderProfile> findByUserId(Long userId) {
        return repository.findByIdOptional(userId);
    }

    public ProviderProfile getRequired(Long userId) {
        return findByUserId(userId).orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                "PROVIDER_PROFILE_NOT_FOUND",
                "Profil provider introuvable"));
    }

    @Transactional
    public ProviderProfile ensureProfile(AppUser user) {
        return findByUserId(user.getId()).orElseGet(() -> {
            var profile = new ProviderProfile();
            profile.setUserId(user.getId());
            profile.setStatus(ValidationStatus.PENDING);
            repository.persist(profile);
            return profile;
        });
    }

    @Transactional
    public ProviderProfile updateProfile(AppUser user, ProviderProfile payload) {
        var profile = ensureProfile(user);
        profile.setBio(payload.getBio());
        profile.setSkills(payload.getSkills());
        profile.setHourlyRateCents(payload.getHourlyRateCents());
        profile.setCurrency(payload.getCurrency());
        profile.setIbanMasked(payload.getIbanMasked());
        if (profile.getStatus() == ValidationStatus.REJECTED) {
            profile.setStatus(ValidationStatus.PENDING);
            profile.setValidatedAt(null);
            profile.setValidatedByAdminId(null);
        }
        return profile;
    }
}

