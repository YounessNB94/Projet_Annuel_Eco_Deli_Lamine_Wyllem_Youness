package fr.ecodeli.service;

import fr.ecodeli.entity.Address;
import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.UserAddress;
import fr.ecodeli.entity.UserAddressId;
import fr.ecodeli.repository.AddressRepository;
import fr.ecodeli.repository.UserAddressRepository;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UserAddressService {

    private final UserAddressRepository userAddressRepository;
    private final AddressRepository addressRepository;

    @Inject
    public UserAddressService(UserAddressRepository userAddressRepository, AddressRepository addressRepository) {
        this.userAddressRepository = userAddressRepository;
        this.addressRepository = addressRepository;
    }

    public List<UserAddress> listAll() {
        return userAddressRepository.listAll();
    }

    public Optional<UserAddress> findById(UserAddressId id) {
        return userAddressRepository.findByIdOptional(id);
    }

    @Transactional
    public UserAddress create(UserAddress userAddress) {
        userAddressRepository.persist(userAddress);
        return userAddress;
    }

    @Transactional
    public UserAddress update(UserAddress userAddress) {
        return userAddressRepository.getEntityManager().merge(userAddress);
    }

    @Transactional
    public boolean delete(UserAddressId id) {
        return userAddressRepository.deleteById(id);
    }

    public UserAddress getRequired(UserAddressId id) {
        return findById(id).orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                "USER_ADDRESS_NOT_FOUND",
                "Adresse introuvable"));
    }

    @Transactional
    public UserAddress linkAddress(AppUser user, Address address, boolean isDefault) {
        var userAddress = new UserAddress();
        userAddress.setUser(user);
        userAddress.setAddress(address);
        userAddress.setId(new UserAddressId(user.getId(), address.getId()));
        if (isDefault || !hasAddress(user.getId())) {
            clearDefault(user.getId());
            userAddress.setDefault(true);
        } else {
            userAddress.setDefault(false);
        }
        userAddressRepository.persist(userAddress);
        return userAddress;
    }

    @Transactional
    public UserAddress ensureOwnership(AppUser user, Long addressId) {
        var id = new UserAddressId(user.getId(), addressId);
        var userAddress = getRequired(id);
        if (!userAddress.getUser().getId().equals(user.getId())) {
            throw new EcodeliException(Response.Status.FORBIDDEN,
                    "USER_ADDRESS_FORBIDDEN",
                    "Adresse non accessible");
        }
        return userAddress;
    }

    public List<UserAddress> listByUserId(Long userId) {
        return userAddressRepository.list("user.id", userId);
    }

    @Transactional
    public UserAddress setDefault(AppUser user, Long addressId) {
        var entry = ensureOwnership(user, addressId);
        clearDefault(user.getId());
        entry.setDefault(true);
        return entry;
    }

    @Transactional
    public void deleteForUser(AppUser user, Long addressId) {
        var entry = ensureOwnership(user, addressId);
        userAddressRepository.delete(entry);
        userAddressRepository.flush();
        if (entry.isDefault()) {
            assignDefaultIfMissing(user.getId());
        }
        deleteAddressIfOrphan(addressId);
    }

    private void clearDefault(Long userId) {
        userAddressRepository.update("isDefault = false where user.id = ?1", userId);
    }

    private boolean hasAddress(Long userId) {
        return userAddressRepository.count("user.id", userId) > 0;
    }

    private void assignDefaultIfMissing(Long userId) {
        var hasDefault = userAddressRepository.count("user.id = ?1 and isDefault = true", userId) > 0;
        if (!hasDefault) {
            var next = userAddressRepository.find("user.id = ?1 order by id.addressId", userId).firstResult();
            if (next != null) {
                next.setDefault(true);
            }
        }
    }

    private void deleteAddressIfOrphan(Long addressId) {
        var remaining = userAddressRepository.count("address.id", addressId);
        if (remaining == 0) {
            addressRepository.deleteById(addressId);
        }
    }
}
