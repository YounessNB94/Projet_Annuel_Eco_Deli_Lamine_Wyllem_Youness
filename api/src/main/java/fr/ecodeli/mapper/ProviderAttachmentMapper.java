package fr.ecodeli.mapper;

import fr.ecodeli.entity.ProviderAttachment;
import fr.ecodeli.web.dto.ProviderAttachmentAdminDto;
import fr.ecodeli.web.dto.ProviderAttachmentDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface ProviderAttachmentMapper {

    @Mapping(target = "documentId", source = "document.id")
    ProviderAttachmentDto toDto(ProviderAttachment entity);

    @Mapping(target = "providerUserId", source = "provider.id")
    @Mapping(target = "providerEmail", source = "provider.email")
    @Mapping(target = "documentId", source = "document.id")
    ProviderAttachmentAdminDto toAdminDto(ProviderAttachment entity);
}
