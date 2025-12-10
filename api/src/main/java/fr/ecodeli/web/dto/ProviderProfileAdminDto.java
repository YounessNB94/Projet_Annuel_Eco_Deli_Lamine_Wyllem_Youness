package fr.ecodeli.web.dto;

import fr.ecodeli.entity.ValidationStatus;
import java.time.OffsetDateTime;

public record ProviderProfileAdminDto(
        Long userId,
        String email,
        ValidationStatus status,
        String bio,
        String skills,
        Long hourlyRateCents,
        String currency,
        String ibanMasked,
        OffsetDateTime validatedAt,
        Long validatedByAdminId,
        String rejectionReason,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}

