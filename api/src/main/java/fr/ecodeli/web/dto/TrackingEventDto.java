package fr.ecodeli.web.dto;

import fr.ecodeli.entity.TrackingEventType;
import java.time.OffsetDateTime;

public record TrackingEventDto(
        Long id,
        TrackingEventType status,
        OffsetDateTime occurredAt,
        String message,
        Double latitude,
        Double longitude
) {
}

