package fr.ecodeli.service;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.ProviderAttachment;
import fr.ecodeli.entity.ProviderAttachmentType;
import fr.ecodeli.entity.ValidationStatus;
import fr.ecodeli.repository.ProviderAttachmentRepository;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.util.List;

@ApplicationScoped
public class ProviderAttachmentService {

    private final ProviderAttachmentRepository repository;
    private final DocumentService documentService;
    private static final String DEFAULT_REJECTION_REASON = "Invalid document";

    @Inject
    public ProviderAttachmentService(ProviderAttachmentRepository repository,
                                     DocumentService documentService) {
        this.repository = repository;
        this.documentService = documentService;
    }

    public List<ProviderAttachment> listForUser(Long userId) {
        return repository.list("provider.id", userId);
    }

    public ProviderAttachment getRequired(Long id) {
        return repository.findByIdOptional(id).orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                "PROVIDER_ATTACHMENT_NOT_FOUND",
                "Pièce introuvable"));
    }

    public List<ProviderAttachment> listForAdmin(ValidationStatus status, boolean pendingOnly) {
        if (pendingOnly) {
            return repository.list("status", ValidationStatus.PENDING);
        }
        if (status != null) {
            return repository.list("status", status);
        }
        return repository.listAll();
    }

    public List<ProviderAttachment> listByProvider(Long providerUserId) {
        return repository.list("providerUserId", providerUserId);
    }

    @Transactional
    public ProviderAttachment save(AppUser user, ProviderAttachment attachment) {
        attachment.setProvider(user);
        attachment.setStatus(ValidationStatus.PENDING);
        repository.persist(attachment);
        return attachment;
    }

    @Transactional
    public void delete(AppUser user, Long attachmentId) {
        var attachment = getRequired(attachmentId);
        ensureOwnership(user, attachment);
        repository.delete(attachment);
    }

    @Transactional
    public ProviderAttachment review(AppUser admin, Long attachmentId, ValidationStatus decision, String reason) {
        if (decision == ValidationStatus.PENDING) {
            throw new EcodeliException(Response.Status.BAD_REQUEST,
                    "PROVIDER_ATTACHMENT_INVALID_DECISION",
                    "Impossible de repasser une pièce en attente");
        }
        var attachment = getRequired(attachmentId);
        attachment.setStatus(decision);
        attachment.setReviewedAt(OffsetDateTime.now());
        attachment.setReviewedByAdminId(admin.getId());
        if (decision == ValidationStatus.APPROVED) {
            attachment.setRejectionReason(null);
        } else {
            attachment.setRejectionReason(resolveReason(reason));
        }
        return attachment;
    }

    public DocumentDownload openDocumentForAdmin(Long attachmentId, AppUser admin) {
        var attachment = getRequired(attachmentId);
        return documentService.openDownload(attachment.getDocument().getId(), attachment.getProvider().getId());
    }

    public void ensureOwnership(AppUser user, ProviderAttachment attachment) {
        if (!attachment.getProvider().getId().equals(user.getId())) {
            throw new EcodeliException(Response.Status.FORBIDDEN,
                    "PROVIDER_ATTACHMENT_FORBIDDEN",
                    "Pièce non accessible");
        }
    }

    private String resolveReason(String reason) {
        return (reason == null || reason.isBlank()) ? DEFAULT_REJECTION_REASON : reason;
    }
}
