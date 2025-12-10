package fr.ecodeli.mapper;

import fr.ecodeli.entity.UserDevice;
import fr.ecodeli.web.dto.UserDeviceCreateDto;
import fr.ecodeli.web.dto.UserDeviceDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface UserDeviceMapper {

    UserDeviceDto toDto(UserDevice entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "lastActiveAt", ignore = true)
    UserDevice toEntity(UserDeviceCreateDto dto);
}

