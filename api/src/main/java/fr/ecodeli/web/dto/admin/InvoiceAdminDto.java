package fr.ecodeli.web.dto.admin;

import fr.ecodeli.entity.InvoiceStatus;
import java.time.OffsetDateTime;

public record InvoiceAdminDto(
        Long id,
        String invoiceNo,
        InvoiceStatus status,
        Long userId,
        Long paymentId,
        Long totalCents,
        String currency,
        OffsetDateTime issuedAt
) {
}

