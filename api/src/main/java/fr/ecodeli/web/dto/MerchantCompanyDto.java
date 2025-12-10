package fr.ecodeli.web.dto;

import java.time.OffsetDateTime;

public record MerchantCompanyDto(
        Long id,
        Long merchantUserId,
        String name,
        String siret,
        String vatNumber,
        String billingEmail,
        OffsetDateTime createdAt
) {
}

