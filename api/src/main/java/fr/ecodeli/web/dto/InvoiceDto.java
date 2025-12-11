package fr.ecodeli.web.dto;

import fr.ecodeli.entity.InvoiceStatus;
import java.time.OffsetDateTime;
import java.util.List;

public record InvoiceDto(
        Long id,
        String invoiceNo,
        InvoiceStatus status,
        Long totalCents,
        String currency,
        OffsetDateTime issuedAt,
        Long paymentId,
        Long pdfDocumentId,
        List<InvoiceLineDto> lines
) {
}

