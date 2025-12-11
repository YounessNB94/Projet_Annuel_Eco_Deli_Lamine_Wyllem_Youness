package fr.ecodeli.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PaymentIntentRequest(
        @NotNull Long deliveryId,
        @NotNull @Min(100) Long amountCents,
        @NotBlank String currency,
        String description
) {
}

