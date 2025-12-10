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
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "provider_assignment", indexes = {
        @Index(name = "ix_provider_assignment_user", columnList = "provider_user_id"),
        @Index(name = "ix_provider_assignment_status", columnList = "status")
})
public class ProviderAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_user_id", nullable = false)
    private AppUser provider;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ProviderAssignmentStatus status = ProviderAssignmentStatus.ASSIGNED;

    @Column(name = "scheduled_at")
    private OffsetDateTime scheduledAt;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @Column(name = "client_name", length = 120)
    private String clientName;

    @Column(name = "client_contact", length = 120)
    private String clientContact;
}

