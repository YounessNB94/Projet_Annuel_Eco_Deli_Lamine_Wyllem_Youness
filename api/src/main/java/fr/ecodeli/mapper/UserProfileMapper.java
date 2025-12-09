package fr.ecodeli.mapper;

import fr.ecodeli.entity.UserProfile;
import fr.ecodeli.web.dto.UserProfileDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "cdi")
public interface UserProfileMapper {

    UserProfileDto toDto(UserProfile entity);

    @Mapping(target = "user", ignore = true)
    UserProfile toEntity(UserProfileDto dto);
}
