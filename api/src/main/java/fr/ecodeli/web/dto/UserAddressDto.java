package fr.ecodeli.web.dto;

public record UserAddressDto(
        Long userId,
        AddressDto address,
        boolean isDefault
) {
}

