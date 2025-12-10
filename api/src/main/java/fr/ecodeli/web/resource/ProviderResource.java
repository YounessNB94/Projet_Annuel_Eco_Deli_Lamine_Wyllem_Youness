package fr.ecodeli.web.resource;

import fr.ecodeli.entity.DocumentType;
import fr.ecodeli.entity.ProviderAssignmentStatus;
import fr.ecodeli.entity.ProviderAvailability;
import fr.ecodeli.mapper.ProviderAssignmentMapper;
import fr.ecodeli.mapper.ProviderAvailabilityMapper;
import fr.ecodeli.mapper.ProviderAttachmentMapper;
import fr.ecodeli.mapper.ProviderInvoiceMapper;
import fr.ecodeli.mapper.ProviderProfileMapper;
import fr.ecodeli.service.AppUserService;
import fr.ecodeli.service.DocumentService;
import fr.ecodeli.service.ProviderAssignmentService;
import fr.ecodeli.service.ProviderAttachmentService;
import fr.ecodeli.service.ProviderAvailabilityService;
import fr.ecodeli.service.ProviderInvoiceService;
import fr.ecodeli.service.ProviderProfileService;
import fr.ecodeli.web.dto.ProviderAssignmentDto;
import fr.ecodeli.web.dto.ProviderAssignmentStatusUpdateDto;
import fr.ecodeli.web.dto.ProviderAvailabilityDto;
import fr.ecodeli.web.dto.ProviderAvailabilityUpdateDto;
import fr.ecodeli.web.dto.ProviderAttachmentDto;
import fr.ecodeli.web.dto.ProviderAttachmentUploadForm;
import fr.ecodeli.web.dto.ProviderInvoiceDto;
import fr.ecodeli.web.dto.ProviderProfileDto;
import fr.ecodeli.web.exception.EcodeliException;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/v1/providers/me")
@RolesAllowed("PROVIDER")
@Produces(MediaType.APPLICATION_JSON)
public class ProviderResource {

    private final SecurityIdentity identity;
    private final AppUserService appUserService;
    private final ProviderProfileService profileService;
    private final ProviderAttachmentService attachmentService;
    private final ProviderAvailabilityService availabilityService;
    private final ProviderAssignmentService assignmentService;
    private final ProviderInvoiceService invoiceService;
    private final DocumentService documentService;
    private final ProviderProfileMapper profileMapper;
    private final ProviderAttachmentMapper attachmentMapper;
    private final ProviderAvailabilityMapper availabilityMapper;
    private final ProviderAssignmentMapper assignmentMapper;
    private final ProviderInvoiceMapper invoiceMapper;

    @Inject
    public ProviderResource(SecurityIdentity identity,
                            AppUserService appUserService,
                            ProviderProfileService profileService,
                            ProviderAttachmentService attachmentService,
                            ProviderAvailabilityService availabilityService,
                            ProviderAssignmentService assignmentService,
                            ProviderInvoiceService invoiceService,
                            DocumentService documentService,
                            ProviderProfileMapper profileMapper,
                            ProviderAttachmentMapper attachmentMapper,
                            ProviderAvailabilityMapper availabilityMapper,
                            ProviderAssignmentMapper assignmentMapper,
                            ProviderInvoiceMapper invoiceMapper) {
        this.identity = identity;
        this.appUserService = appUserService;
        this.profileService = profileService;
        this.attachmentService = attachmentService;
        this.availabilityService = availabilityService;
        this.assignmentService = assignmentService;
        this.invoiceService = invoiceService;
        this.documentService = documentService;
        this.profileMapper = profileMapper;
        this.attachmentMapper = attachmentMapper;
        this.availabilityMapper = availabilityMapper;
        this.assignmentMapper = assignmentMapper;
        this.invoiceMapper = invoiceMapper;
    }

    private fr.ecodeli.entity.AppUser currentUser() {
        return appUserService.findByEmail(identity.getPrincipal().getName())
                .orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                        "USER_NOT_FOUND",
                        "Utilisateur introuvable"));
    }

    @GET
    @Path("/profile")
    public ProviderProfileDto getProfile() {
        var user = currentUser();
        var profile = profileService.ensureProfile(user);
        return profileMapper.toDto(profile);
    }

    @PATCH
    @Path("/profile")
    @Consumes(MediaType.APPLICATION_JSON)
    public ProviderProfileDto updateProfile(@Valid ProviderProfileDto payload) {
        var user = currentUser();
        var updated = profileService.updateProfile(user, profileMapper.toEntity(payload));
        return profileMapper.toDto(updated);
    }

    @GET
    @Path("/attachments")
    public List<ProviderAttachmentDto> listAttachments() {
        var user = currentUser();
        return attachmentService.listForUser(user.getId()).stream()
                .map(attachmentMapper::toDto)
                .toList();
    }

    @POST
    @Path("/attachments")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public ProviderAttachmentDto uploadAttachment(@Valid ProviderAttachmentUploadForm form) {
        var user = currentUser();
        var file = form.file;
        if (file == null || file.fileName() == null) {
            throw new EcodeliException(Response.Status.BAD_REQUEST,
                    "PROVIDER_ATTACHMENT_FILE_MISSING",
                    "Fichier manquant");
        }
        byte[] content;
        try {
            content = java.nio.file.Files.readAllBytes(file.uploadedFile());
        } catch (java.io.IOException e) {
            throw new EcodeliException(Response.Status.BAD_REQUEST,
                    "PROVIDER_ATTACHMENT_READ_ERROR",
                    "Impossible de lire le fichier" );
        }
        var document = documentService.store(content, file.fileName(), file.contentType(), user.getId(), form.documentType);
        var attachment = new fr.ecodeli.entity.ProviderAttachment();
        attachment.setDocument(document);
        attachment.setType(form.type);
        var saved = attachmentService.save(user, attachment);
        return attachmentMapper.toDto(saved);
    }

    @DELETE
    @Path("/attachments/{attachmentId}")
    public void deleteAttachment(@PathParam("attachmentId") Long attachmentId) {
        var user = currentUser();
        attachmentService.delete(user, attachmentId);
    }

    @GET
    @Path("/availability")
    public List<ProviderAvailabilityDto> getAvailability() {
        var user = currentUser();
        return availabilityService.listForUser(user.getId()).stream()
                .map(availabilityMapper::toDto)
                .toList();
    }

    @PUT
    @Path("/availability")
    public List<ProviderAvailabilityDto> updateAvailability(@Valid ProviderAvailabilityUpdateDto payload) {
        var user = currentUser();
        var entities = payload.slots().stream()
                .map(availabilityMapper::toEntity)
                .toList();
        var saved = availabilityService.replaceAll(user, entities);
        return saved.stream().map(availabilityMapper::toDto).toList();
    }

    @GET
    @Path("/assignments")
    public List<ProviderAssignmentDto> listAssignments() {
        var user = currentUser();
        return assignmentService.listForUser(user.getId()).stream()
                .map(assignmentMapper::toDto)
                .toList();
    }

    @PATCH
    @Path("/assignments/{assignmentId}")
    public ProviderAssignmentDto updateAssignmentStatus(@PathParam("assignmentId") Long assignmentId,
                                                         @Valid ProviderAssignmentStatusUpdateDto payload) {
        var user = currentUser();
        var updated = assignmentService.updateStatus(user, assignmentId, payload.status());
        return assignmentMapper.toDto(updated);
    }

    @GET
    @Path("/invoices")
    public List<ProviderInvoiceDto> listInvoices() {
        var user = currentUser();
        return invoiceService.listForUser(user.getId()).stream()
                .map(invoiceMapper::toDto)
                .toList();
    }

    @GET
    @Path("/invoices/{invoiceId}")
    public ProviderInvoiceDto getInvoice(@PathParam("invoiceId") Long invoiceId) {
        var user = currentUser();
        var invoice = invoiceService.getForUser(user, invoiceId);
        return invoiceMapper.toDto(invoice);
    }
}

