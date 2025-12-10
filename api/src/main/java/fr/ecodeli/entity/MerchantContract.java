package fr.ecodeli.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "merchant_contract", indexes = {
        @Index(name = "ix_merchant_contract_company", columnList = "merchant_company_id"),
        @Index(name = "ix_merchant_contract_status", columnList = "status")
})
public class MerchantContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_company_id", nullable = false)
    private MerchantCompany company;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private MerchantContractStatus status = MerchantContractStatus.DRAFT;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "terms_pdf_document_id")
    private Long termsPdfDocumentId;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "signed_at")
    private OffsetDateTime signedAt;

    @Column(name = "signed_by_user_id")
    private Long signedByUserId;

    @Column(name = "countersigned_at")
    private OffsetDateTime countersignedAt;

    @Column(name = "countersigned_by_admin_id")
    private Long countersignedByAdminId;
}

