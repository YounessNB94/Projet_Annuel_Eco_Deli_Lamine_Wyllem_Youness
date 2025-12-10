package fr.ecodeli.repository;

import fr.ecodeli.entity.MerchantCompany;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MerchantCompanyRepository implements PanacheRepository<MerchantCompany> {
}