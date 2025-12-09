package fr.ecodeli.web.resource;

import fr.ecodeli.entity.*;
import fr.ecodeli.service.AddressService;
import fr.ecodeli.service.AppUserService;
import fr.ecodeli.service.UserAddressService;
import fr.ecodeli.service.UserProfileService;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;
import java.util.stream.Collectors;

@Path("/api/v1/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class UserResource {

    private final SecurityIdentity identity;
    private final AppUserService appUserService;
    private final UserProfileService userProfileService;
    private final AddressService addressService;
    private final UserAddressService userAddressService;

    @Inject
    public UserResource(SecurityIdentity identity,
                        AppUserService appUserService,
                        UserProfileService userProfileService,
                        AddressService addressService,
                        UserAddressService userAddressService) {
        this.identity = identity;
        this.appUserService = appUserService;
        this.userProfileService = userProfileService;
        this.addressService = addressService;
        this.userAddressService = userAddressService;
    }

    @GET
    @Path("/me")
    public AppUser me() {
        return appUserService.findByEmail(identity.getPrincipal().getName())
                .orElseThrow(NotFoundException::new);
    }

    @GET
    @Path("/me/profile")
    public UserProfile getProfile() {
        return userProfileService.getRequired(me().getId());
    }

    @PATCH
    @Path("/me/profile")
    public UserProfile updateProfile(@Valid UserProfile payload) {
        return userProfileService.saveForUser(me(), payload);
    }

    @GET
    @Path("/me/addresses")
    public List<UserAddress> listAddresses() {
        var user = me();
        return userAddressService.listAll().stream()
                .filter(ua -> ua.getUser().getId().equals(user.getId()))
                .collect(Collectors.toList());
    }

    @POST
    @Path("/me/addresses")
    public UserAddress createAddress(@Valid Address address) {
        var user = me();
        var created = addressService.create(address);
        return userAddressService.linkAddress(user, created, false);
    }

    @PATCH
    @Path("/me/addresses/{addressId}")
    public Address updateAddress(@PathParam("addressId") Long addressId, @Valid Address payload) {
        var user = me();
        userAddressService.ensureOwnership(user, addressId);
        return addressService.update(addressId, payload);
    }

    @DELETE
    @Path("/me/addresses/{addressId}")
    public void deleteAddress(@PathParam("addressId") Long addressId) {
        var user = me();
        userAddressService.ensureOwnership(user, addressId);
        userAddressService.delete(new UserAddressId(user.getId(), addressId));
    }
}
