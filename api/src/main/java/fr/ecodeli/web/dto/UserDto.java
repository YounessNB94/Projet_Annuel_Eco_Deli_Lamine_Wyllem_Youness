package fr.ecodeli.web.dto;

import fr.ecodeli.entity.AppUserStatus;
import java.time.OffsetDateTime;
import java.util.List;

public record UserDto(
        Long id,
        String keycloakUserId,
        String email,
        String phone,
        AppUserStatus status,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        UserProfileDto profile,
        List<UserAddressDto> addresses
) {
}

