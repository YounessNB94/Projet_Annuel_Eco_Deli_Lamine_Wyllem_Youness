package fr.ecodeli.service;

import fr.ecodeli.entity.Address;
import fr.ecodeli.repository.AddressRepository;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class AddressService {

    private final AddressRepository repository;

    @Inject
    public AddressService(AddressRepository repository) {
        this.repository = repository;
    }

    public List<Address> listAll() {
        return repository.listAll();
    }

    public Optional<Address> findById(Long id) {
        return repository.findByIdOptional(id);
    }

    @Transactional
    public Address create(Address address) {
        repository.persist(address);
        return address;
    }

    @Transactional
    public Address update(Long id, Address payload) {
        var existing = repository.findByIdOptional(id).orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                "ADDRESS_NOT_FOUND",
                "Adresse introuvable"));
        existing.setLabel(payload.getLabel());
        existing.setLine1(payload.getLine1());
        existing.setLine2(payload.getLine2());
        existing.setPostalCode(payload.getPostalCode());
        existing.setCity(payload.getCity());
        existing.setCountryCode(payload.getCountryCode());
        existing.setLatitude(payload.getLatitude());
        existing.setLongitude(payload.getLongitude());
        return repository.getEntityManager().merge(existing);
    }

    @Transactional
    public boolean delete(Long id) {
        return repository.deleteById(id);
    }
}
