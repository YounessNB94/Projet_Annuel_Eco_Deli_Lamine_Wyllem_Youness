package fr.ecodeli.web.resource;

import fr.ecodeli.entity.CourierProfileStatus;
import fr.ecodeli.mapper.CourierAdminMapper;
import fr.ecodeli.service.CourierProfileService;
import fr.ecodeli.web.dto.admin.CourierAdminDto;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/api/v1/admin/couriers")
@RolesAllowed("ADMIN")
public class AdminCourierResource {

    private final CourierProfileService courierProfileService;
    private final CourierAdminMapper mapper;

    @Inject
    public AdminCourierResource(CourierProfileService courierProfileService,
                                CourierAdminMapper mapper) {
        this.courierProfileService = courierProfileService;
        this.mapper = mapper;
    }

    @GET
    @jakarta.ws.rs.Produces(MediaType.APPLICATION_JSON)
    public List<CourierAdminDto> list(@QueryParam("status") CourierProfileStatus status,
                                      @QueryParam("hasDocuments") Boolean hasDocuments,
                                      @QueryParam("search") String search) {
        return courierProfileService.search(status, hasDocuments, search).stream()
                .map(mapper::toDto)
                .toList();
    }

    @GET
    @Path("/{courierId}")
    @jakarta.ws.rs.Produces(MediaType.APPLICATION_JSON)
    public CourierAdminDto get(@PathParam("courierId") Long courierId) {
        return mapper.toDto(courierProfileService.getWithUser(courierId));
    }
}

