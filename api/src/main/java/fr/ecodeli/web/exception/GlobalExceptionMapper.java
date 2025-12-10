package fr.ecodeli.web.exception;

import fr.ecodeli.web.dto.ErrorResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.jboss.logging.Logger;

@Provider
@ApplicationScoped
public class GlobalExceptionMapper implements ExceptionMapper<Throwable> {

    private static final Logger LOG = Logger.getLogger(GlobalExceptionMapper.class);

    @Override
    public Response toResponse(Throwable exception) {
        if (exception instanceof EcodeliException business) {
            return buildResponse(business.getStatus().getStatusCode(), business.getCode(), business.getMessage(), business.getDetails());
        }
        if (exception instanceof NotFoundException notFound) {
            return buildResponse(Response.Status.NOT_FOUND.getStatusCode(), "RESOURCE_NOT_FOUND", safeMessage(notFound, "Resource not found"), null);
        }
        if (exception instanceof BadRequestException badRequest) {
            return buildResponse(Response.Status.BAD_REQUEST.getStatusCode(), "BAD_REQUEST", safeMessage(badRequest, "Bad request"), null);
        }
        if (exception instanceof WebApplicationException webEx) {
            var status = webEx.getResponse() != null ? webEx.getResponse().getStatus() : Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
            var message = safeMessage(webEx, "HTTP error");
            return buildResponse(status, "HTTP_ERROR", message, null);
        }
        LOG.error("Unhandled exception", exception);
        return buildResponse(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), "INTERNAL_ERROR", "Une erreur inattendue est survenue", null);
    }

    private Response buildResponse(int status, String code, String message, Object details) {
        var payload = ErrorResponse.builder()
                .code(code)
                .message(message)
                .details(details)
                .build();

        return Response.status(status)
                .type(MediaType.APPLICATION_JSON)
                .entity(payload)
                .build();
    }

    private String safeMessage(Throwable throwable, String fallback) {
        return throwable.getMessage() == null || throwable.getMessage().isBlank() ? fallback : throwable.getMessage();
    }
}
