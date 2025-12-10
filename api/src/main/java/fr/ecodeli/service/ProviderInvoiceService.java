package fr.ecodeli.service;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.ProviderInvoice;
import fr.ecodeli.repository.ProviderInvoiceRepository;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@ApplicationScoped
public class ProviderInvoiceService {

    private final ProviderInvoiceRepository repository;

    @Inject
    public ProviderInvoiceService(ProviderInvoiceRepository repository) {
        this.repository = repository;
    }

    public List<ProviderInvoice> listForUser(Long userId) {
        return repository.list("provider.id", userId);
    }

    public ProviderInvoice getForUser(AppUser user, Long invoiceId) {
        var invoice = repository.findByIdOptional(invoiceId).orElseThrow(() -> new EcodeliException(jakarta.ws.rs.core.Response.Status.NOT_FOUND,
                "PROVIDER_INVOICE_NOT_FOUND",
                "Facture introuvable"));
        if (!invoice.getProvider().getId().equals(user.getId())) {
            throw new EcodeliException(jakarta.ws.rs.core.Response.Status.FORBIDDEN,
                    "PROVIDER_INVOICE_FORBIDDEN",
                    "Facture non accessible");
        }
        return invoice;
    }
}

