package fr.ecodeli.repository;

import fr.ecodeli.entity.Delivery;
import fr.ecodeli.entity.DeliveryStatus;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class DeliveryRepository implements PanacheRepository<Delivery> {

    public Delivery findActiveByAnnouncement(Long announcementId) {
        return find("announcement.id = ?1 AND status <> ?2", announcementId, DeliveryStatus.CANCELLED)
                .firstResult();
    }

    public List<Delivery> findByStatus(DeliveryStatus status, int limit) {
        return find("status", status).range(0, Math.max(0, limit - 1)).list();
    }

    public List<Delivery> search(DeliveryStatus status, Long courierUserId) {
        var query = new StringBuilder("1=1");
        var params = new java.util.HashMap<String, Object>();
        if (status != null) {
            query.append(" AND status = :status");
            params.put("status", status);
        }
        if (courierUserId != null) {
            query.append(" AND courier.id = :courierId");
            params.put("courierId", courierUserId);
        }
        return find(query.toString(), params).list();
    }
}
