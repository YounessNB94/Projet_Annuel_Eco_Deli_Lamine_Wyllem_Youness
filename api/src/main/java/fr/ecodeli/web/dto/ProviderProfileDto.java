package fr.ecodeli.web.dto;

import fr.ecodeli.entity.ValidationStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;

public record ProviderProfileDto(
        Long userId,
        ValidationStatus status,
        @Size(max = 500) String bio,
        @Size(max = 255) String skills,
        @Min(0) Long hourlyRateCents,
        @Size(max = 3) String currency,
        @Size(max = 34) String ibanMasked,
        OffsetDateTime validatedAt,
        Long validatedByAdminId
) {
}
