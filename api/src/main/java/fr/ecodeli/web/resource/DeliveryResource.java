package fr.ecodeli.web.resource;

import fr.ecodeli.entity.DeliveryStatus;
import fr.ecodeli.entity.TrackingEventType;
import fr.ecodeli.mapper.DeliveryMapper;
import fr.ecodeli.service.AppUserService;
import fr.ecodeli.service.DeliveryService;
import fr.ecodeli.service.TrackingEventService;
import fr.ecodeli.web.dto.DeliveryDto;
import fr.ecodeli.web.dto.TrackingEventDto;
import fr.ecodeli.web.exception.EcodeliException;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/v1/deliveries")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class DeliveryResource {

    private final SecurityIdentity identity;
    private final AppUserService appUserService;
    private final DeliveryService deliveryService;
    private final TrackingEventService trackingEventService;
    private final DeliveryMapper mapper;

    @Inject
    public DeliveryResource(SecurityIdentity identity,
                            AppUserService appUserService,
                            DeliveryService deliveryService,
                            TrackingEventService trackingEventService,
                            DeliveryMapper mapper) {
        this.identity = identity;
        this.appUserService = appUserService;
        this.deliveryService = deliveryService;
        this.trackingEventService = trackingEventService;
        this.mapper = mapper;
    }

    private fr.ecodeli.entity.AppUser currentUser() {
        return appUserService.findByEmail(identity.getPrincipal().getName())
                .orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                        "USER_NOT_FOUND",
                        "Utilisateur introuvable"));
    }

    @GET
    @RolesAllowed({"ADMIN", "COURIER", "MERCHANT", "CLIENT"})
    public List<DeliveryDto> list(@QueryParam("status") DeliveryStatus status) {
        if (status == null) {
            throw new EcodeliException(Response.Status.BAD_REQUEST,
                    "DELIVERY_STATUS_REQUIRED",
                    "Le statut est obligatoire pour la liste");
        }
        return deliveryService.listByStatus(status, 50).stream().map(mapper::toDto).toList();
    }

    @GET
    @Path("/{deliveryId}")
    public DeliveryDto get(@PathParam("deliveryId") Long deliveryId) {
        return mapper.toDto(deliveryService.getRequired(deliveryId));
    }

    @GET
    @Path("/{deliveryId}/tracking")
    public List<TrackingEventDto> tracking(@PathParam("deliveryId") Long deliveryId) {
        deliveryService.getRequired(deliveryId); // ensure exists
        return trackingEventService.listForDelivery(deliveryId).stream()
                .map(mapper::toDto)
                .toList();
    }

    @PATCH
    @Path("/{deliveryId}/status")
    @RolesAllowed({"COURIER", "ADMIN"})
    public DeliveryDto updateStatus(@PathParam("deliveryId") Long deliveryId,
                                    @NotNull DeliveryStatus status) {
        var user = currentUser();
        var delivery = deliveryService.getRequired(deliveryId);
        if (delivery.getCourier() == null || !delivery.getCourier().getId().equals(user.getId())) {
            throw new EcodeliException(Response.Status.FORBIDDEN,
                    "DELIVERY_FORBIDDEN",
                    "Vous ne pouvez pas modifier cette livraison");
        }
        return switch (status) {
            case PICKED_UP -> mapper.toDto(deliveryService.markPickedUp(deliveryId));
            case IN_TRANSIT -> mapper.toDto(deliveryService.markInTransit(deliveryId));
            case DELIVERED -> mapper.toDto(deliveryService.markDelivered(deliveryId));
            case CANCELLED -> mapper.toDto(deliveryService.cancel(deliveryId, "Annulé par courier"));
            default -> throw new EcodeliException(Response.Status.BAD_REQUEST,
                    "DELIVERY_STATUS_UNSUPPORTED",
                    "Statut non modifiable par courier");
        };
    }
}

