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
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ProviderProfileService {

    private final ProviderProfileRepository repository;
    private static final String DEFAULT_REJECTION_REASON = "Invalid document";

    @Inject
    public ProviderProfileService(ProviderProfileRepository repository) {
        this.repository = repository;
    }

    public Optional<ProviderProfile> findByUserId(Long userId) {
        return repository.findByIdOptional(userId);
    }

    public List<ProviderProfile> listForAdmin(ValidationStatus status, boolean pendingOnly) {
        return repository.search(status, pendingOnly, null);
    }

    public List<ProviderProfile> searchForAdmin(ValidationStatus status, boolean pendingOnly, String search) {
        return repository.search(status, pendingOnly, search);
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
            profile.setRejectionReason(null);
        }
        return profile;
    }

    @Transactional
    public ProviderProfile reviewProfile(AppUser admin, Long providerUserId, ValidationStatus decision, String reason) {
        if (decision == ValidationStatus.PENDING) {
            throw new EcodeliException(Response.Status.BAD_REQUEST,
                    "PROVIDER_PROFILE_INVALID_DECISION",
                    "Impossible de repasser un profil en attente");
        }
        var profile = getRequired(providerUserId);
        profile.setStatus(decision);
        profile.setValidatedAt(OffsetDateTime.now());
        profile.setValidatedByAdminId(admin.getId());
        if (decision == ValidationStatus.APPROVED) {
            profile.setRejectionReason(null);
        } else {
            profile.setRejectionReason(resolveReason(reason));
        }
        return profile;
    }

    private String resolveReason(String reason) {
        return (reason == null || reason.isBlank()) ? DEFAULT_REJECTION_REASON : reason;
    }
}
