package fr.ecodeli.web.dto;

public record InvoiceLineDto(
        Long id,
        String label,
        Integer quantity,
        Long unitPriceCents,
        Long totalCents
) {
}

