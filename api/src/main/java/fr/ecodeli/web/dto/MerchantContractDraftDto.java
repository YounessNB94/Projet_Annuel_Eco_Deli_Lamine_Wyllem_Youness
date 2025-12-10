package fr.ecodeli.web.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public record MerchantContractDraftDto(
        @NotNull @FutureOrPresent LocalDate startDate,
        LocalDate endDate,
        @NotNull @Positive Long termsPdfDocumentId
) {

    public MerchantContractDraftDto {
        if (endDate != null && startDate != null && endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("endDate must be on or after startDate");
        }
    }
}

