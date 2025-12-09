package fr.ecodeli.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;

public record DocumentMetadataDto(
        Long id,
        @NotBlank @Size(max = 255) String fileName,
        @NotBlank @Size(max = 128) String mimeType,
        @NotNull Long sizeBytes,
        @NotBlank @Size(max = 64) String sha256,
        @NotNull OffsetDateTime createdAt,
        @NotBlank @Size(max = 255) String storageKey
) {
}
