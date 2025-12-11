import type { UserRole } from '../../features/auth/context/AuthContext';
import { httpClient } from './httpClient';
import type { PaginatedResponse } from './types';

export type AppNavigationIconKey = 'client' | 'courier' | 'merchant' | 'provider';

export interface AppNavigationLink {
  label: string;
  path: string;
  icon: AppNavigationIconKey;
}

export interface AppNavigationBrand {
  label: string;
}

export interface AppNavigationData {
  brand: AppNavigationBrand;
  navLinks: AppNavigationLink[];
  notificationRoutes: Partial<Record<UserRole, string>>;
  notificationBadgeCount: number;
}

interface AppUserSummary {
  id: number | string;
  fullName?: string;
  roles?: UserRole[];
}

interface NotificationSummary {
  id: number | string;
  status?: 'UNREAD' | 'READ' | string;
}

const BASE_NAV_LINKS: AppNavigationLink[] = [
  { label: 'Clients', path: '/client/dashboard', icon: 'client' },
  { label: 'Livreurs', path: '/courier/devenir-livreur', icon: 'courier' },
  { label: 'Commerçants', path: '/merchant/devenir-commercant', icon: 'merchant' },
  { label: 'Prestataire', path: '/provider/devenir-prestataire', icon: 'provider' },
];

const BASE_NOTIFICATION_ROUTES: Record<UserRole, string> = {
  CLIENT: '/client/notifications',
  COURIER: '/courier/notifications',
  MERCHANT: '/merchant/notifications',
  ADMIN: '/admin/notifications',
  PROVIDER: '/provider/notifications',
};

export const fetchAppNavigationData = async (): Promise<AppNavigationData> => {
  try {
    const [userResponse, notificationsResponse] = await Promise.all([
      httpClient.get<AppUserSummary>('/users/me'),
      httpClient.get<PaginatedResponse<NotificationSummary>>('/notifications', {
        params: {
          mine: true,
          status: 'UNREAD',
          page: 0,
          size: 1,
        },
      }),
    ]);

    const userRoles = userResponse.data.roles ?? [];
    const notificationBadgeCount = notificationsResponse.data?.totalElements ?? 0;

    const notificationRoutes = userRoles.reduce<Partial<Record<UserRole, string>>>(
      (accumulator, role) => {
        const route = BASE_NOTIFICATION_ROUTES[role];
        if (route) {
          accumulator[role] = route;
        }
        return accumulator;
      },
      {},
    );

    return {
      brand: { label: 'EcoDeli' },
      navLinks: BASE_NAV_LINKS,
      notificationRoutes,
      notificationBadgeCount,
    };
  } catch (error) {
    console.error('Failed to fetch app navigation data', error);
    return {
      brand: { label: 'EcoDeli' },
      navLinks: BASE_NAV_LINKS,
      notificationRoutes: {
        CLIENT: '/client/notifications',
        COURIER: '/courier/notifications',
        MERCHANT: '/merchant/notifications',
        ADMIN: '/admin/notifications',
        PROVIDER: '/provider/notifications',
      },
      notificationBadgeCount: 0,
    };
  }
};
