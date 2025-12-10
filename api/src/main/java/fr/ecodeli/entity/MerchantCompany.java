package fr.ecodeli.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "merchant_company", indexes = {
        @Index(name = "ix_merchant_company_user", columnList = "merchant_user_id")
})
public class MerchantCompany {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_user_id", nullable = false)
    private AppUser merchant;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false, length = 14, unique = true)
    private String siret;

    @Column(name = "vat_number", length = 32)
    private String vatNumber;

    @Column(name = "billing_email", length = 320)
    private String billingEmail;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}