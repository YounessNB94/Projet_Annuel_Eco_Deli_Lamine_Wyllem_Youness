package fr.ecodeli.service;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.Delivery;
import fr.ecodeli.entity.DeliveryStatus;
import fr.ecodeli.entity.Payout;
import fr.ecodeli.repository.DeliveryRepository;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.util.List;

@ApplicationScoped
public class PayoutGenerationService {

    private final DeliveryRepository deliveryRepository;
    private final PayoutService payoutService;

    @Inject
    public PayoutGenerationService(DeliveryRepository deliveryRepository,
                                   PayoutService payoutService) {
        this.deliveryRepository = deliveryRepository;
        this.payoutService = payoutService;
    }

    @Transactional
    public Payout generateForCourier(AppUser courier, YearMonth period) {
        List<Delivery> deliveries = deliveryRepository.find("courier.id = ?1 AND status = ?2", courier.getId(), DeliveryStatus.DELIVERED)
                .list();
        if (deliveries.isEmpty()) {
            throw new EcodeliException(Response.Status.BAD_REQUEST,
                    "PAYOUT_NO_DELIVERIES",
                    "Aucune livraison livrée pour cette période");
        }
        long total = deliveries.stream().mapToLong(Delivery::getPriceCents).sum();
        return payoutService.generateForCourier(courier, period, total, deliveries.getFirst().getId());
    }
}

