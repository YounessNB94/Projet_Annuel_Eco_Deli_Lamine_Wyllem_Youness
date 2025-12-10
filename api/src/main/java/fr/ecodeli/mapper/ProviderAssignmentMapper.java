package fr.ecodeli.mapper;

import fr.ecodeli.entity.ProviderAssignment;
import fr.ecodeli.web.dto.ProviderAssignmentDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface ProviderAssignmentMapper {

    ProviderAssignmentDto toDto(ProviderAssignment entity);
}

