package fr.ecodeli.repository;

import fr.ecodeli.entity.Invoice;
import fr.ecodeli.entity.InvoiceStatus;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
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
}

