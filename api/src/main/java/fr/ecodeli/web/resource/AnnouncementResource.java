package fr.ecodeli.web.resource;

import fr.ecodeli.entity.AnnouncementStatus;
import fr.ecodeli.entity.AnnouncementType;
import fr.ecodeli.mapper.AnnouncementMapper;
import fr.ecodeli.mapper.AddressMapper;
import fr.ecodeli.service.AddressService;
import fr.ecodeli.service.AnnouncementService;
import fr.ecodeli.service.AppUserService;
import fr.ecodeli.service.CourierAssignmentService;
import fr.ecodeli.web.dto.AnnouncementAssignmentDto;
import fr.ecodeli.web.dto.AnnouncementAssignmentRequestDto;
import fr.ecodeli.web.dto.AnnouncementCreateDto;
import fr.ecodeli.web.dto.AnnouncementDto;
import fr.ecodeli.web.dto.AnnouncementUpdateDto;
import fr.ecodeli.web.exception.EcodeliException;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/v1/announcements")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class AnnouncementResource {

    private final SecurityIdentity identity;
    private final AppUserService appUserService;
    private final AnnouncementService announcementService;
    private final CourierAssignmentService assignmentService;
    private final AddressService addressService;
    private final AnnouncementMapper announcementMapper;
    private final AddressMapper addressMapper;

    @Inject
    public AnnouncementResource(SecurityIdentity identity,
                                AppUserService appUserService,
                                AnnouncementService announcementService,
                                CourierAssignmentService assignmentService,
                                AddressService addressService,
                                AnnouncementMapper announcementMapper,
                                AddressMapper addressMapper) {
        this.identity = identity;
        this.appUserService = appUserService;
        this.announcementService = announcementService;
        this.assignmentService = assignmentService;
        this.addressService = addressService;
        this.announcementMapper = announcementMapper;
        this.addressMapper = addressMapper;
    }

    private fr.ecodeli.entity.AppUser currentUser() {
        return appUserService.findByEmail(identity.getPrincipal().getName())
                .orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                        "USER_NOT_FOUND",
                        "Utilisateur introuvable"));
    }

    @GET
    public List<AnnouncementDto> list(@QueryParam("status") AnnouncementStatus status,
                                      @QueryParam("type") AnnouncementType type,
                                      @QueryParam("mine") Boolean mine) {
        var user = currentUser();
        if (Boolean.TRUE.equals(mine)) {
            return announcementService.list(user, true, status, type).stream().map(announcementMapper::toDto).toList();
        }
        return announcementService.listPublic(status, type).stream().map(announcementMapper::toDto).toList();
    }

    @POST
    @RolesAllowed({"CLIENT", "MERCHANT"})
    public AnnouncementDto create(@Valid AnnouncementCreateDto payload) {
        var user = currentUser();
        var entity = announcementMapper.toEntity(payload);
        entity.setFromAddress(addressService.findById(payload.fromAddressId()).orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                "ADDRESS_NOT_FOUND",
                "Adresse départ introuvable")));
        entity.setToAddress(addressService.findById(payload.toAddressId()).orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                "ADDRESS_NOT_FOUND",
                "Adresse arrivée introuvable")));
        var created = announcementService.create(user, entity);
        return announcementMapper.toDto(created);
    }

    @PATCH
    @Path("/{announcementId}")
    @RolesAllowed({"CLIENT", "MERCHANT"})
    public AnnouncementDto update(@PathParam("announcementId") Long id,
                                  @Valid AnnouncementUpdateDto payload) {
        var user = currentUser();
        var updated = announcementService.updateDraft(user, id, announcementMapper.toEntity(payload));
        updated.setFromAddress(addressService.findById(payload.fromAddressId()).orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                "ADDRESS_NOT_FOUND",
                "Adresse départ introuvable")));
        updated.setToAddress(addressService.findById(payload.toAddressId()).orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                "ADDRESS_NOT_FOUND",
                "Adresse arrivée introuvable")));
        return announcementMapper.toDto(updated);
    }

    @POST
    @Path("/{announcementId}/publish")
    @RolesAllowed({"CLIENT", "MERCHANT"})
    public AnnouncementDto publish(@PathParam("announcementId") Long id) {
        var user = currentUser();
        return announcementMapper.toDto(announcementService.publish(user, id));
    }

    @POST
    @Path("/{announcementId}/cancel")
    @RolesAllowed({"CLIENT", "MERCHANT"})
    public AnnouncementDto cancel(@PathParam("announcementId") Long id) {
        var user = currentUser();
        return announcementMapper.toDto(announcementService.cancel(user, id));
    }

    @GET
    @Path("/{announcementId}/assignments")
    public List<AnnouncementAssignmentDto> listAssignments(@PathParam("announcementId") Long id) {
        var announcement = announcementService.getRequired(id);
        return assignmentService.list(announcement.getId()).stream()
                .map(announcementMapper::toDto)
                .toList();
    }

    @POST
    @Path("/{announcementId}/assignments")
    @RolesAllowed("COURIER")
    public AnnouncementAssignmentDto assign(@PathParam("announcementId") Long id,
                                            @Valid AnnouncementAssignmentRequestDto payload) {
        var courier = currentUser();
        var announcement = announcementService.getRequired(id);
        var assignment = assignmentService.assign(courier, announcement, payload.note());
        return announcementMapper.toDto(assignment);
    }
}
