package fr.ecodeli.repository;

import fr.ecodeli.entity.Payout;
import fr.ecodeli.entity.PayoutStatus;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.OffsetDateTime;
import java.util.List;

@ApplicationScoped
public class PayoutRepository implements PanacheRepository<Payout> {

    public List<Payout> listByUser(Long userId) {
        return find("beneficiary.id", userId).list();
    }

    public List<Payout> listByStatus(PayoutStatus status) {
        return find("status", status).list();
    }

    public List<Payout> listByPeriod(OffsetDateTime from, OffsetDateTime to) {
        return find("periodStart = ?1 AND periodEnd = ?2", from, to).list();
    }
}

