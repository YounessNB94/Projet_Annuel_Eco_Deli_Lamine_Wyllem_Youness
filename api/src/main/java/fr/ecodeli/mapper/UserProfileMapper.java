package fr.ecodeli.mapper;

import fr.ecodeli.entity.UserProfile;
import fr.ecodeli.web.dto.UserProfileDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface UserProfileMapper {

    UserProfileDto toDto(UserProfile entity);

    @Mapping(target = "user", ignore = true)
    UserProfile toEntity(UserProfileDto dto);
}
