package fr.ecodeli.mapper;

import fr.ecodeli.entity.ProviderInvoice;
import fr.ecodeli.web.dto.ProviderInvoiceDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface ProviderInvoiceMapper {

    @Mapping(target = "documentId", source = "pdf.id")
    ProviderInvoiceDto toDto(ProviderInvoice entity);
}

