package fr.ecodeli.repository;

import fr.ecodeli.entity.Payment;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

@ApplicationScoped
public class PaymentRepository implements PanacheRepository<Payment> {

    public Optional<Payment> findByStripeIntentId(String intentId) {
        return find("stripePaymentIntentId", intentId).firstResultOptional();
    }
}

