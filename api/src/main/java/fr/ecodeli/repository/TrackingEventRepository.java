package fr.ecodeli.repository;

import fr.ecodeli.entity.TrackingEvent;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class TrackingEventRepository implements PanacheRepository<TrackingEvent> {

    public List<TrackingEvent> listByDelivery(Long deliveryId) {
        return find("delivery.id = ?1 ORDER BY occurredAt ASC", deliveryId).list();
    }
}

