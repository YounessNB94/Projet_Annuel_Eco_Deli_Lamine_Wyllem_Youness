package fr.ecodeli.web.dto;

import fr.ecodeli.entity.PayoutStatus;
import java.time.OffsetDateTime;
import java.util.List;

public record PayoutDto(
        Long id,
        PayoutStatus status,
        OffsetDateTime periodStart,
        OffsetDateTime periodEnd,
        Long amountCents,
        String currency,
        String reference,
        OffsetDateTime sentAt,
        List<PayoutLineDto> lines
) {
}

