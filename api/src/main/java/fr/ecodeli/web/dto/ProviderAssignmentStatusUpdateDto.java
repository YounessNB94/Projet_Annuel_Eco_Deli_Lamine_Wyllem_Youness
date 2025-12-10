package fr.ecodeli.web.dto;

import fr.ecodeli.entity.ProviderAssignmentStatus;
import jakarta.validation.constraints.NotNull;

public record ProviderAssignmentStatusUpdateDto(
        @NotNull ProviderAssignmentStatus status
) {
}

