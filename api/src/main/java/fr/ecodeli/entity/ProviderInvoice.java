package fr.ecodeli.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "provider_invoice", indexes = {
        @Index(name = "ix_provider_invoice_user", columnList = "provider_user_id"),
        @Index(name = "ix_provider_invoice_status", columnList = "status")
})
public class ProviderInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_user_id", nullable = false)
    private AppUser provider;

    @Column(name = "period_start", nullable = false)
    private OffsetDateTime periodStart;

    @Column(name = "period_end", nullable = false)
    private OffsetDateTime periodEnd;

    @Column(name = "total_cents", nullable = false)
    private Long totalCents;

    @Column(length = 3, nullable = false)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ProviderInvoiceStatus status = ProviderInvoiceStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document pdf;

    @Column(name = "issued_at")
    private OffsetDateTime issuedAt;
}
