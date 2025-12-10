package fr.ecodeli.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record MerchantCompanyUpdateDto(
        @NotBlank @Size(max = 160) String name,
        @NotBlank @Pattern(regexp = "^[0-9]{14}$") String siret,
        @Size(max = 32) String vatNumber,
        @Email @Size(max = 320) String billingEmail
) {
}

