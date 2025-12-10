package fr.ecodeli.repository;

import fr.ecodeli.entity.ProviderInvoice;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProviderInvoiceRepository implements PanacheRepository<ProviderInvoice> {
}

