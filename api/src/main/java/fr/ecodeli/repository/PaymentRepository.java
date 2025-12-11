package fr.ecodeli.repository;

import fr.ecodeli.entity.Payment;
import fr.ecodeli.entity.PaymentStatus;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@ApplicationScoped
public class PaymentRepository implements PanacheRepository<Payment> {

    public Optional<Payment> findByStripeIntentId(String intentId) {
        return find("stripePaymentIntentId", intentId).firstResultOptional();
    }

    public List<Payment> search(PaymentStatus status, Long payerId) {
        var query = new StringBuilder("1=1");
        Map<String, Object> params = new HashMap<>();
        if (status != null) {
            query.append(" AND status = :status");
            params.put("status", status);
        }
        if (payerId != null) {
            query.append(" AND payer.id = :payerId");
            params.put("payerId", payerId);
        }
        return find(query.toString(), params).list();
    }
}
