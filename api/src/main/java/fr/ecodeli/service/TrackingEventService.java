package fr.ecodeli.service;

import fr.ecodeli.entity.Delivery;
import fr.ecodeli.entity.TrackingEvent;
import fr.ecodeli.entity.TrackingEventType;
import fr.ecodeli.repository.TrackingEventRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.util.List;

@ApplicationScoped
public class TrackingEventService {

    private final TrackingEventRepository repository;

    @Inject
    public TrackingEventService(TrackingEventRepository repository) {
        this.repository = repository;
    }

    public List<TrackingEvent> listForDelivery(Long deliveryId) {
        return repository.listByDelivery(deliveryId);
    }

    @Transactional
    public TrackingEvent record(Delivery delivery,
                                TrackingEventType type,
                                String message,
                                Double latitude,
                                Double longitude,
                                OffsetDateTime occurredAt) {
        var event = new TrackingEvent();
        event.setDelivery(delivery);
        event.setStatus(type);
        event.setOccurredAt(occurredAt != null ? occurredAt : OffsetDateTime.now());
        event.setMessage(message);
        event.setLatitude(latitude);
        event.setLongitude(longitude);
        repository.persist(event);
        return event;
    }
}
