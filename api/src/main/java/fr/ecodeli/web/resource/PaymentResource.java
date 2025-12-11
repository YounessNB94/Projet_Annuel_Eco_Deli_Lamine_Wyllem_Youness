package fr.ecodeli.web.resource;

import fr.ecodeli.service.AppUserService;
import fr.ecodeli.service.PaymentService;
import fr.ecodeli.web.dto.PaymentIntentRequest;
import fr.ecodeli.web.dto.PaymentIntentResponse;
import fr.ecodeli.web.exception.EcodeliException;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/v1/payments")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class PaymentResource {

    private final SecurityIdentity identity;
    private final AppUserService appUserService;
    private final PaymentService paymentService;

    @Inject
    public PaymentResource(SecurityIdentity identity,
                           AppUserService appUserService,
                           PaymentService paymentService) {
        this.identity = identity;
        this.appUserService = appUserService;
        this.paymentService = paymentService;
    }

    private fr.ecodeli.entity.AppUser currentUser() {
        return appUserService.findByEmail(identity.getPrincipal().getName())
                .orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                        "USER_NOT_FOUND",
                        "Utilisateur introuvable"));
    }

    @POST
    @Path("/intents")
    @RolesAllowed({"CLIENT", "MERCHANT"})
    public PaymentIntentResponse createIntent(@Valid PaymentIntentRequest request) {
        return paymentService.createIntent(currentUser(), request);
    }
}

