package fr.ecodeli.web.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record UserProfileDto(
        Long userId,
        String firstName,
        String lastName,
        LocalDate birthDate,
        String defaultLanguage,
        OffsetDateTime tutorialShownAt,
        OffsetDateTime tutorialCompletedAt
) {
}

