package fr.ecodeli.web.dto.admin;

import fr.ecodeli.entity.CourierProfileStatus;
import java.time.OffsetDateTime;

public record CourierAdminDto(
        Long userId,
        String email,
        String firstName,
        String lastName,
        CourierProfileStatus status,
        OffsetDateTime validatedAt,
        String vehicleType,
        Double maxWeightKg,
        String ibanMasked,
        boolean hasDocuments
) {
}
