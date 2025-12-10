package fr.ecodeli.repository;

import fr.ecodeli.entity.ProviderProfile;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProviderProfileRepository implements PanacheRepository<ProviderProfile> {
}

