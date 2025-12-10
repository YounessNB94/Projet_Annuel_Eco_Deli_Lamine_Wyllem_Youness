package fr.ecodeli.web.dto;

import fr.ecodeli.entity.ProviderAttachmentType;
import fr.ecodeli.entity.ValidationStatus;
import java.time.OffsetDateTime;

public record ProviderAttachmentAdminDto(
        Long id,
        Long providerUserId,
        String providerEmail,
        ProviderAttachmentType type,
        ValidationStatus status,
        Long documentId,
        OffsetDateTime submittedAt,
        OffsetDateTime reviewedAt,
        Long reviewedByAdminId,
        String rejectionReason
) {
}

