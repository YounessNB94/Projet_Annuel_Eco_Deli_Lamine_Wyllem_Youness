package fr.ecodeli.web.dto;

import java.time.OffsetDateTime;

public record PayoutLineDto(
        Long id,
        Long deliveryId,
        Long amountCents,
        String currency,
        String note,
        OffsetDateTime recordedAt
) {
}

