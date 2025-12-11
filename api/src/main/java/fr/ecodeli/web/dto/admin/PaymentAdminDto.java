package fr.ecodeli.web.dto.admin;

import fr.ecodeli.entity.PaymentStatus;
import java.time.OffsetDateTime;

public record PaymentAdminDto(
        Long id,
        PaymentStatus status,
        Long payerUserId,
        Long amountCents,
        String currency,
        String description,
        OffsetDateTime createdAt
) {
}

