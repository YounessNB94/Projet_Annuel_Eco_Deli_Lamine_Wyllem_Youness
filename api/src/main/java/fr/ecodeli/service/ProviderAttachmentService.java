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
import java.util.List;

@ApplicationScoped
public class ProviderAttachmentService {

    private final ProviderAttachmentRepository repository;

    @Inject
    public ProviderAttachmentService(ProviderAttachmentRepository repository) {
        this.repository = repository;
    }

    public List<ProviderAttachment> listForUser(Long userId) {
        return repository.list("provider.id", userId);
    }

    public ProviderAttachment getRequired(Long id) {
        return repository.findByIdOptional(id).orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                "PROVIDER_ATTACHMENT_NOT_FOUND",
                "Pièce introuvable"));
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

    public void ensureOwnership(AppUser user, ProviderAttachment attachment) {
        if (!attachment.getProvider().getId().equals(user.getId())) {
            throw new EcodeliException(Response.Status.FORBIDDEN,
                    "PROVIDER_ATTACHMENT_FORBIDDEN",
                    "Pièce non accessible");
        }
    }
}

