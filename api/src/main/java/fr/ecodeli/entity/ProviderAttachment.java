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
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "provider_attachment", indexes = {
        @Index(name = "ix_provider_attachment_user", columnList = "provider_user_id"),
        @Index(name = "ix_provider_attachment_type", columnList = "type")
})
public class ProviderAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_user_id", nullable = false)
    private AppUser provider;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ProviderAttachmentType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ValidationStatus status = ValidationStatus.PENDING;

    @Column(name = "submitted_at", nullable = false)
    private OffsetDateTime submittedAt;

    @Column(name = "reviewed_at")
    private OffsetDateTime reviewedAt;

    @Column(name = "reviewed_by_admin_id")
    private Long reviewedByAdminId;

    @Column(name = "rejection_reason", length = 512)
    private String rejectionReason;

    @PrePersist
    void onPersist() {
        if (submittedAt == null) {
            submittedAt = OffsetDateTime.now();
        }
    }
}
