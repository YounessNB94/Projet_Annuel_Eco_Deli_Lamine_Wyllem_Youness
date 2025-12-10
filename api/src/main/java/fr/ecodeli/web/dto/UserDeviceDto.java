package fr.ecodeli.web.dto;

import java.time.OffsetDateTime;

public record UserDeviceDto(
        Long id,
        String platform,
        String onesignalPlayerId,
        OffsetDateTime createdAt,
        OffsetDateTime lastActiveAt
) {
}

