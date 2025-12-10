package fr.ecodeli.web.resource;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.UserAddressId;
import fr.ecodeli.mapper.*;
import fr.ecodeli.service.*;
import fr.ecodeli.web.dto.AddressDto;
import fr.ecodeli.web.dto.UserAddressDto;
import fr.ecodeli.web.dto.UserDto;
import fr.ecodeli.web.dto.UserProfileDto;
import fr.ecodeli.web.dto.UserDeviceCreateDto;
import fr.ecodeli.web.dto.UserDeviceDto;
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
    private final UserDeviceService userDeviceService;
    private final UserDeviceMapper userDeviceMapper;

    @Inject
    public UserResource(SecurityIdentity identity,
                        AppUserService appUserService,
                        UserProfileService userProfileService,
                        AddressService addressService,
                        UserAddressService userAddressService,
                        UserMapper userMapper,
                        UserProfileMapper userProfileMapper,
                        AddressMapper addressMapper,
                        UserAddressMapper userAddressMapper,
                        UserDeviceService userDeviceService,
                        UserDeviceMapper userDeviceMapper) {
        this.identity = identity;
        this.appUserService = appUserService;
        this.userProfileService = userProfileService;
        this.addressService = addressService;
        this.userAddressService = userAddressService;
        this.userMapper = userMapper;
        this.userProfileMapper = userProfileMapper;
        this.addressMapper = addressMapper;
        this.userAddressMapper = userAddressMapper;
        this.userDeviceService = userDeviceService;
        this.userDeviceMapper = userDeviceMapper;
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

    @PUT
    @Path("/me/addresses/{addressId}/default")
    public UserAddressDto setDefaultAddress(@PathParam("addressId") Long addressId) {
        var user = currentUser();
        var updated = userAddressService.setDefault(user, addressId);
        return userAddressMapper.toDto(updated);
    }

    @DELETE
    @Path("/me/addresses/{addressId}")
    public void deleteAddress(@PathParam("addressId") Long addressId) {
        var user = currentUser();
        userAddressService.deleteForUser(user, addressId);
    }

    @GET
    @Path("/me/devices")
    public List<UserDeviceDto> listDevices() {
        var user = currentUser();
        return userDeviceService.listByUser(user).stream()
                .map(userDeviceMapper::toDto)
                .toList();
    }

    @POST
    @Path("/me/devices")
    public UserDeviceDto registerDevice(@Valid UserDeviceCreateDto payload) {
        var user = currentUser();
        var device = userDeviceService.register(user, userDeviceMapper.toEntity(payload));
        return userDeviceMapper.toDto(device);
    }

    @DELETE
    @Path("/me/devices/{deviceId}")
    public void deleteDevice(@PathParam("deviceId") Long deviceId) {
        var user = currentUser();
        userDeviceService.delete(user, deviceId);
    }
}
