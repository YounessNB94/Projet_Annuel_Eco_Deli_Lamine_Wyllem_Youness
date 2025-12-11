package fr.ecodeli.service;

import fr.ecodeli.entity.CourierProfile;
import fr.ecodeli.entity.CourierProfileStatus;
import fr.ecodeli.repository.CourierProfileRepository;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import java.util.List;

@ApplicationScoped
public class CourierProfileService {

    private final CourierProfileRepository repository;

    @Inject
    public CourierProfileService(CourierProfileRepository repository) {
        this.repository = repository;
    }

    public CourierProfile getOrCreate(Long userId) {
        return repository.findByIdOptional(userId)
                .orElseGet(() -> {
                    var profile = new CourierProfile();
                    profile.setUserId(userId);
                    profile.setStatus(CourierProfileStatus.PENDING_REVIEW);
                    repository.persist(profile);
                    return profile;
                });
    }

    public CourierProfile requireApproved(Long userId) {
        var profile = repository.findByIdOptional(userId)
                .orElseThrow(() -> new EcodeliException(Response.Status.FORBIDDEN,
                        "COURIER_PROFILE_MISSING",
                        "Profil livreur introuvable"));
        if (profile.getStatus() != CourierProfileStatus.APPROVED) {
            throw new EcodeliException(Response.Status.FORBIDDEN,
                    "COURIER_PROFILE_NOT_APPROVED",
                    "Profil livreur non approuvé");
        }
        return profile;
    }

    public List<CourierProfile> search(CourierProfileStatus status, Boolean hasDocuments, String search) {
        return repository.search(status, hasDocuments, search);
    }

    public CourierProfile getWithUser(Long userId) {
        return repository.find("user.id", userId).firstResultOptional()
                .orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                        "COURIER_NOT_FOUND",
                        "Livreur introuvable"));
    }
}
