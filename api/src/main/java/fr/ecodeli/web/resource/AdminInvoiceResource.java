package fr.ecodeli.web.resource;

import fr.ecodeli.entity.InvoiceStatus;
import fr.ecodeli.mapper.AdminDashboardMapper;
import fr.ecodeli.service.InvoiceService;
import fr.ecodeli.web.dto.admin.InvoiceAdminDto;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.time.YearMonth;
import java.util.List;

@Path("/api/v1/admin/invoices")
@RolesAllowed("ADMIN")
public class AdminInvoiceResource {

    private final InvoiceService invoiceService;
    private final AdminDashboardMapper mapper;

    @Inject
    public AdminInvoiceResource(InvoiceService invoiceService,
                                AdminDashboardMapper mapper) {
        this.invoiceService = invoiceService;
        this.mapper = mapper;
    }

    @GET
    @jakarta.ws.rs.Produces(MediaType.APPLICATION_JSON)
    public List<InvoiceAdminDto> list(@QueryParam("status") InvoiceStatus status,
                                      @QueryParam("period") String period) {
        var ym = period != null ? YearMonth.parse(period) : null;
        return invoiceService.listForAdmin(status, ym).stream()
                .map(mapper::toDto)
                .toList();
    }
}
