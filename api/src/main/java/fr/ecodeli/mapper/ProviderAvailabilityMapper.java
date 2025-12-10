package fr.ecodeli.mapper;

import fr.ecodeli.entity.ProviderAvailability;
import fr.ecodeli.web.dto.ProviderAvailabilityDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface ProviderAvailabilityMapper {

    ProviderAvailabilityDto toDto(ProviderAvailability entity);

    @Mapping(target = "provider", ignore = true)
    ProviderAvailability toEntity(ProviderAvailabilityDto dto);
}

