package fr.ecodeli.repository;

import fr.ecodeli.entity.UserProfile;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserProfileRepository implements PanacheRepository<UserProfile> {
}

