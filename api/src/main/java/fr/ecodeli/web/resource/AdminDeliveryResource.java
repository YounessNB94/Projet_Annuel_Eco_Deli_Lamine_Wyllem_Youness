package fr.ecodeli.web.resource;

import fr.ecodeli.entity.DeliveryStatus;
import fr.ecodeli.mapper.AdminDashboardMapper;
import fr.ecodeli.mapper.DeliveryMapper;
import fr.ecodeli.service.DeliveryService;
import fr.ecodeli.web.dto.DeliveryDto;
import fr.ecodeli.web.dto.admin.DeliveryAdminDto;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/api/v1/admin/deliveries")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN")
public class AdminDeliveryResource {

    private final DeliveryService deliveryService;
    private final DeliveryMapper mapper;
    private final AdminDashboardMapper adminMapper;

    @Inject
    public AdminDeliveryResource(DeliveryService deliveryService,
                                 DeliveryMapper mapper,
                                 AdminDashboardMapper adminMapper) {
        this.deliveryService = deliveryService;
        this.mapper = mapper;
        this.adminMapper = adminMapper;
    }

    @POST
    @Path("/{deliveryId}/cancel")
    public DeliveryDto forceCancel(@PathParam("deliveryId") Long deliveryId, @Valid String reason) {
        return mapper.toDto(deliveryService.cancel(deliveryId, reason != null ? reason : "Annulé admin"));
    }

    @GET
    public List<DeliveryAdminDto> list(@QueryParam("status") DeliveryStatus status,
                                       @QueryParam("courierId") Long courierId) {
        return deliveryService.listForAdmin(status, courierId).stream()
                .map(adminMapper::toDto)
                .toList();
    }
}
