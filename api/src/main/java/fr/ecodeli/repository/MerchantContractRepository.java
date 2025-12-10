package fr.ecodeli.repository;

import fr.ecodeli.entity.MerchantContract;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MerchantContractRepository implements PanacheRepository<MerchantContract> {
}

