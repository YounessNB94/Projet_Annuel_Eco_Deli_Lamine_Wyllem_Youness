package fr.ecodeli.repository;

import fr.ecodeli.entity.ProviderAttachment;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProviderAttachmentRepository implements PanacheRepository<ProviderAttachment> {
}

