package fr.ecodeli.service;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.BillableLink;
import fr.ecodeli.entity.BillableLinkType;
import fr.ecodeli.entity.Payment;
import fr.ecodeli.entity.PaymentStatus;
import fr.ecodeli.repository.BillableLinkRepository;
import fr.ecodeli.repository.PaymentRepository;
import fr.ecodeli.web.dto.PaymentIntentRequest;
import fr.ecodeli.web.dto.PaymentIntentResponse;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final DeliveryService deliveryService;
    private final BillableLinkRepository billableLinkRepository;
    private final InvoiceService invoiceService;

    @Inject
    public PaymentService(PaymentRepository paymentRepository,
                          DeliveryService deliveryService,
                          BillableLinkRepository billableLinkRepository,
                          InvoiceService invoiceService) {
        this.paymentRepository = paymentRepository;
        this.deliveryService = deliveryService;
        this.billableLinkRepository = billableLinkRepository;
        this.invoiceService = invoiceService;
    }

    @Transactional
    public PaymentIntentResponse createIntent(AppUser payer, PaymentIntentRequest request) {
        var delivery = deliveryService.getRequired(request.deliveryId());
        ensureOwnership(payer, delivery.getShipper());

        if (billableLinkRepository.find("delivery.id", delivery.getId()).firstResultOptional().isPresent()) {
            throw new EcodeliException(Response.Status.CONFLICT,
                    "DELIVERY_ALREADY_PAID",
                    "Cette livraison dispose déj�� d'un paiement");
        }

        var payment = new Payment();
        payment.setPayer(payer);
        payment.setStripePaymentIntentId("mock_pi_" + UUID.randomUUID());
        payment.setAmountCents(request.amountCents());
        payment.setCurrency(request.currency().toUpperCase());
        payment.setDescription(request.description());
        payment.setStatus(PaymentStatus.SUCCEEDED);
        payment.setCreatedAt(OffsetDateTime.now());
        payment.setUpdatedAt(OffsetDateTime.now());
        paymentRepository.persist(payment);

        var link = new BillableLink();
        link.setPayment(payment);
        link.setDelivery(delivery);
        link.setType(BillableLinkType.DELIVERY);
        link.setLabel("Livraison #" + delivery.getId());
        billableLinkRepository.persist(link);

        invoiceService.createForPayment(payment);

        var clientSecret = "mock_client_secret_" + payment.getStripePaymentIntentId();
        return new PaymentIntentResponse(payment.getId(), clientSecret, payment.getStatus(),
                payment.getAmountCents(), payment.getCurrency());
    }

    private void ensureOwnership(AppUser payer, AppUser shipper) {
        if (shipper == null || !shipper.getId().equals(payer.getId())) {
            throw new EcodeliException(Response.Status.FORBIDDEN,
                    "PAYMENT_FORBIDDEN",
                    "Vous ne pouvez payer que vos propres livraisons");
        }
    }

    public List<Payment> listForAdmin(PaymentStatus status, Long payerId) {
        return paymentRepository.search(status, payerId);
    }
}
