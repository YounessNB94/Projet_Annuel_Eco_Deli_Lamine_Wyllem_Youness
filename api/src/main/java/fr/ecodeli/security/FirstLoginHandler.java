package fr.ecodeli.security;

import fr.ecodeli.entity.AppUser;
import fr.ecodeli.entity.AppUserStatus;
import fr.ecodeli.entity.UserProfile;
import fr.ecodeli.service.AppUserService;
import fr.ecodeli.service.UserProfileService;
import io.quarkus.oidc.runtime.OidcJwtCallerPrincipal;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;

import java.util.Locale;

@ApplicationScoped
public class FirstLoginHandler {

    private static final Logger LOG = Logger.getLogger(FirstLoginHandler.class);

    private final AppUserService appUserService;
    private final UserProfileService userProfileService;

    @Inject
    public FirstLoginHandler(AppUserService appUserService, UserProfileService userProfileService) {
        this.appUserService = appUserService;
        this.userProfileService = userProfileService;
    }

    @Transactional
    public void ensureUserExists(SecurityIdentity identity) {
        if (identity == null || identity.isAnonymous()) {
            return;
        }
        var keycloakId = attribute(identity, "sub");
        if (keycloakId == null || keycloakId.isBlank()) {
            LOG.debug("Security identity missing subject; skipping first-login provisioning");
            return;
        }
        if (appUserService.findByKeycloakUserId(keycloakId).isPresent()) {
            return;
        }
        var email = attribute(identity, "email");
        if (email == null || email.isBlank()) {
            email = identity.getPrincipal() != null ? identity.getPrincipal().getName() : null;
        }
        if (email == null || email.isBlank()) {
            LOG.warnf("Cannot provision user %s because no email claim is present", keycloakId);
            return;
        }
        var phone = attribute(identity, "phone_number");
        var status = parseStatus(attribute(identity, "account_status"));

        var user = AppUser.builder()
                .keycloakUserId(keycloakId)
                .email(email.toLowerCase(Locale.ROOT))
                .phone(phone)
                .status(status)
                .build();
        var created = appUserService.create(user);
        createProfileIfNeeded(created, attribute(identity, "given_name"), attribute(identity, "family_name"));
        LOG.infof("Provisioned AppUser %s (%s) from Keycloak token", user.getEmail(), keycloakId);
    }

    private void createProfileIfNeeded(AppUser user, String firstName, String lastName) {
        if ((firstName == null || firstName.isBlank()) && (lastName == null || lastName.isBlank())) {
            return;
        }
        var profile = new UserProfile();
        profile.setUserId(user.getId());
        profile.setUser(user);
        profile.setFirstName(firstName);
        profile.setLastName(lastName);
        userProfileService.create(profile);
    }

    private AppUserStatus parseStatus(String name) {
        if (name == null || name.isBlank()) {
            return AppUserStatus.ACTIVE;
        }
        try {
            return AppUserStatus.valueOf(name.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ignored) {
            return AppUserStatus.ACTIVE;
        }
    }

    private String attribute(SecurityIdentity identity, String name) {
        var value = identity.<String>getAttribute(name);
        if (value != null && !value.isBlank()) {
            return value;
        }
        var principal = identity.getPrincipal();
        if (principal instanceof OidcJwtCallerPrincipal oidcPrincipal) {
            var claim = oidcPrincipal.getClaim(name);
            if (claim != null) {
                return claim.toString();
            }
        }
        return null;
    }
}
