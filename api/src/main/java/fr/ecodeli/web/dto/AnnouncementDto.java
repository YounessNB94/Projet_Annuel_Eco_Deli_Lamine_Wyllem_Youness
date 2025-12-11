package fr.ecodeli.web.dto;

import fr.ecodeli.entity.AnnouncementStatus;
import fr.ecodeli.entity.AnnouncementType;
import java.time.OffsetDateTime;

public record AnnouncementDto(
        Long id,
        AnnouncementType type,
        AnnouncementStatus status,
        String title,
        String description,
        AddressDto fromAddress,
        AddressDto toAddress,
        OffsetDateTime earliestAt,
        OffsetDateTime latestAt,
        Long budgetCents,
        String currency,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}

