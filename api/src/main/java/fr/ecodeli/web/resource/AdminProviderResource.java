package fr.ecodeli.web.resource;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.ValidationStatus;
import fr.ecodeli.mapper.ProviderAttachmentMapper;
import fr.ecodeli.mapper.ProviderProfileMapper;
import fr.ecodeli.service.AppUserService;
import fr.ecodeli.service.ProviderAttachmentService;
import fr.ecodeli.service.ProviderProfileService;
import fr.ecodeli.web.dto.ProviderAttachmentAdminDto;
import fr.ecodeli.web.dto.ProviderAttachmentReviewDto;
import fr.ecodeli.web.dto.ProviderProfileAdminDto;
import fr.ecodeli.web.dto.ProviderProfileReviewDto;
import fr.ecodeli.web.exception.EcodeliException;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;
import java.io.IOException;
import java.util.List;

@Path("/api/v1/admin/providers")
@RolesAllowed("ADMIN")
@Produces(MediaType.APPLICATION_JSON)
public class AdminProviderResource {

    private final SecurityIdentity identity;
    private final AppUserService appUserService;
    private final ProviderProfileService profileService;
    private final ProviderAttachmentService attachmentService;
    private final ProviderProfileMapper profileMapper;
    private final ProviderAttachmentMapper attachmentMapper;

    @Inject
    public AdminProviderResource(SecurityIdentity identity,
                                 AppUserService appUserService,
                                 ProviderProfileService profileService,
                                 ProviderAttachmentService attachmentService,
                                 ProviderProfileMapper profileMapper,
                                 ProviderAttachmentMapper attachmentMapper) {
        this.identity = identity;
        this.appUserService = appUserService;
        this.profileService = profileService;
        this.attachmentService = attachmentService;
        this.profileMapper = profileMapper;
        this.attachmentMapper = attachmentMapper;
    }

    @GET
    public List<ProviderProfileAdminDto> listProviders(@QueryParam("status") ValidationStatus status,
                                                       @QueryParam("pendingOnly") @DefaultValue("false") boolean pendingOnly,
                                                       @QueryParam("search") String search) {
        return profileService.searchForAdmin(status, pendingOnly, search).stream()
                .map(profileMapper::toAdminDto)
                .toList();
    }

    @PATCH
    @Path("/{providerUserId}/status")
    @Consumes(MediaType.APPLICATION_JSON)
    public ProviderProfileAdminDto reviewProfile(@PathParam("providerUserId") Long providerUserId,
                                                 @Valid ProviderProfileReviewDto payload) {
        var admin = currentAdmin();
        var updated = profileService.reviewProfile(admin, providerUserId, payload.status(), payload.reason());
        return profileMapper.toAdminDto(updated);
    }

    @GET
    @Path("/attachments")
    public List<ProviderAttachmentAdminDto> listAttachments(@QueryParam("status") ValidationStatus status,
                                                            @QueryParam("pendingOnly") @DefaultValue("false") boolean pendingOnly) {
        return attachmentService.listForAdmin(status, pendingOnly).stream()
                .map(attachmentMapper::toAdminDto)
                .toList();
    }

    @PATCH
    @Path("/attachments/{attachmentId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public ProviderAttachmentAdminDto reviewAttachment(@PathParam("attachmentId") Long attachmentId,
                                                       @Valid ProviderAttachmentReviewDto payload) {
        var admin = currentAdmin();
        var updated = attachmentService.review(admin, attachmentId, payload.status(), payload.reason());
        return attachmentMapper.toAdminDto(updated);
    }

    @GET
    @Path("/attachments/{attachmentId}/download")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadAttachment(@PathParam("attachmentId") Long attachmentId) {
        var admin = currentAdmin();
        var download = attachmentService.openDocumentForAdmin(attachmentId, admin);
        StreamingOutput body = output -> {
            try (var in = download.stream()) {
                in.transferTo(output);
            }
        };
        return Response.ok(body)
                .type(download.document().getMimeType())
                .header("Content-Disposition",
                        "attachment; filename=\"%s\"".formatted(download.document().getFileName()))
                .build();
    }

    @GET
    @Path("/{providerUserId}/documents")
    public List<ProviderAttachmentAdminDto> listProviderDocuments(@PathParam("providerUserId") Long providerUserId) {
        return attachmentService.listByProvider(providerUserId).stream()
                .map(attachmentMapper::toAdminDto)
                .toList();
    }

    private AppUser currentAdmin() {
        return appUserService.findByEmail(identity.getPrincipal().getName())
                .orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                        "USER_NOT_FOUND",
                        "Administrateur introuvable"));
    }
}
