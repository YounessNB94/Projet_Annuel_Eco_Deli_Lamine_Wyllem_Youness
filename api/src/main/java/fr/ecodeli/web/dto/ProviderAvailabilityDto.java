package fr.ecodeli.web.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

public record ProviderAvailabilityDto(
        Long id,
        DayOfWeek dayOfWeek,
        LocalDate date,
        @NotNull LocalTime startTime,
        @NotNull LocalTime endTime,
        @Size(max = 64) String timezone,
        boolean recurring
) {
}

