package fr.ecodeli.service;

import fr.ecodeli.entity.Announcement;
import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.Delivery;
import fr.ecodeli.entity.DeliveryStatus;
import fr.ecodeli.entity.TrackingEventType;
import fr.ecodeli.repository.AnnouncementRepository;
import fr.ecodeli.repository.DeliveryRepository;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final AnnouncementRepository announcementRepository;
    private final TrackingEventService trackingEventService;

    private static final Map<DeliveryStatus, List<DeliveryStatus>> TRANSITIONS = new EnumMap<>(DeliveryStatus.class);

    static {
        TRANSITIONS.put(DeliveryStatus.CREATED, List.of(DeliveryStatus.ASSIGNED, DeliveryStatus.CANCELLED));
        TRANSITIONS.put(DeliveryStatus.ASSIGNED, List.of(DeliveryStatus.PICKED_UP, DeliveryStatus.CANCELLED));
        TRANSITIONS.put(DeliveryStatus.PICKED_UP, List.of(DeliveryStatus.IN_TRANSIT, DeliveryStatus.CANCELLED));
        TRANSITIONS.put(DeliveryStatus.IN_TRANSIT, List.of(DeliveryStatus.DELIVERED, DeliveryStatus.CANCELLED));
        TRANSITIONS.put(DeliveryStatus.DELIVERED, List.of());
        TRANSITIONS.put(DeliveryStatus.CANCELLED, List.of());
    }

    @Inject
    public DeliveryService(DeliveryRepository deliveryRepository,
                           AnnouncementRepository announcementRepository,
                           TrackingEventService trackingEventService) {
        this.deliveryRepository = deliveryRepository;
        this.announcementRepository = announcementRepository;
        this.trackingEventService = trackingEventService;
    }

    public Delivery getRequired(Long id) {
        return deliveryRepository.findByIdOptional(id)
                .orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                        "DELIVERY_NOT_FOUND",
                        "Livraison introuvable"));
    }

    public Delivery findActiveForAnnouncement(Long announcementId) {
        var delivery = deliveryRepository.findActiveByAnnouncement(announcementId);
        if (delivery == null) {
            throw new EcodeliException(Response.Status.NOT_FOUND,
                    "DELIVERY_NOT_FOUND",
                    "Aucune livraison active pour cette annonce");
        }
        return delivery;
    }

    public List<Delivery> listByStatus(DeliveryStatus status, int limit) {
        return deliveryRepository.findByStatus(status, limit);
    }

    @Transactional
    public Delivery createDraft(Announcement announcement, AppUser shipper) {
        var delivery = new Delivery();
        delivery.setAnnouncement(announcement);
        delivery.setShipper(shipper);
        delivery.setStatus(DeliveryStatus.CREATED);
        delivery.setPickupAddress(announcement.getFromAddress());
        delivery.setDropoffAddress(announcement.getToAddress());
        delivery.setRecipientName(announcement.getTitle());
        delivery.setCreatedAt(OffsetDateTime.now());
        delivery.setUpdatedAt(OffsetDateTime.now());
        deliveryRepository.persist(delivery);
        trackingEventService.record(delivery, TrackingEventType.INFO, "Livraison créée", null, null, null);
        return delivery;
    }

    @Transactional
    public Delivery assignCourier(Long deliveryId, AppUser courier) {
        var delivery = getRequired(deliveryId);
        delivery.setCourier(courier);
        return transition(delivery, DeliveryStatus.ASSIGNED, TrackingEventType.INFO, "Livreur assigné");
    }

    @Transactional
    public Delivery markPickedUp(Long deliveryId) {
        return transition(getRequired(deliveryId), DeliveryStatus.PICKED_UP, TrackingEventType.PICKED_UP, "Colis récupéré");
    }

    @Transactional
    public Delivery markInTransit(Long deliveryId) {
        return transition(getRequired(deliveryId), DeliveryStatus.IN_TRANSIT, TrackingEventType.IN_TRANSIT, "En transit");
    }

    @Transactional
    public Delivery markDelivered(Long deliveryId) {
        return transition(getRequired(deliveryId), DeliveryStatus.DELIVERED, TrackingEventType.DELIVERED, "Livré", true);
    }

    @Transactional
    public Delivery cancel(Long deliveryId, String reason) {
        return transition(getRequired(deliveryId), DeliveryStatus.CANCELLED, TrackingEventType.CANCELLED, reason);
    }

    @Transactional
    public Delivery createOrAssignFromAnnouncement(Announcement announcement, AppUser courier) {
        var existing = deliveryRepository.findActiveByAnnouncement(announcement.getId());
        if (existing == null) {
            var delivery = instantiateFromAnnouncement(announcement, courier);
            deliveryRepository.persist(delivery);
            trackingEventService.record(delivery, TrackingEventType.INFO, "Livraison créée", null, null, OffsetDateTime.now());
            trackingEventService.record(delivery, TrackingEventType.INFO, "Livreur assigné", null, null, OffsetDateTime.now());
            return delivery;
        }
        if (courier != null) {
            existing.setCourier(courier);
        }
        if (existing.getStatus() == DeliveryStatus.CREATED) {
            transition(existing, DeliveryStatus.ASSIGNED, TrackingEventType.INFO, "Livreur assigné");
        }
        return existing;
    }

    private Delivery instantiateFromAnnouncement(Announcement announcement, AppUser courier) {
        var delivery = new Delivery();
        delivery.setAnnouncement(announcement);
        delivery.setShipper(announcement.getCreatedBy());
        delivery.setCourier(courier);
        delivery.setPickupAddress(announcement.getFromAddress());
        delivery.setDropoffAddress(announcement.getToAddress());
        delivery.setRecipientName(announcement.getTitle());
        delivery.setPriceCents(announcement.getBudgetCents());
        delivery.setCurrency(announcement.getCurrency());
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        delivery.setCreatedAt(OffsetDateTime.now());
        delivery.setUpdatedAt(OffsetDateTime.now());
        return delivery;
    }

    private Delivery transition(Delivery delivery,
                                DeliveryStatus target,
                                TrackingEventType eventType,
                                String message) {
        return transition(delivery, target, eventType, message, false);
    }

    private Delivery transition(Delivery delivery,
                                DeliveryStatus target,
                                TrackingEventType eventType,
                                String message,
                                boolean terminal) {
        ensureTransitionAllowed(delivery.getStatus(), target);
        delivery.setStatus(target);
        delivery.setUpdatedAt(OffsetDateTime.now());
        if (target == DeliveryStatus.PICKED_UP) {
            delivery.setPickupAt(OffsetDateTime.now());
        } else if (target == DeliveryStatus.DELIVERED) {
            delivery.setDeliveredAt(OffsetDateTime.now());
        }
        trackingEventService.record(delivery, eventType, message, null, null, OffsetDateTime.now());
        if (terminal) {
            deliveryRepository.getEntityManager().flush();
        }
        return delivery;
    }

    private void ensureTransitionAllowed(DeliveryStatus current, DeliveryStatus target) {
        var allowed = TRANSITIONS.getOrDefault(current, List.of());
        if (!allowed.contains(target)) {
            throw new EcodeliException(Response.Status.BAD_REQUEST,
                    "DELIVERY_TRANSITION_FORBIDDEN",
                    "Transition interdite de " + current + " vers " + target);
        }
    }
}
