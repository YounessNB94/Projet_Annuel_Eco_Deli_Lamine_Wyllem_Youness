package fr.ecodeli.web.dto;

import fr.ecodeli.entity.ValidationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProviderAttachmentReviewDto(
        @NotNull ValidationStatus status,
        @Size(max = 512) String reason
) {
}

