import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';

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
  user: AuthUser | null;
  login: (nextUser?: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const demoUser: AuthUser = {
  id: 'user-demo-1',
  fullName: 'Jean Dupont',
  email: 'jean.dupont@ecodeli.fr',
  roles: ['CLIENT'],
  avatarInitials: 'JD',
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback((nextUser: AuthUser = demoUser) => {
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      login,
      logout,
    }),
    [login, logout, user]
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
