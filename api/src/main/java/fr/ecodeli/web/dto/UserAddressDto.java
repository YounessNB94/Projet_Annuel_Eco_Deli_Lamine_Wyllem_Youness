package fr.ecodeli.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record UserAddressDto(
        Long userId,
        @NotNull @Valid AddressDto address,
        boolean isDefault
) {
}
