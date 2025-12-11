package fr.ecodeli.web.resource;

import fr.ecodeli.entity.InvoiceStatus;
import fr.ecodeli.mapper.InvoiceMapper;
import fr.ecodeli.service.InvoiceService;
import fr.ecodeli.web.dto.InvoiceDto;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/api/v1/admin/invoices")
@RolesAllowed("ADMIN")
public class AdminInvoiceResource {

    private final InvoiceService invoiceService;
    private final InvoiceMapper invoiceMapper;

    @Inject
    public AdminInvoiceResource(InvoiceService invoiceService,
                                InvoiceMapper invoiceMapper) {
        this.invoiceService = invoiceService;
        this.invoiceMapper = invoiceMapper;
    }

    @GET
    @jakarta.ws.rs.Produces(MediaType.APPLICATION_JSON)
    public List<InvoiceDto> list(@QueryParam("status") InvoiceStatus status) {
        var invoices = status != null ? invoiceService.listByStatus(status) : invoiceService.listAll();
        return invoices.stream().map(invoiceMapper::toDto).toList();
    }
}

