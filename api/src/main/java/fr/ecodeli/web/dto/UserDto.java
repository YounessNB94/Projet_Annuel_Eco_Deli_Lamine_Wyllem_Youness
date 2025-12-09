package fr.ecodeli.web.dto;

import fr.ecodeli.entity.AppUserStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.List;

public record UserDto(
        Long id,
        @NotBlank @Size(max = 64) String keycloakUserId,
        @NotBlank @Email @Size(max = 320) String email,
        @Size(max = 32) String phone,
        AppUserStatus status,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        @Valid UserProfileDto profile,
        List<@Valid UserAddressDto> addresses
) {
}
