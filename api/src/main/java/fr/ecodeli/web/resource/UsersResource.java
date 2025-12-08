package fr.ecodeli.web.resource;

import io.quarkus.oidc.UserInfo;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("users")
public class UsersResource {

    @Inject
    SecurityIdentity identity;

//    @Inject
//    UserInfo userInfo;

    @GET
    @Path("/me")
    @Authenticated
    public Response me() {
        return Response.ok(identity.getPrincipal()).build();
    }

    @GET
    @Path("/courier")
    @RolesAllowed("COURIER")
    public Response courierAccess() {
        return Response.ok("Hello, Courier!").type(MediaType.TEXT_PLAIN).build();
    }

    @GET
    @Path("/merchant")
    @RolesAllowed("MERCHANT")
    public Response merchantAccess() {
        return Response.ok("Hello, Merchant!").type(MediaType.TEXT_PLAIN).build();
    }

    @GET
    @Path("/admin")
    @RolesAllowed("ADMIN")
    public Response adminAccess() {
        return Response.ok("Hello, Admin!").type(MediaType.TEXT_PLAIN).build();
    }

}
