package fr.ecodeli.repository;

import fr.ecodeli.entity.UserAddress;
import fr.ecodeli.entity.UserAddressId;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserAddressRepository implements PanacheRepositoryBase<UserAddress, UserAddressId> {
}

