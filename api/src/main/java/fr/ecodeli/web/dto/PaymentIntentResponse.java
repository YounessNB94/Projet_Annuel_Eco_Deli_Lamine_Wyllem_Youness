package fr.ecodeli.web.dto;

import fr.ecodeli.entity.PaymentStatus;

public record PaymentIntentResponse(
        Long paymentId,
        String clientSecret,
        PaymentStatus status,
        Long amountCents,
        String currency
) {
}

