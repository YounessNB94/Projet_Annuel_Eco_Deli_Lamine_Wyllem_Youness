package fr.ecodeli.mapper;

import fr.ecodeli.entity.Delivery;
import fr.ecodeli.entity.TrackingEvent;
import fr.ecodeli.web.dto.DeliveryDto;
import fr.ecodeli.web.dto.TrackingEventDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI,
        uses = AddressMapper.class,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DeliveryMapper {

    @Mapping(target = "announcementId", source = "announcement.id")
    @Mapping(target = "parcelId", source = "parcel.id")
    @Mapping(target = "shipperUserId", source = "shipper.id")
    @Mapping(target = "courierUserId", source = "courier.id")
    DeliveryDto toDto(Delivery entity);

    TrackingEventDto toDto(TrackingEvent event);
}

