import { UserManager } from 'oidc-client-ts';

const keycloakBaseUrl = import.meta.env.VITE_KEYCLOAK_URL ?? 'http://localhost:8081';
const realm = import.meta.env.VITE_KEYCLOAK_REALM ?? 'ecodeli';
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'ecodeli';

const authority = `${keycloakBaseUrl}/realms/${realm}`;

const redirectUri =
  import.meta.env.VITE_OIDC_REDIRECT_URI ?? `${window.location.origin}/auth/callback`;
const postLogoutRedirectUri =
  import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI ?? `${window.location.origin}/`;
const silentRedirectUri =
  import.meta.env.VITE_OIDC_SILENT_REDIRECT_URI ?? `${window.location.origin}/auth/silent-renew`;

export const userManager = new UserManager({
  authority,
  client_id: clientId,
  redirect_uri: redirectUri,
  post_logout_redirect_uri: postLogoutRedirectUri,
  silent_redirect_uri: silentRedirectUri,
  response_type: 'code',
  scope: 'openid profile email',
  automaticSilentRenew: true,
  loadUserInfo: true,
});
