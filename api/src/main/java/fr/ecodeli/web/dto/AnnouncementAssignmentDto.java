package fr.ecodeli.web.dto;

import java.time.OffsetDateTime;

public record AnnouncementAssignmentDto(
        Long courierUserId,
        String courierEmail,
        OffsetDateTime assignedAt,
        String note
) {
}

