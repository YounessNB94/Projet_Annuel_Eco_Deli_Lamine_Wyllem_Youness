package fr.ecodeli.web.dto;

import fr.ecodeli.entity.ProviderInvoiceStatus;
import java.time.OffsetDateTime;

public record ProviderInvoiceDto(
        Long id,
        ProviderInvoiceStatus status,
        OffsetDateTime periodStart,
        OffsetDateTime periodEnd,
        Long totalCents,
        String currency,
        Long documentId,
        OffsetDateTime issuedAt
) {
}

