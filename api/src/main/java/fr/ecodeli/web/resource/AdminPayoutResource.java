package fr.ecodeli.web.resource;

import fr.ecodeli.entity.PayoutStatus;
import fr.ecodeli.mapper.PayoutMapper;
import fr.ecodeli.service.AppUserService;
import fr.ecodeli.service.PayoutGenerationService;
import fr.ecodeli.service.PayoutService;
import fr.ecodeli.web.dto.PayoutDto;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.YearMonth;
import java.util.List;

@Path("/api/v1/admin/payouts")
@RolesAllowed("ADMIN")
public class AdminPayoutResource {

    private final PayoutService payoutService;
    private final PayoutGenerationService payoutGenerationService;
    private final AppUserService appUserService;
    private final PayoutMapper payoutMapper;

    @Inject
    public AdminPayoutResource(PayoutService payoutService,
                               PayoutGenerationService payoutGenerationService,
                               AppUserService appUserService,
                               PayoutMapper payoutMapper) {
        this.payoutService = payoutService;
        this.payoutGenerationService = payoutGenerationService;
        this.appUserService = appUserService;
        this.payoutMapper = payoutMapper;
    }

    @GET
    @jakarta.ws.rs.Produces(MediaType.APPLICATION_JSON)
    public List<PayoutDto> list(@QueryParam("status") PayoutStatus status,
                                @QueryParam("period") String period) {
        if (period != null) {
            var yearMonth = YearMonth.parse(period);
            return payoutService.listByPeriod(yearMonth).stream().map(payoutMapper::toDto).toList();
        }
        if (status != null) {
            return payoutService.listByStatus(status).stream().map(payoutMapper::toDto).toList();
        }
        return payoutService.listAll().stream().map(payoutMapper::toDto).toList();
    }

    @POST
    @jakarta.ws.rs.Produces(MediaType.APPLICATION_JSON)
    public PayoutDto generate(@QueryParam("courierId") Long courierId,
                              @NotBlank @QueryParam("period") String period) {
        var courier = appUserService.getRequiredById(courierId);
        var payout = payoutGenerationService.generateForCourier(courier, YearMonth.parse(period));
        return payoutMapper.toDto(payout);
    }
}
