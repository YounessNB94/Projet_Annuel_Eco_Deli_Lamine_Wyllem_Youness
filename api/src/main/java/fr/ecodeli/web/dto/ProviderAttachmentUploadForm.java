package fr.ecodeli.web.dto;

import fr.ecodeli.entity.DocumentType;
import fr.ecodeli.entity.ProviderAttachmentType;
import jakarta.validation.constraints.NotNull;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

public class ProviderAttachmentUploadForm {

    @NotNull
    @RestForm("file")
    public FileUpload file;

    @NotNull
    @RestForm("type")
    public ProviderAttachmentType type;

    @RestForm("documentType")
    public DocumentType documentType = DocumentType.PROVIDER_PROOF;
}

