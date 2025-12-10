package fr.ecodeli.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record ProviderAvailabilityUpdateDto(
        @NotEmpty List<@Valid ProviderAvailabilityDto> slots
) {
}

