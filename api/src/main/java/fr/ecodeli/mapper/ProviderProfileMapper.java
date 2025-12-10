package fr.ecodeli.mapper;

import fr.ecodeli.entity.ProviderProfile;
import fr.ecodeli.web.dto.ProviderProfileAdminDto;
import fr.ecodeli.web.dto.ProviderProfileDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface ProviderProfileMapper {

    ProviderProfileDto toDto(ProviderProfile entity);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ProviderProfile toEntity(ProviderProfileDto dto);

    @Mapping(target = "email", source = "user.email")
    ProviderProfileAdminDto toAdminDto(ProviderProfile entity);
}
