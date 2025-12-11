package fr.ecodeli.web.dto;

import fr.ecodeli.entity.DeliveryStatus;
import java.time.OffsetDateTime;

public record DeliveryDto(
        Long id,
        Long announcementId,
        Long parcelId,
        Long shipperUserId,
        Long courierUserId,
        DeliveryStatus status,
        AddressDto pickupAddress,
        AddressDto dropoffAddress,
        String recipientName,
        String recipientPhone,
        String instructions,
        Long priceCents,
        String currency,
        OffsetDateTime pickupAt,
        OffsetDateTime deliveredAt,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}

