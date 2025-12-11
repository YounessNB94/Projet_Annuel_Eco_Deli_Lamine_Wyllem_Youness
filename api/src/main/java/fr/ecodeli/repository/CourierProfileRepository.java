package fr.ecodeli.repository;

import fr.ecodeli.entity.CourierProfile;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CourierProfileRepository implements PanacheRepository<CourierProfile> {
}

