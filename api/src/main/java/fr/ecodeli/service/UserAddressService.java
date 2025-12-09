package fr.ecodeli.service;

import fr.ecodeli.entity.Address;
import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.UserAddress;
import fr.ecodeli.entity.UserAddressId;
import fr.ecodeli.repository.UserAddressRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UserAddressService {

    private final UserAddressRepository repository;

    @Inject
    public UserAddressService(UserAddressRepository repository) {
        this.repository = repository;
    }

    public List<UserAddress> listAll() {
        return repository.listAll();
    }

    public Optional<UserAddress> findById(UserAddressId id) {
        return repository.findByIdOptional(id);
    }

    @Transactional
    public UserAddress create(UserAddress userAddress) {
        repository.persist(userAddress);
        return userAddress;
    }

    @Transactional
    public UserAddress update(UserAddress userAddress) {
        return repository.getEntityManager().merge(userAddress);
    }

    @Transactional
    public boolean delete(UserAddressId id) {
        return repository.deleteById(id);
    }

    public UserAddress getRequired(UserAddressId id) {
        return findById(id).orElseThrow(NotFoundException::new);
    }

    @Transactional
    public UserAddress linkAddress(AppUser user, Address address, boolean isDefault) {
        var userAddress = new UserAddress();
        userAddress.setUser(user);
        userAddress.setAddress(address);
        userAddress.setId(new UserAddressId(user.getId(), address.getId()));
        userAddress.setDefault(isDefault);
        repository.persist(userAddress);
        return userAddress;
    }

    @Transactional
    public void ensureOwnership(AppUser user, Long addressId) {
        var id = new UserAddressId(user.getId(), addressId);
        getRequired(id);
    }
}
