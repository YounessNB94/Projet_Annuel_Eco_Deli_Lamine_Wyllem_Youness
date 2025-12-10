package fr.ecodeli.web.exception;

import jakarta.ws.rs.core.Response;
import lombok.Getter;

@Getter
public class EcodeliException extends RuntimeException {

    private final Response.StatusType status;
    private final String code;
    private final Object details;

    public EcodeliException(Response.StatusType status, String code, String message) {
        this(status, code, message, null, null);
    }

    public EcodeliException(Response.StatusType status, String code, String message, Object details) {
        this(status, code, message, details, null);
    }

    public EcodeliException(Response.StatusType status, String code, String message, Object details, Throwable cause) {
        super(message, cause);
        this.status = status == null ? Response.Status.BAD_REQUEST : status;
        this.code = code;
        this.details = details;
    }
}

