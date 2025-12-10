package fr.ecodeli.web.dto;

import fr.ecodeli.entity.ProviderAttachmentType;
import fr.ecodeli.entity.ValidationStatus;
import java.time.OffsetDateTime;

public record ProviderAttachmentDto(
        Long id,
        ProviderAttachmentType type,
        ValidationStatus status,
        Long documentId,
        OffsetDateTime submittedAt,
        OffsetDateTime reviewedAt
) {
}

