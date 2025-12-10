package fr.ecodeli.web.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MerchantContractSignDto(
        @NotNull Long contractId,
        @Size(max = 512) String signatureNote
) {
}

