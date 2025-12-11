package fr.ecodeli.web.dto.admin;

import fr.ecodeli.entity.AnnouncementStatus;
import fr.ecodeli.entity.AnnouncementType;
import java.time.OffsetDateTime;

public record AnnouncementAdminDto(
        Long id,
        AnnouncementStatus status,
        AnnouncementType type,
        String title,
        Long merchantCompanyId,
        Long createdByUserId,
        OffsetDateTime createdAt
) {
}

