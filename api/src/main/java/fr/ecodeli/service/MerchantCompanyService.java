package fr.ecodeli.service;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.MerchantCompany;
import fr.ecodeli.repository.MerchantCompanyRepository;
import fr.ecodeli.web.dto.MerchantCompanyUpdateDto;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.util.Optional;

@ApplicationScoped
public class MerchantCompanyService {

    private final MerchantCompanyRepository repository;

    @Inject
    public MerchantCompanyService(MerchantCompanyRepository repository) {
        this.repository = repository;
    }

    public Optional<MerchantCompany> findByMerchant(Long merchantUserId) {
        return repository.find("merchant.id", merchantUserId).firstResultOptional();
    }

    public MerchantCompany getRequired(Long companyId) {
        return repository.findByIdOptional(companyId).orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                "MERCHANT_COMPANY_NOT_FOUND",
                "Entreprise marchande introuvable"));
    }

    public MerchantCompany getRequiredForMerchant(Long merchantUserId) {
        return findByMerchant(merchantUserId).orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                "MERCHANT_COMPANY_NOT_FOUND",
                "Aucune entreprise n'est associée à ce marchand"));
    }

    public MerchantCompany requireOwnership(Long companyId, Long merchantUserId) {
        return repository.find("id = ?1 and merchant.id = ?2", companyId, merchantUserId)
                .firstResultOptional()
                .orElseThrow(() -> new EcodeliException(Response.Status.FORBIDDEN,
                        "MERCHANT_COMPANY_FORBIDDEN",
                        "Entreprise non accessible"));
    }

    @Transactional
    public MerchantCompany createOrUpdate(AppUser merchant, MerchantCompanyUpdateDto payload) {
        var existing = findByMerchant(merchant.getId());
        MerchantCompany entity;
        if (existing.isEmpty()) {
            ensureSiretAvailable(payload.siret(), null);
            entity = new MerchantCompany();
            entity.setMerchant(merchant);
            repository.persist(entity);
        } else {
            entity = existing.get();
            ensureSiretAvailable(payload.siret(), entity.getId());
        }
        entity.setName(payload.name());
        entity.setSiret(payload.siret());
        entity.setVatNumber(payload.vatNumber());
        entity.setBillingEmail(payload.billingEmail());
        return entity;
    }

    private void ensureSiretAvailable(String siret, Long currentCompanyId) {
        repository.find("siret", siret)
                .firstResultOptional()
                .filter(found -> currentCompanyId == null || !found.getId().equals(currentCompanyId))
                .ifPresent(conflict -> {
                    throw new EcodeliException(Response.Status.CONFLICT,
                            "MERCHANT_COMPANY_SIRET_CONFLICT",
                            "Un autre marchand utilise déjà ce SIRET");
                });
    }
}

