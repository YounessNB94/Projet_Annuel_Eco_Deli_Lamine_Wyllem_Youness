package fr.ecodeli.service;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.ProviderAssignment;
import fr.ecodeli.entity.ProviderAssignmentStatus;
import fr.ecodeli.repository.ProviderAssignmentRepository;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.util.List;

@ApplicationScoped
public class ProviderAssignmentService {

    private final ProviderAssignmentRepository repository;

    @Inject
    public ProviderAssignmentService(ProviderAssignmentRepository repository) {
        this.repository = repository;
    }

    public List<ProviderAssignment> listForUser(Long userId) {
        return repository.list("provider.id", userId);
    }

    public ProviderAssignment getRequired(Long id) {
        return repository.findByIdOptional(id).orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                "PROVIDER_ASSIGNMENT_NOT_FOUND",
                "Mission introuvable"));
    }

    @Transactional
    public ProviderAssignment updateStatus(AppUser user, Long assignmentId, ProviderAssignmentStatus status) {
        var assignment = getRequired(assignmentId);
        ensureOwnership(user, assignment);
        assignment.setStatus(status);
        if (status == ProviderAssignmentStatus.COMPLETED) {
            assignment.setCompletedAt(java.time.OffsetDateTime.now());
        }
        return assignment;
    }

    private void ensureOwnership(AppUser user, ProviderAssignment assignment) {
        if (!assignment.getProvider().getId().equals(user.getId())) {
            throw new EcodeliException(Response.Status.FORBIDDEN,
                    "PROVIDER_ASSIGNMENT_FORBIDDEN",
                    "Mission non accessible");
        }
    }
}

