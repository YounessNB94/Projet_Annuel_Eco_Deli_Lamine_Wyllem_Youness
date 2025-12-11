package fr.ecodeli.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "courier_profile")
public class CourierProfile {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private AppUser user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private CourierProfileStatus status = CourierProfileStatus.PENDING_REVIEW;

    @Column(name = "validated_at")
    private OffsetDateTime validatedAt;

    @Column(name = "vehicle_type", length = 32)
    private String vehicleType;

    @Column(name = "max_weight_kg")
    private Double maxWeightKg;

    @Column(name = "iban_masked", length = 34)
    private String ibanMasked;

    @PrePersist
    void onPersist() {
        if (status == null) {
            status = CourierProfileStatus.PENDING_REVIEW;
        }
    }
}
