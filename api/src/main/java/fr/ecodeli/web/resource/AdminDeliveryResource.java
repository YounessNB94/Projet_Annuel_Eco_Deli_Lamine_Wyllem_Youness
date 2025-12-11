package fr.ecodeli.web.resource;

import fr.ecodeli.entity.DeliveryStatus;
import fr.ecodeli.mapper.DeliveryMapper;
import fr.ecodeli.service.DeliveryService;
import fr.ecodeli.web.dto.DeliveryDto;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/api/v1/admin/deliveries")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN")
public class AdminDeliveryResource {

    private final DeliveryService deliveryService;
    private final DeliveryMapper mapper;

    @Inject
    public AdminDeliveryResource(DeliveryService deliveryService,
                                 DeliveryMapper mapper) {
        this.deliveryService = deliveryService;
        this.mapper = mapper;
    }

    @GET
    public List<DeliveryDto> listAll() {
        return deliveryService.listByStatus(DeliveryStatus.ASSIGNED, 100).stream()
                .map(mapper::toDto)
                .toList();
    }

    @POST
    @Path("/{deliveryId}/cancel")
    public DeliveryDto forceCancel(@PathParam("deliveryId") Long deliveryId, @Valid String reason) {
        return mapper.toDto(deliveryService.cancel(deliveryId, reason != null ? reason : "Annulé admin"));
    }
}
