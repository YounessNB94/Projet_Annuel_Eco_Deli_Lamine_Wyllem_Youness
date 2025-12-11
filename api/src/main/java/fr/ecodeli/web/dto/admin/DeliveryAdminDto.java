package fr.ecodeli.web.dto.admin;

import fr.ecodeli.entity.DeliveryStatus;
import java.time.OffsetDateTime;

public record DeliveryAdminDto(
        Long id,
        DeliveryStatus status,
        Long courierUserId,
        Long shipperUserId,
        Long announcementId,
        Long priceCents,
        String currency,
        OffsetDateTime updatedAt
) {
}

