package fr.ecodeli.web.dto.admin;

import java.time.OffsetDateTime;

public record CourierDocumentAdminDto(
        Long id,
        String type,
        Long documentId,
        OffsetDateTime submittedAt,
        OffsetDateTime reviewedAt
) {
}

