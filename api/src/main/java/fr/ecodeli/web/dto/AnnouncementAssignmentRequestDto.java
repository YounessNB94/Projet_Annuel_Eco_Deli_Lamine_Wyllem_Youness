package fr.ecodeli.web.dto;

import jakarta.validation.constraints.Size;

public record AnnouncementAssignmentRequestDto(
        @Size(max = 500) String note
) {
}

