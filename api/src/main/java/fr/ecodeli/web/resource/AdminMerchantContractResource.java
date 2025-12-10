package fr.ecodeli.web.resource;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.mapper.MerchantMapper;
import fr.ecodeli.service.AppUserService;
import fr.ecodeli.service.MerchantContractService;
import fr.ecodeli.web.dto.MerchantContractDto;
import fr.ecodeli.web.exception.EcodeliException;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/v1/admin/merchant-contracts")
@RolesAllowed("ADMIN")
@Produces(MediaType.APPLICATION_JSON)
public class AdminMerchantContractResource {

    private final SecurityIdentity identity;
    private final AppUserService appUserService;
    private final MerchantContractService contractService;
    private final MerchantMapper merchantMapper;

    @Inject
    public AdminMerchantContractResource(SecurityIdentity identity,
                                         AppUserService appUserService,
                                         MerchantContractService contractService,
                                         MerchantMapper merchantMapper) {
        this.identity = identity;
        this.appUserService = appUserService;
        this.contractService = contractService;
        this.merchantMapper = merchantMapper;
    }

    private AppUser currentAdmin() {
        return appUserService.findByEmail(identity.getPrincipal().getName())
                .orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                        "USER_NOT_FOUND",
                        "Administrateur introuvable"));
    }

    @POST
    @Path("/{contractId}/approve")
    public MerchantContractDto approve(@PathParam("contractId") Long contractId) {
        var admin = currentAdmin();
        var contract = contractService.getRequired(contractId);
        var approved = contractService.countersignByAdmin(contract, admin);
        return merchantMapper.toDto(approved);
    }
}
