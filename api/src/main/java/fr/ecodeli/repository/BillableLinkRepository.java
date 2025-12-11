package fr.ecodeli.repository;

import fr.ecodeli.entity.BillableLink;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class BillableLinkRepository implements PanacheRepository<BillableLink> {

    public List<BillableLink> listByPayment(Long paymentId) {
        return find("payment.id", paymentId).list();
    }
}

