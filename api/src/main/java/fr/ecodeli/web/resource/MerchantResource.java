package fr.ecodeli.web.resource;

import fr.ecodeli.mapper.MerchantMapper;
import fr.ecodeli.service.AppUserService;
import fr.ecodeli.service.MerchantCompanyService;
import fr.ecodeli.service.MerchantContractService;
import fr.ecodeli.web.dto.MerchantCompanyDto;
import fr.ecodeli.web.dto.MerchantCompanyUpdateDto;
import fr.ecodeli.web.dto.MerchantContractDraftDto;
import fr.ecodeli.web.dto.MerchantContractDto;
import fr.ecodeli.web.dto.MerchantContractSignDto;
import fr.ecodeli.web.exception.EcodeliException;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/v1/merchants/me")
@RolesAllowed("MERCHANT")
@Produces(MediaType.APPLICATION_JSON)
public class MerchantResource {

    private final SecurityIdentity identity;
    private final AppUserService appUserService;
    private final MerchantCompanyService companyService;
    private final MerchantContractService contractService;
    private final MerchantMapper merchantMapper;

    @Inject
    public MerchantResource(SecurityIdentity identity,
                            AppUserService appUserService,
                            MerchantCompanyService companyService,
                            MerchantContractService contractService,
                            MerchantMapper merchantMapper) {
        this.identity = identity;
        this.appUserService = appUserService;
        this.companyService = companyService;
        this.contractService = contractService;
        this.merchantMapper = merchantMapper;
    }

    private fr.ecodeli.entity.AppUser currentUser() {
        return appUserService.findByEmail(identity.getPrincipal().getName())
                .orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                        "USER_NOT_FOUND",
                        "Utilisateur introuvable"));
    }

    @GET
    @Path("/company")
    public MerchantCompanyDto getCompany() {
        var user = currentUser();
        var company = companyService.getRequiredForMerchant(user.getId());
        return merchantMapper.toDto(company);
    }

    @PATCH
    @Path("/company")
    @Consumes(MediaType.APPLICATION_JSON)
    public MerchantCompanyDto updateCompany(@Valid MerchantCompanyUpdateDto payload) {
        var user = currentUser();
        var entity = companyService.createOrUpdate(user, payload);
        return merchantMapper.toDto(entity);
    }

    @GET
    @Path("/contracts")
    public List<MerchantContractDto> listContracts() {
        var user = currentUser();
        var company = companyService.getRequiredForMerchant(user.getId());
        return contractService.listForCompany(company.getId()).stream()
                .map(merchantMapper::toDto)
                .toList();
    }

    @POST
    @Path("/contracts")
    @Consumes(MediaType.APPLICATION_JSON)
    public MerchantContractDto createContract(@Valid MerchantContractDraftDto payload) {
        var user = currentUser();
        var company = companyService.getRequiredForMerchant(user.getId());
        var contract = contractService.createDraft(company, payload, user);
        return merchantMapper.toDto(contract);
    }

    @POST
    @Path("/contracts/{contractId}/sign")
    @Consumes(MediaType.APPLICATION_JSON)
    public MerchantContractDto signContract(@PathParam("contractId") Long contractId,
                                            @Valid MerchantContractSignDto payload) {
        var user = currentUser();
        var contract = contractService.requireOwnership(contractId, user.getId());
        var signed = contractService.signByMerchant(contract, payload, user);
        return merchantMapper.toDto(signed);
    }
}
