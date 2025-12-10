package fr.ecodeli.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserDeviceCreateDto(
        @NotBlank @Size(max = 32) String platform,
        @NotBlank @Size(max = 128) String onesignalPlayerId
) {
}

