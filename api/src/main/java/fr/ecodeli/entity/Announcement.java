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
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "announcement", indexes = {
        @Index(name = "ix_announcement_status", columnList = "status"),
        @Index(name = "ix_announcement_type", columnList = "type"),
        @Index(name = "ix_announcement_created_by", columnList = "created_by_user_id"),
        @Index(name = "ix_announcement_merchant_company", columnList = "merchant_company_id")
})
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private AppUser createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_company_id")
    private MerchantCompany merchantCompany;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private AnnouncementType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private AnnouncementStatus status = AnnouncementStatus.DRAFT;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_address_id", nullable = false)
    private Address fromAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_address_id", nullable = false)
    private Address toAddress;

    @Column(name = "earliest_at", nullable = false)
    private OffsetDateTime earliestAt;

    @Column(name = "latest_at", nullable = false)
    private OffsetDateTime latestAt;

    @Column(name = "budget_cents", nullable = false)
    private Long budgetCents;

    @Column(length = 3, nullable = false)
    private String currency = "EUR";

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "announcement")
    private List<AnnouncementAssignment> assignments = new ArrayList<>();

    @PrePersist
    void onPersist() {
        var now = OffsetDateTime.now();
        createdAt = now;
        updatedAt = now;
    }
}

