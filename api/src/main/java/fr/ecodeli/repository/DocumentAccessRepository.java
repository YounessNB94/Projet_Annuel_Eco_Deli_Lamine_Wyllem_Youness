package fr.ecodeli.repository;

import fr.ecodeli.entity.DocumentAccess;
import fr.ecodeli.entity.DocumentAccessId;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class DocumentAccessRepository implements PanacheRepositoryBase<DocumentAccess, DocumentAccessId> {
}

