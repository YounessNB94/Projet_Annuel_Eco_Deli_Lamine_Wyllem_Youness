package fr.ecodeli.repository;

import fr.ecodeli.entity.InvoiceLine;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class InvoiceLineRepository implements PanacheRepository<InvoiceLine> {
}

