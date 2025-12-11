package fr.ecodeli.mapper;

import fr.ecodeli.entity.Invoice;
import fr.ecodeli.entity.InvoiceLine;
import fr.ecodeli.web.dto.InvoiceDto;
import fr.ecodeli.web.dto.InvoiceLineDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface InvoiceMapper {

    InvoiceDto toDto(Invoice invoice);

    InvoiceLineDto toDto(InvoiceLine line);
}

