package fr.ecodeli.web.exception;

import fr.ecodeli.web.dto.ErrorResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.Map;
import java.util.stream.Collectors;

@Provider
public class ConstraintViolationExceptionMapper implements ExceptionMapper<ConstraintViolationException> {

    @Override
    public Response toResponse(ConstraintViolationException exception) {
        var violations = exception.getConstraintViolations().stream()
                .collect(Collectors.groupingBy(this::propertyPath,
                        Collectors.mapping(ConstraintViolation::getMessage, Collectors.toList())));

        var payload = ErrorResponse.builder()
                .code("VALIDATION_ERROR")
                .message("Payload validation failed")
                .details(Map.of("violations", violations))
                .build();

        return Response.status(Response.Status.BAD_REQUEST)
                .entity(payload)
                .type(MediaType.APPLICATION_JSON_TYPE)
                .build();
    }

    private String propertyPath(ConstraintViolation<?> violation) {
        return violation.getPropertyPath() == null ? "" : violation.getPropertyPath().toString();
    }
}
