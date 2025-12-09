package fr.ecodeli.security;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.ext.Provider;

@Provider
@Priority(Priorities.AUTHORIZATION - 10)
@ApplicationScoped
public class FirstLoginFilter implements ContainerRequestFilter {

    private final SecurityIdentity identity;
    private final FirstLoginHandler handler;

    @Inject
    public FirstLoginFilter(SecurityIdentity identity, FirstLoginHandler handler) {
        this.identity = identity;
        this.handler = handler;
    }

    @Override
    public void filter(ContainerRequestContext requestContext) {
        handler.ensureUserExists(identity);
    }
}

