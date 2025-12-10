package fr.ecodeli.repository;

import fr.ecodeli.entity.ProviderAvailability;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProviderAvailabilityRepository implements PanacheRepository<ProviderAvailability> {
}

