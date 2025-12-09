package fr.ecodeli.web.dto;

import jakarta.validation.Valid;

public record DocumentUploadResponse(
        @Valid DocumentMetadataDto document
) {
}

