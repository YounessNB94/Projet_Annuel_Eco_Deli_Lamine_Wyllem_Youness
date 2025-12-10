package fr.ecodeli.web.dto;

import fr.ecodeli.entity.ProviderAssignmentStatus;
import java.time.OffsetDateTime;

public record ProviderAssignmentDto(
        Long id,
        String title,
        String description,
        ProviderAssignmentStatus status,
        OffsetDateTime scheduledAt,
        OffsetDateTime completedAt,
        String clientName,
        String clientContact
) {
}

