package fr.ecodeli.mapper;

import fr.ecodeli.entity.UserAddress;
import fr.ecodeli.web.dto.UserAddressDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "cdi", uses = AddressMapper.class)
public interface UserAddressMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "isDefault", source = "default")
    UserAddressDto toDto(UserAddress entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "address", source = "address")
    @Mapping(target = "default", source = "isDefault")
    UserAddress toEntity(UserAddressDto dto);
}
