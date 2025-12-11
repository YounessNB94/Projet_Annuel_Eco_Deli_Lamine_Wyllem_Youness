package fr.ecodeli.repository;

import fr.ecodeli.entity.Invoice;
import fr.ecodeli.entity.InvoiceStatus;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@ApplicationScoped
public class InvoiceRepository implements PanacheRepository<Invoice> {

    public Optional<Invoice> findByPaymentId(Long paymentId) {
        return find("payment.id", paymentId).firstResultOptional();
    }

    public List<Invoice> listByUser(Long userId) {
        return find("user.id", userId).list();
    }

    public List<Invoice> listByStatus(InvoiceStatus status) {
        return find("status", status).list();
    }

    public List<Invoice> search(InvoiceStatus status, OffsetDateTime from, OffsetDateTime to) {
        var query = new StringBuilder("1=1");
        Map<String, Object> params = new HashMap<>();
        if (status != null) {
            query.append(" AND status = :status");
            params.put("status", status);
        }
        if (from != null) {
            query.append(" AND issuedAt >= :from");
            params.put("from", from);
        }
        if (to != null) {
            query.append(" AND issuedAt <= :to");
            params.put("to", to);
        }
        return find(query.toString(), params).list();
    }
}
