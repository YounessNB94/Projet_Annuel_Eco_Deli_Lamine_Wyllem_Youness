package fr.ecodeli.web.resource;

import fr.ecodeli.mapper.InvoiceMapper;
import fr.ecodeli.service.AppUserService;
import fr.ecodeli.service.InvoiceService;
import fr.ecodeli.service.DocumentService;
import fr.ecodeli.web.dto.InvoiceDto;
import fr.ecodeli.web.exception.EcodeliException;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/v1/invoices")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class InvoiceResource {

    private final SecurityIdentity identity;
    private final AppUserService appUserService;
    private final InvoiceService invoiceService;
    private final InvoiceMapper invoiceMapper;
    private final DocumentService documentService;

    @Inject
    public InvoiceResource(SecurityIdentity identity,
                           AppUserService appUserService,
                           InvoiceService invoiceService,
                           InvoiceMapper invoiceMapper,
                           DocumentService documentService) {
        this.identity = identity;
        this.appUserService = appUserService;
        this.invoiceService = invoiceService;
        this.invoiceMapper = invoiceMapper;
        this.documentService = documentService;
    }

    private fr.ecodeli.entity.AppUser currentUser() {
        return appUserService.findByEmail(identity.getPrincipal().getName())
                .orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                        "USER_NOT_FOUND",
                        "Utilisateur introuvable"));
    }

    @GET
    public List<InvoiceDto> listMine() {
        var user = currentUser();
        return invoiceService.listForUser(user.getId()).stream()
                .map(invoiceMapper::toDto)
                .toList();
    }

    @GET
    @Path("/{invoiceId}")
    public InvoiceDto get(@PathParam("invoiceId") Long invoiceId) {
        var invoice = invoiceService.getRequired(invoiceId);
        ensureOwnership(invoice, currentUser());
        return invoiceMapper.toDto(invoice);
    }

    @GET
    @Path("/{invoiceId}/download")
    public Response download(@PathParam("invoiceId") Long invoiceId) {
        var invoice = invoiceService.getRequired(invoiceId);
        ensureOwnership(invoice, currentUser());
        if (invoice.getPdfDocumentId() == null) {
            throw new EcodeliException(Response.Status.NOT_FOUND,
                    "INVOICE_PDF_MISSING",
                    "Facture sans PDF associé");
        }
        var download = documentService.openDownload(invoice.getPdfDocumentId(), invoice.getUser().getId());
        return Response.ok(download.stream())
                .type(download.document().getMimeType())
                .header("Content-Disposition", "attachment; filename=" + download.document().getFileName())
                .build();
    }

    private void ensureOwnership(fr.ecodeli.entity.Invoice invoice, fr.ecodeli.entity.AppUser user) {
        if (!invoice.getUser().getId().equals(user.getId())) {
            throw new EcodeliException(Response.Status.FORBIDDEN,
                    "INVOICE_FORBIDDEN",
                    "Facture inaccessible");
        }
    }
}

