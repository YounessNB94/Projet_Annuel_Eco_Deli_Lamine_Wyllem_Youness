package fr.ecodeli.mapper;

import fr.ecodeli.entity.MerchantCompany;
import fr.ecodeli.entity.MerchantContract;
import fr.ecodeli.web.dto.MerchantCompanyDto;
import fr.ecodeli.web.dto.MerchantCompanyUpdateDto;
import fr.ecodeli.web.dto.MerchantContractDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface MerchantMapper {

    @Mapping(target = "merchantUserId", source = "merchant.id")
    MerchantCompanyDto toDto(MerchantCompany entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "merchant", ignore = true)
    MerchantCompany toEntity(MerchantCompanyUpdateDto dto);

    @Mapping(target = "merchantCompanyId", source = "company.id")
    MerchantContractDto toDto(MerchantContract entity);
}

