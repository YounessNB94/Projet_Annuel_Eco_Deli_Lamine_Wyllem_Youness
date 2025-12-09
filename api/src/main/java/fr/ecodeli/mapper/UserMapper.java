package fr.ecodeli.mapper;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.web.dto.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(
        componentModel = MappingConstants.ComponentModel.JAKARTA_CDI,
        uses = {UserProfileMapper.class, UserAddressMapper.class})
public interface UserMapper {

    @Mapping(target = "profile", source = "profile")
    @Mapping(target = "addresses", source = "addresses")
    UserDto toDto(AppUser entity);
}
