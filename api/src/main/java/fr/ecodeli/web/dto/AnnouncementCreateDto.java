package fr.ecodeli.web.dto;

import fr.ecodeli.entity.AnnouncementType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;

public record AnnouncementCreateDto(
        @NotNull AnnouncementType type,
        @NotBlank @Size(max = 160) String title,
        @NotBlank @Size(max = 2000) String description,
        @NotNull Long fromAddressId,
        @NotNull Long toAddressId,
        @NotNull OffsetDateTime earliestAt,
        @NotNull OffsetDateTime latestAt,
        @NotNull @Positive Long budgetCents,
        @NotBlank @Size(max = 3) String currency,
        Long merchantCompanyId
) {
}

