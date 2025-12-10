package fr.ecodeli.repository;

import fr.ecodeli.entity.ProviderAssignment;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProviderAssignmentRepository implements PanacheRepository<ProviderAssignment> {
}

