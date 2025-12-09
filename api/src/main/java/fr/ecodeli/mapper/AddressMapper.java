package fr.ecodeli.mapper;

import fr.ecodeli.entity.Address;
import fr.ecodeli.web.dto.AddressDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "cdi")
public interface AddressMapper {

    AddressDto toDto(Address entity);

    @Mapping(target = "id", ignore = true)
    Address toEntity(AddressDto dto);
}

