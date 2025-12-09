package fr.ecodeli.web.dto;

import fr.ecodeli.entity.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

public class DocumentUploadForm {

    @NotNull
    @RestForm("file")
    public FileUpload file;

    @NotBlank
    @Size(max = 255)
    @RestForm("fileName")
    public String fileName;

    @NotBlank
    @Size(max = 128)
    @RestForm("mimeType")
    public String mimeType;

    @RestForm("type")
    public DocumentType type = DocumentType.OTHER;
}
