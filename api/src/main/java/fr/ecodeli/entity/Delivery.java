package fr.ecodeli.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.PrePersist;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "delivery", indexes = {
        @Index(name = "ix_delivery_status", columnList = "status"),
        @Index(name = "ix_delivery_announcement", columnList = "announcement_id"),
        @Index(name = "ix_delivery_courier", columnList = "courier_user_id")
})
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "announcement_id")
    private Announcement announcement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcel_id")
    private Parcel parcel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipper_user_id", nullable = false)
    private AppUser shipper;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courier_user_id")
    private AppUser courier;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private DeliveryStatus status = DeliveryStatus.CREATED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pickup_address_id", nullable = false)
    private Address pickupAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dropoff_address_id", nullable = false)
    private Address dropoffAddress;

    @Column(name = "price_cents")
    private Long priceCents;

    @Column(length = 3)
    private String currency = "EUR";

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "delivery")
    private List<TrackingEvent> trackingEvents = new ArrayList<>();

    @Column(name = "recipient_name", length = 160)
    private String recipientName;

    @Column(name = "recipient_phone", length = 32)
    private String recipientPhone;

    @Column(name = "instructions", length = 500)
    private String instructions;

    @Column(name = "pickup_at")
    private OffsetDateTime pickupAt;

    @Column(name = "delivered_at")
    private OffsetDateTime deliveredAt;

    @PrePersist
    void onPersist() {
        var now = OffsetDateTime.now();
        createdAt = now;
        updatedAt = now;
    }
}
