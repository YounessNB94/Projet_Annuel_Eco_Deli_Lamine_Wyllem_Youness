package fr.ecodeli.mapper;

import fr.ecodeli.entity.Payout;
import fr.ecodeli.entity.PayoutLine;
import fr.ecodeli.web.dto.PayoutDto;
import fr.ecodeli.web.dto.PayoutLineDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PayoutMapper {

    @Mapping(target = "lines", source = "lines")
    PayoutDto toDto(Payout payout);

    @Mapping(target = "deliveryId", source = "delivery.id")
    PayoutLineDto toDto(PayoutLine line);
}

