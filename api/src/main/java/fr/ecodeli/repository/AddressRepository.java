package fr.ecodeli.repository;

import jakarta.enterprise.context.ApplicationScoped;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import fr.ecodeli.entity.Address;

@ApplicationScoped
public class AddressRepository implements PanacheRepository<Address> {
}