package fr.ecodeli.web.dto;

import java.math.BigDecimal;

public record AddressDto(
        Long id,
        String label,
        String line1,
        String line2,
        String postalCode,
        String city,
        String countryCode,
        BigDecimal latitude,
        BigDecimal longitude
) {
}

