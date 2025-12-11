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
}

