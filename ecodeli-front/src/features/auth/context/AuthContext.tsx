import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import type { User } from 'oidc-client-ts';

import { httpClient } from '../../../shared/api/httpClient';
import { userManager } from '../services/oidcClient';

export type UserRole = 'CLIENT' | 'COURIER' | 'MERCHANT' | 'PROVIDER' | 'ADMIN';

export interface AuthUser {
  id: string;
  fullName: string;
  email?: string;
  roles: UserRole[];
  avatarInitials?: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const KNOWN_ROLES: readonly UserRole[] = [
  'CLIENT',
  'COURIER',
  'MERCHANT',
  'PROVIDER',
  'ADMIN',
];

type KeycloakProfile = Record<string, unknown> & {
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  preferred_username?: string;
  sub?: string;
  sid?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
};

const toAuthUser = (oidcUser: User | null): AuthUser | null => {
  if (!oidcUser || !oidcUser.profile) {
    return null;
  }

  const profile = oidcUser.profile as KeycloakProfile;
  const email = typeof profile.email === 'string' ? profile.email : undefined;
  const givenName =
    typeof profile.given_name === 'string' ? profile.given_name : undefined;
  const familyName =
    typeof profile.family_name === 'string' ? profile.family_name : undefined;
  const preferredUsername =
    typeof profile.preferred_username === 'string'
      ? profile.preferred_username
      : undefined;

  const computedNameParts = [givenName, familyName].filter(
    (value): value is string => Boolean(value)
  );
  const fallbackName = computedNameParts.join(' ');

  const displayName =
    (typeof profile.name === 'string' && profile.name) ||
    fallbackName ||
    preferredUsername ||
    email ||
    'Utilisateur';

  const id =
    (typeof profile.sub === 'string' && profile.sub) ||
    (typeof profile.sid === 'string' && profile.sid) ||
    displayName;

  const realmRolesRaw = profile.realm_access?.roles;
  const realmRoles = Array.isArray(realmRolesRaw) ? realmRolesRaw : [];

  const resourceRolesRaw = profile.resource_access
    ? Object.values(profile.resource_access).flatMap((entry) =>
        Array.isArray(entry?.roles) ? entry.roles : []
      )
    : [];
  const roleSet = new Set([...realmRoles, ...resourceRolesRaw]);
  const roles = Array.from(roleSet).filter((role): role is UserRole =>
    KNOWN_ROLES.includes(role as UserRole)
  );

  const initialsSource = displayName || preferredUsername || email || '';
  const avatarInitials = initialsSource
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((token) => token.charAt(0).toUpperCase())
    .join('');

  return {
    id,
    fullName: displayName,
    email,
    roles,
    avatarInitials: avatarInitials || undefined,
  };
};

const syncHttpAuthHeader = (oidcUser: User | null) => {
  if (oidcUser?.access_token) {
    httpClient.defaults.headers.common.Authorization = `Bearer ${oidcUser.access_token}`;
  } else {
    delete httpClient.defaults.headers.common.Authorization;
  }
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [oidcUser, setOidcUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const handleUserLoaded = (loadedUser: User) => {
      if (!isMounted) return;
      setOidcUser(loadedUser);
      syncHttpAuthHeader(loadedUser);
    };

    const handleUserUnloaded = () => {
      if (!isMounted) return;
      setOidcUser(null);
      syncHttpAuthHeader(null);
    };

    const handleAccessTokenExpired = async () => {
      try {
        const refreshedUser = await userManager.signinSilent();
        if (refreshedUser) {
          handleUserLoaded(refreshedUser);
        } else {
          handleUserUnloaded();
          await userManager.removeUser();
        }
      } catch {
        handleUserUnloaded();
        await userManager.removeUser();
      }
    };

    const bootstrap = async () => {
      try {
        const existingUser = await userManager.getUser();
        if (!isMounted) return;
        if (existingUser && !existingUser.expired) {
          setOidcUser(existingUser);
          syncHttpAuthHeader(existingUser);
        } else {
          setOidcUser(null);
          syncHttpAuthHeader(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void bootstrap();

    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addUserUnloaded(handleUserUnloaded);
    userManager.events.addAccessTokenExpired(handleAccessTokenExpired);

    return () => {
      isMounted = false;
      userManager.events.removeUserLoaded(handleUserLoaded);
      userManager.events.removeUserUnloaded(handleUserUnloaded);
      userManager.events.removeAccessTokenExpired(handleAccessTokenExpired);
    };
  }, []);

  const login = useCallback(async () => {
    await userManager.signinRedirect({
      state: { returnTo: window.location.href },
    });
  }, []);

  const logout = useCallback(async () => {
    await userManager.signoutRedirect();
  }, []);

  const authUser = useMemo(() => toAuthUser(oidcUser), [oidcUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(authUser),
      isLoading,
      user: authUser,
      login,
      logout,
    }),
    [authUser, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
