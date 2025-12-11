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
@Table(name = "invoice", indexes = {
        @Index(name = "ix_invoice_user", columnList = "user_id"),
        @Index(name = "ix_invoice_payment", columnList = "payment_id"),
        @Index(name = "ix_invoice_status", columnList = "status")
})
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_no", nullable = false, unique = true, length = 32)
    private String invoiceNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private InvoiceStatus status = InvoiceStatus.DRAFT;

    @Column(name = "period_start")
    private OffsetDateTime periodStart;

    @Column(name = "period_end")
    private OffsetDateTime periodEnd;

    @Column(name = "total_cents", nullable = false)
    private Long totalCents;

    @Column(length = 3, nullable = false)
    private String currency = "EUR";

    @Column(name = "pdf_document_id")
    private Long pdfDocumentId;

    @Column(name = "issued_at")
    private OffsetDateTime issuedAt;

    @OneToMany(mappedBy = "invoice")
    private List<InvoiceLine> lines = new ArrayList<>();

    @PrePersist
    void onPersist() {
        if (issuedAt == null && status == InvoiceStatus.ISSUED) {
            issuedAt = OffsetDateTime.now();
        }
    }
}

