package fr.ecodeli.web.resource;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.UserAddressId;
import fr.ecodeli.mapper.AddressMapper;
import fr.ecodeli.mapper.UserAddressMapper;
import fr.ecodeli.mapper.UserMapper;
import fr.ecodeli.mapper.UserProfileMapper;
import fr.ecodeli.service.AddressService;
import fr.ecodeli.service.AppUserService;
import fr.ecodeli.service.UserAddressService;
import fr.ecodeli.service.UserProfileService;
import fr.ecodeli.web.dto.AddressDto;
import fr.ecodeli.web.dto.UserAddressDto;
import fr.ecodeli.web.dto.UserDto;
import fr.ecodeli.web.dto.UserProfileDto;
import fr.ecodeli.web.exception.EcodeliException;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

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
    private final UserMapper userMapper;
    private final UserProfileMapper userProfileMapper;
    private final AddressMapper addressMapper;
    private final UserAddressMapper userAddressMapper;

    @Inject
    public UserResource(SecurityIdentity identity,
                        AppUserService appUserService,
                        UserProfileService userProfileService,
                        AddressService addressService,
                        UserAddressService userAddressService,
                        UserMapper userMapper,
                        UserProfileMapper userProfileMapper,
                        AddressMapper addressMapper,
                        UserAddressMapper userAddressMapper) {
        this.identity = identity;
        this.appUserService = appUserService;
        this.userProfileService = userProfileService;
        this.addressService = addressService;
        this.userAddressService = userAddressService;
        this.userMapper = userMapper;
        this.userProfileMapper = userProfileMapper;
        this.addressMapper = addressMapper;
        this.userAddressMapper = userAddressMapper;
    }

    private AppUser currentUser() {
        return appUserService.findByEmail(identity.getPrincipal().getName())
                .orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                        "USER_NOT_FOUND",
                        "Utilisateur introuvable"));
    }

    @GET
    @Path("/me")
    public UserDto me() {
        return userMapper.toDto(currentUser());
    }

    @GET
    @Path("/me/profile")
    public UserProfileDto getProfile() {
        return userProfileMapper.toDto(userProfileService.getRequired(currentUser().getId()));
    }

    @PATCH
    @Path("/me/profile")
    public UserProfileDto updateProfile(@Valid UserProfileDto payload) {
        var saved = userProfileService.saveForUser(currentUser(), userProfileMapper.toEntity(payload));
        return userProfileMapper.toDto(saved);
    }

    @GET
    @Path("/me/addresses")
    public List<UserAddressDto> listAddresses() {
        var user = currentUser();
        return userAddressService.listByUserId(user.getId()).stream()
                .map(userAddressMapper::toDto)
                .toList();
    }

    @POST
    @Path("/me/addresses")
    public UserAddressDto createAddress(@Valid AddressDto addressDto) {
        var user = currentUser();
        var created = addressService.create(addressMapper.toEntity(addressDto));
        return userAddressMapper.toDto(userAddressService.linkAddress(user, created, false));
    }

    @PATCH
    @Path("/me/addresses/{addressId}")
    public AddressDto updateAddress(@PathParam("addressId") Long addressId, @Valid AddressDto payload) {
        var user = currentUser();
        userAddressService.ensureOwnership(user, addressId);
        var updated = addressService.update(addressId, addressMapper.toEntity(payload));
        return addressMapper.toDto(updated);
    }

    @DELETE
    @Path("/me/addresses/{addressId}")
    public void deleteAddress(@PathParam("addressId") Long addressId) {
        var user = currentUser();
        userAddressService.ensureOwnership(user, addressId);
        userAddressService.delete(new UserAddressId(user.getId(), addressId));
    }
}
