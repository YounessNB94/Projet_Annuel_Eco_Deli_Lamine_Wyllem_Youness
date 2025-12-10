package fr.ecodeli.service;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.MerchantCompany;
import fr.ecodeli.entity.MerchantContract;
import fr.ecodeli.entity.MerchantContractStatus;
import fr.ecodeli.repository.MerchantContractRepository;
import fr.ecodeli.web.dto.MerchantContractDraftDto;
import fr.ecodeli.web.dto.MerchantContractSignDto;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.util.List;

@ApplicationScoped
public class MerchantContractService {

    private final MerchantContractRepository repository;
    private final DocumentService documentService;

    @Inject
    public MerchantContractService(MerchantContractRepository repository,
                                   DocumentService documentService) {
        this.repository = repository;
        this.documentService = documentService;
    }

    public List<MerchantContract> listForCompany(Long companyId) {
        return repository.list("company.id", companyId);
    }

    public MerchantContract getRequired(Long contractId) {
        return repository.findByIdOptional(contractId).orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                "MERCHANT_CONTRACT_NOT_FOUND",
                "Contrat marchand introuvable"));
    }

    public MerchantContract requireOwnership(Long contractId, Long merchantUserId) {
        return repository.find("id = ?1 and company.merchant.id = ?2", contractId, merchantUserId)
                .firstResultOptional()
                .orElseThrow(() -> new EcodeliException(Response.Status.FORBIDDEN,
                        "MERCHANT_CONTRACT_FORBIDDEN",
                        "Contrat inaccessible pour ce marchand"));
    }

    @Transactional
    public MerchantContract createDraft(MerchantCompany company, MerchantContractDraftDto payload, AppUser merchant) {
        documentService.requireAccess(payload.termsPdfDocumentId(), merchant.getId());
        var contract = new MerchantContract();
        contract.setCompany(company);
        contract.setStatus(MerchantContractStatus.PENDING_SIGNATURE);
        contract.setStartDate(payload.startDate());
        contract.setEndDate(payload.endDate());
        contract.setTermsPdfDocumentId(payload.termsPdfDocumentId());
        repository.persist(contract);
        return contract;
    }

    @Transactional
    public MerchantContract signByMerchant(MerchantContract contract, MerchantContractSignDto payload, AppUser merchant) {
        ensureStatus(contract, MerchantContractStatus.PENDING_SIGNATURE);
        if (!contract.getCompany().getMerchant().getId().equals(merchant.getId())) {
            throw new EcodeliException(Response.Status.FORBIDDEN,
                    "MERCHANT_CONTRACT_FORBIDDEN",
                    "Contrat inaccessible pour ce marchand");
        }
        contract.setStatus(MerchantContractStatus.AWAITING_COUNTERSIGN);
        contract.setSignedAt(OffsetDateTime.now());
        contract.setSignedByUserId(merchant.getId());
        return contract;
    }

    @Transactional
    public MerchantContract countersignByAdmin(MerchantContract contract, AppUser admin) {
        ensureStatus(contract, MerchantContractStatus.AWAITING_COUNTERSIGN);
        contract.setStatus(MerchantContractStatus.APPROVED);
        contract.setCountersignedAt(OffsetDateTime.now());
        contract.setCountersignedByAdminId(admin.getId());
        return contract;
    }

    private void ensureStatus(MerchantContract contract, MerchantContractStatus expected) {
        if (contract.getStatus() != expected) {
            throw new EcodeliException(Response.Status.CONFLICT,
                    "MERCHANT_CONTRACT_INVALID_STATUS",
                    "Statut du contrat incompatible avec l'action demandée",
                    contract.getStatus());
        }
    }
}

