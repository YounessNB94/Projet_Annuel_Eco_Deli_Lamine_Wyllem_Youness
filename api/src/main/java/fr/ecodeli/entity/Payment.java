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
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "payment", indexes = {
        @Index(name = "ix_payment_payer", columnList = "payer_user_id"),
        @Index(name = "ix_payment_intent", columnList = "stripe_payment_intent_id")
})
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payer_user_id", nullable = false)
    private AppUser payer;

    @Column(name = "stripe_payment_intent_id", nullable = false, unique = true, length = 64)
    private String stripePaymentIntentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private PaymentStatus status = PaymentStatus.REQUIRES_PAYMENT_METHOD;

    @Column(name = "amount_cents", nullable = false)
    private Long amountCents;

    @Column(length = 3, nullable = false)
    private String currency = "EUR";

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @OneToMany(mappedBy = "payment")
    private List<BillableLink> billableLinks = new ArrayList<>();

    @Column(name = "card_brand", length = 32)
    private String cardBrand;

    @Column(name = "card_last4", length = 4)
    private String cardLast4;
}
