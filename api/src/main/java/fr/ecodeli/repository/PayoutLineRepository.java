package fr.ecodeli.repository;

import fr.ecodeli.entity.PayoutLine;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PayoutLineRepository implements PanacheRepository<PayoutLine> {
}

