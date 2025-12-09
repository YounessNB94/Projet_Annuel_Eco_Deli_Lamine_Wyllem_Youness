package fr.ecodeli.mapper;

import fr.ecodeli.entity.Document;
import fr.ecodeli.web.dto.DocumentMetadataDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "cdi")
public interface DocumentMapper {

    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "storageKey", source = "storageKey")
    DocumentMetadataDto toDto(Document document);
}
