package fr.ecodeli.web.resource;

import fr.ecodeli.mapper.PayoutMapper;
import fr.ecodeli.service.AppUserService;
import fr.ecodeli.service.DocumentService;
import fr.ecodeli.service.PayoutService;
import fr.ecodeli.web.dto.PayoutDto;
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

@Path("/api/v1/payouts")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("COURIER")
public class PayoutResource {

    private final SecurityIdentity identity;
    private final AppUserService appUserService;
    private final PayoutService payoutService;
    private final PayoutMapper payoutMapper;
    private final DocumentService documentService;

    @Inject
    public PayoutResource(SecurityIdentity identity,
                          AppUserService appUserService,
                          PayoutService payoutService,
                          PayoutMapper payoutMapper,
                          DocumentService documentService) {
        this.identity = identity;
        this.appUserService = appUserService;
        this.payoutService = payoutService;
        this.payoutMapper = payoutMapper;
        this.documentService = documentService;
    }

    private fr.ecodeli.entity.AppUser currentUser() {
        return appUserService.findByEmail(identity.getPrincipal().getName())
                .orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                        "USER_NOT_FOUND",
                        "Utilisateur introuvable"));
    }

    @GET
    public List<PayoutDto> listMine() {
        var user = currentUser();
        return payoutService.listForUser(user.getId()).stream()
                .map(payoutMapper::toDto)
                .toList();
    }

    @GET
    @Path("/{payoutId}")
    public PayoutDto get(@PathParam("payoutId") Long payoutId) {
        var payout = payoutService.getRequired(payoutId);
        ensureOwnership(payout, currentUser());
        return payoutMapper.toDto(payout);
    }

    private void ensureOwnership(fr.ecodeli.entity.Payout payout, fr.ecodeli.entity.AppUser user) {
        if (!payout.getBeneficiary().getId().equals(user.getId())) {
            throw new EcodeliException(Response.Status.FORBIDDEN,
                    "PAYOUT_FORBIDDEN",
                    "Ce virement ne vous appartient pas");
        }
    }
}

