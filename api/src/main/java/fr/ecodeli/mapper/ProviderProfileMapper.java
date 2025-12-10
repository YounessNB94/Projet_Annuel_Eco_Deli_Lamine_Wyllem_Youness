package fr.ecodeli.mapper;

import fr.ecodeli.entity.ProviderProfile;
import fr.ecodeli.web.dto.ProviderProfileDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface ProviderProfileMapper {

    ProviderProfileDto toDto(ProviderProfile entity);
//[WARNING] /Users/seily/Work/sources/youness/ecodeli/Projet_Annuel_Eco_Deli_Lamine_Wyllem_Youness/api/src/main/java/fr/ecodeli/mapper/ProviderProfileMapper.java:[15,21] Unmapped target properties: "createdAt, updatedAt".
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ProviderProfile toEntity(ProviderProfileDto dto);
}

