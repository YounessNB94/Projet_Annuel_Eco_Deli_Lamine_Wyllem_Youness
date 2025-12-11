package fr.ecodeli.mapper;

import fr.ecodeli.entity.CourierProfile;
import fr.ecodeli.web.dto.admin.CourierAdminDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CourierAdminMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "firstName", source = "user.profile.firstName")
    @Mapping(target = "lastName", source = "user.profile.lastName")
    @Mapping(target = "hasDocuments", expression = "java(Boolean.FALSE)")
    CourierAdminDto toDto(CourierProfile profile);
}
