package fr.ecodeli.web.resource;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.DocumentType;
import fr.ecodeli.mapper.DocumentMapper;
import fr.ecodeli.service.AppUserService;
import fr.ecodeli.service.DocumentService;
import fr.ecodeli.web.dto.DocumentMetadataDto;
import fr.ecodeli.web.dto.DocumentUploadForm;
import fr.ecodeli.web.dto.DocumentUploadResponse;
import fr.ecodeli.web.exception.EcodeliException;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.io.IOException;
import java.nio.file.Files;

@Path("/api/v1/documents")
@Authenticated
public class DocumentResource {

    private final DocumentService documentService;
    private final DocumentMapper documentMapper;
    private final AppUserService appUserService;
    private final SecurityIdentity identity;

    @Inject
    public DocumentResource(DocumentService documentService,
                            DocumentMapper documentMapper,
                            AppUserService appUserService,
                            SecurityIdentity identity) {
        this.documentService = documentService;
        this.documentMapper = documentMapper;
        this.appUserService = appUserService;
        this.identity = identity;
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response upload(@Valid DocumentUploadForm form) {
        var user = currentUser();
        var file = form.file;
        if (file == null || file.fileName() == null) {
            throw new EcodeliException(Response.Status.BAD_REQUEST,
                    "DOCUMENT_FILE_MISSING",
                    "Missing file in form data");
        }
        var content = readBytes(file);
        var type = form.type == null ? DocumentType.OTHER : form.type;
        var document = documentService.store(content, form.fileName, form.mimeType, user.getId(), type);
        var dto = new DocumentUploadResponse(documentMapper.toDto(document));
        return Response.status(Response.Status.CREATED).entity(dto).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public DocumentMetadataDto metadata(@PathParam("id") Long id) {
        var user = currentUser();
        var document = documentService.getMetadata(id, user.getId());
        return documentMapper.toDto(document);
    }

    @GET
    @Path("/{id}/download")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response download(@PathParam("id") Long id) {
        var user = currentUser();
        var document = documentService.requireAccess(id, user.getId());
        var stream = documentService.openStream(document);
        return Response.ok(stream)
                .type(document.getMimeType())
                .header("Content-Disposition", "attachment; filename=\"" + document.getFileName() + "\"")
                .build();
    }

    private AppUser currentUser() {
        var email = identity.getPrincipal().getName();
        return appUserService.findByEmail(email)
                .orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                        "USER_NOT_FOUND",
                        "Utilisateur introuvable"));
    }

    private byte[] readBytes(FileUpload file) {
        try {
            return Files.readAllBytes(file.uploadedFile());
        } catch (IOException e) {
            throw new EcodeliException(Response.Status.BAD_REQUEST,
                    "DOCUMENT_FILE_READ_ERROR",
                    "Unable to read uploaded file");
        }
    }
}
