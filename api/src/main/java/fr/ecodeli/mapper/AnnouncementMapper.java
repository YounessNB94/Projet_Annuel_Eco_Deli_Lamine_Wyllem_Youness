package fr.ecodeli.mapper;

import fr.ecodeli.entity.Announcement;
import fr.ecodeli.entity.AnnouncementAssignment;
import fr.ecodeli.web.dto.AnnouncementAssignmentDto;
import fr.ecodeli.web.dto.AnnouncementCreateDto;
import fr.ecodeli.web.dto.AnnouncementDto;
import fr.ecodeli.web.dto.AnnouncementUpdateDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI,
        uses = {AddressMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AnnouncementMapper {

    @Mapping(target = "fromAddress", source = "fromAddress")
    @Mapping(target = "toAddress", source = "toAddress")
    AnnouncementDto toDto(Announcement entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "merchantCompany", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "assignments", ignore = true)
    @Mapping(target = "fromAddress", ignore = true)
    @Mapping(target = "toAddress", ignore = true)
    Announcement toEntity(AnnouncementCreateDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "merchantCompany", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "assignments", ignore = true)
    @Mapping(target = "fromAddress", ignore = true)
    @Mapping(target = "toAddress", ignore = true)
    Announcement toEntity(AnnouncementUpdateDto dto);

    @Mapping(target = "courierUserId", source = "courier.id")
    @Mapping(target = "courierEmail", source = "courier.email")
    AnnouncementAssignmentDto toDto(AnnouncementAssignment assignment);
}
