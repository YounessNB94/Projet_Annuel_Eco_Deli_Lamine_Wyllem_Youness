package fr.ecodeli.web.resource;

import fr.ecodeli.entity.AnnouncementStatus;
import fr.ecodeli.entity.AnnouncementType;
import fr.ecodeli.mapper.AdminDashboardMapper;
import fr.ecodeli.service.AnnouncementService;
import fr.ecodeli.web.dto.admin.AnnouncementAdminDto;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/api/v1/admin/announcements")
@RolesAllowed("ADMIN")
public class AdminAnnouncementResource {

    private final AnnouncementService announcementService;
    private final AdminDashboardMapper mapper;

    @Inject
    public AdminAnnouncementResource(AnnouncementService announcementService,
                                     AdminDashboardMapper mapper) {
        this.announcementService = announcementService;
        this.mapper = mapper;
    }

    @GET
    @jakarta.ws.rs.Produces(MediaType.APPLICATION_JSON)
    public List<AnnouncementAdminDto> list(@QueryParam("status") AnnouncementStatus status,
                                           @QueryParam("type") AnnouncementType type,
                                           @QueryParam("merchantCompanyId") Long merchantCompanyId) {
        return announcementService.listAllForAdmin(status, type, merchantCompanyId).stream()
                .map(mapper::toDto)
                .toList();
    }
}

