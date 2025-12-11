package fr.ecodeli.service;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.BillableLink;
import fr.ecodeli.entity.BillableLinkType;
import fr.ecodeli.entity.DocumentType;
import fr.ecodeli.entity.Invoice;
import fr.ecodeli.entity.InvoiceLine;
import fr.ecodeli.entity.InvoiceStatus;
import fr.ecodeli.entity.Payment;
import fr.ecodeli.repository.BillableLinkRepository;
import fr.ecodeli.repository.InvoiceLineRepository;
import fr.ecodeli.repository.InvoiceRepository;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.List;

@ApplicationScoped
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceLineRepository lineRepository;
    private final DocumentService documentService;
    private final BillableLinkRepository billableLinkRepository;

    @Inject
    public InvoiceService(InvoiceRepository invoiceRepository,
                          InvoiceLineRepository lineRepository,
                          DocumentService documentService,
                          BillableLinkRepository billableLinkRepository) {
        this.invoiceRepository = invoiceRepository;
        this.lineRepository = lineRepository;
        this.documentService = documentService;
        this.billableLinkRepository = billableLinkRepository;
    }

    public Invoice getRequired(Long id) {
        return invoiceRepository.findByIdOptional(id).orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                "INVOICE_NOT_FOUND",
                "Facture introuvable"));
    }

    public List<Invoice> listForUser(Long userId) {
        return invoiceRepository.listByUser(userId);
    }

    public List<Invoice> listByStatus(InvoiceStatus status) {
        return invoiceRepository.listByStatus(status);
    }

    public List<Invoice> listAll() {
        return invoiceRepository.listAll();
    }

    @Transactional
    public Invoice createFromPayment(Payment payment, AppUser user, List<InvoiceLine> lines) {
        if (invoiceRepository.findByPaymentId(payment.getId()).isPresent()) {
            throw new EcodeliException(Response.Status.CONFLICT,
                    "INVOICE_ALREADY_EXISTS",
                    "Une facture existe déjà pour ce paiement");
        }
        var invoice = new Invoice();
        invoice.setUser(user);
        invoice.setPayment(payment);
        invoice.setInvoiceNo(generateInvoiceNo());
        invoice.setStatus(InvoiceStatus.ISSUED);
        invoice.setIssuedAt(OffsetDateTime.now());
        invoice.setCurrency(payment.getCurrency());
        invoice.setTotalCents(lines.stream().mapToLong(InvoiceLine::getTotalCents).sum());
        invoiceRepository.persist(invoice);
        for (var line : lines) {
            line.setInvoice(invoice);
            lineRepository.persist(line);
        }
        var pdfContent = buildPdfStub(invoice, lines);
        var document = documentService.store(pdfContent,
                invoice.getInvoiceNo() + ".pdf",
                "application/pdf",
                user.getId(),
                DocumentType.INVOICE);
        invoice.setPdfDocumentId(document.getId());
        return invoice;
    }

    private String generateInvoiceNo() {
        return "INV-" + OffsetDateTime.now().toLocalDate() + "-" + System.nanoTime();
    }

    private byte[] buildPdfStub(Invoice invoice, List<InvoiceLine> lines) {
        var builder = new StringBuilder();
        builder.append("Facture ").append(invoice.getInvoiceNo()).append("\n");
        builder.append("Total: ").append(invoice.getTotalCents()).append(" ").append(invoice.getCurrency());
        builder.append("\nLignes:\n");
        for (var line : lines) {
            builder.append(" - ").append(line.getLabel())
                    .append(" x").append(line.getQuantity())
                    .append(" => ").append(line.getTotalCents()).append("\n");
        }
        return builder.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Transactional
    public Invoice createForPayment(Payment payment) {
        var existing = invoiceRepository.findByPaymentId(payment.getId());
        if (existing.isPresent()) {
            return existing.get();
        }
        var links = billableLinkRepository.listByPayment(payment.getId());
        if (links.isEmpty()) {
            throw new EcodeliException(Response.Status.BAD_REQUEST,
                    "INVOICE_NO_ITEMS",
                    "Aucun élément facturable pour ce paiement");
        }
        var lines = links.stream().map(this::toLine).toList();
        return createFromPayment(payment, payment.getPayer(), lines);
    }

    private InvoiceLine toLine(BillableLink link) {
        var line = new InvoiceLine();
        line.setLabel(lineLabel(link));
        line.setQuantity(1);
        line.setUnitPriceCents(link.getPayment().getAmountCents());
        line.setTotalCents(link.getPayment().getAmountCents());
        return line;
    }

    private String lineLabel(BillableLink link) {
        return switch (link.getType()) {
            case DELIVERY -> "Livraison #" + (link.getDelivery() != null ? link.getDelivery().getId() : "");
            case INVOICE -> "Facture liée";
            case MERCHANT_CONTRACT -> "Contrat marchand";
        };
    }
}
