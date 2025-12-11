package fr.ecodeli.web.resource;

import fr.ecodeli.entity.PaymentStatus;
import fr.ecodeli.mapper.AdminDashboardMapper;
import fr.ecodeli.service.PaymentService;
import fr.ecodeli.web.dto.admin.PaymentAdminDto;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/api/v1/admin/payments")
@RolesAllowed("ADMIN")
public class AdminPaymentResource {

    private final PaymentService paymentService;
    private final AdminDashboardMapper mapper;

    @Inject
    public AdminPaymentResource(PaymentService paymentService,
                                AdminDashboardMapper mapper) {
        this.paymentService = paymentService;
        this.mapper = mapper;
    }

    @GET
    @jakarta.ws.rs.Produces(MediaType.APPLICATION_JSON)
    public List<PaymentAdminDto> list(@QueryParam("status") PaymentStatus status,
                                      @QueryParam("payerId") Long payerId) {
        return paymentService.listForAdmin(status, payerId).stream()
                .map(mapper::toDto)
                .toList();
    }
}

