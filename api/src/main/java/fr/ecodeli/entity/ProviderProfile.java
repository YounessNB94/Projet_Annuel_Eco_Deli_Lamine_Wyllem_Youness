package fr.ecodeli.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "provider_profile", indexes = {
        @jakarta.persistence.Index(name = "ix_provider_profile_status", columnList = "status"),
        @jakarta.persistence.Index(name = "ix_provider_profile_admin", columnList = "validated_by_admin_id")
})
public class ProviderProfile {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private AppUser user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ValidationStatus status = ValidationStatus.PENDING;

    @Column(name = "validated_at")
    private OffsetDateTime validatedAt;

    @Column(name = "validated_by_admin_id")
    private Long validatedByAdminId;

    @Column(name = "rejection_reason", length = 512)
    private String rejectionReason;

    @Column(length = 500)
    private String bio;

    @Column(length = 255)
    private String skills;

    @Column(name = "hourly_rate_cents")
    private Long hourlyRateCents;

    @Column(length = 3)
    private String currency = "EUR";

    @Column(name = "iban_masked", length = 34)
    private String ibanMasked;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    void onPersist() {
        var now = OffsetDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
