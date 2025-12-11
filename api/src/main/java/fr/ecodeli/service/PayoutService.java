package fr.ecodeli.service;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.Payout;
import fr.ecodeli.entity.PayoutLine;
import fr.ecodeli.entity.PayoutStatus;
import fr.ecodeli.repository.PayoutLineRepository;
import fr.ecodeli.repository.PayoutRepository;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class PayoutService {

    private final PayoutRepository payoutRepository;
    private final PayoutLineRepository payoutLineRepository;
    private final DeliveryService deliveryService;
    private final ZoneId payoutZoneId;

    @Inject
    public PayoutService(PayoutRepository payoutRepository,
                         PayoutLineRepository payoutLineRepository,
                         DeliveryService deliveryService,
                         @ConfigProperty(name = "ecodeli.payout.timezone", defaultValue = "Europe/Paris") String payoutZone) {
        this.payoutRepository = payoutRepository;
        this.payoutLineRepository = payoutLineRepository;
        this.deliveryService = deliveryService;
        this.payoutZoneId = ZoneId.of(payoutZone);
    }

    public List<Payout> listForUser(Long userId) {
        return payoutRepository.listByUser(userId);
    }

    public List<Payout> listAll() {
        return payoutRepository.listAll();
    }

    public List<Payout> listByStatus(PayoutStatus status) {
        return payoutRepository.listByStatus(status);
    }

    public List<Payout> listByPeriod(YearMonth period) {
        return payoutRepository.listByPeriod(startOf(period), endOf(period));
    }

    public Payout getRequired(Long id) {
        return payoutRepository.findByIdOptional(id).orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                "PAYOUT_NOT_FOUND",
                "Virement introuvable"));
    }

    @Transactional
    public Payout generateForCourier(AppUser courier, YearMonth period, Long amountCents, Long deliveryId) {
        var periodStart = startOf(period);
        var periodEnd = endOf(period);
        var existing = payoutRepository.listByPeriod(periodStart, periodEnd).stream()
                .filter(payout -> payout.getBeneficiary().getId().equals(courier.getId()))
                .findFirst();
        if (existing.isPresent()) {
            return existing.get();
        }
        var payout = new Payout();
        payout.setBeneficiary(courier);
        payout.setPeriodStart(periodStart);
        payout.setPeriodEnd(periodEnd);
        payout.setAmountCents(amountCents);
        payout.setCurrency("EUR");
        payout.setReference("PAYOUT-" + period + "-" + UUID.randomUUID());
        payout.setStatus(PayoutStatus.PENDING);
        payoutRepository.persist(payout);

        var line = new PayoutLine();
        line.setPayout(payout);
        if (deliveryId != null) {
            line.setDelivery(deliveryService.getRequired(deliveryId));
        }
        line.setAmountCents(amountCents);
        line.setCurrency("EUR");
        line.setNote("Règlement période " + period);
        payoutLineRepository.persist(line);
        payout.getLines().add(line);
        return payout;
    }

    @Transactional
    public Payout updateStatus(Long payoutId, PayoutStatus status) {
        var payout = getRequired(payoutId);
        payout.setStatus(status);
        if (status == PayoutStatus.SENT) {
            payout.setSentAt(OffsetDateTime.now());
        }
        return payout;
    }

    private OffsetDateTime startOf(YearMonth period) {
        return period.atDay(1)
                .atStartOfDay(payoutZoneId)
                .toOffsetDateTime();
    }

    private OffsetDateTime endOf(YearMonth period) {
        return period.atEndOfMonth()
                .atTime(23, 59, 59)
                .atZone(payoutZoneId)
                .toOffsetDateTime();
    }
}
