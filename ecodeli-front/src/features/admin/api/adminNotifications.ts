import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';

export type AdminNotificationSource = 'Livraisons' | 'Campagnes' | 'Finance' | 'Livreurs';

export type AdminNotificationIconKey = 'delivery' | 'campaign' | 'finance' | 'courier';

export interface AdminNotificationRecord {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  source: AdminNotificationSource;
  category?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  icon: AdminNotificationIconKey;
}

export interface AdminNotificationActivityRecord {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

interface NotificationResponse {
  id: number | string;
  title?: string;
  message?: string;
  createdAt?: string;
  category?: string;
  domain?: string;
  severity?: string;
  channel?: string;
}

const SOURCE_MAP: Record<string, AdminNotificationSource> = {
  DELIVERIES: 'Livraisons',
  DELIVERY: 'Livraisons',
  OPERATIONS: 'Livraisons',
  CAMPAIGN: 'Campagnes',
  CAMPAIGNS: 'Campagnes',
  MARKETING: 'Campagnes',
  FINANCE: 'Finance',
  BILLING: 'Finance',
  PAYMENT: 'Finance',
  PAYMENTS: 'Finance',
  COURIER: 'Livreurs',
  COURIERS: 'Livreurs',
  ONBOARDING: 'Livreurs',
};

const ICON_BY_SOURCE: Record<AdminNotificationSource, AdminNotificationIconKey> = {
  Livraisons: 'delivery',
  Campagnes: 'campaign',
  Finance: 'finance',
  Livreurs: 'courier',
};

const normalizeSource = (value?: string): AdminNotificationSource => {
  if (!value) {
    return 'Livraisons';
  }
  const normalized = SOURCE_MAP[value.toUpperCase()];
  if (normalized) {
    return normalized;
  }
  if (value.toLowerCase().includes('finance')) {
    return 'Finance';
  }
  if (value.toLowerCase().includes('campaign')) {
    return 'Campagnes';
  }
  if (value.toLowerCase().includes('courier') || value.toLowerCase().includes('livreur')) {
    return 'Livreurs';
  }
  return 'Livraisons';
};

const normalizeSeverity = (value?: string): 'error' | 'warning' | 'info' | 'success' | undefined => {
  switch (String(value ?? '').toUpperCase()) {
    case 'ERROR':
    case 'CRITICAL':
      return 'error';
    case 'WARNING':
    case 'WARN':
      return 'warning';
    case 'SUCCESS':
    case 'OK':
      return 'success';
    case 'INFO':
    default:
      return value ? 'info' : undefined;
  }
};

const formatTimestamp = (value?: string) => {
  if (!value) {
    return '—';
  }
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) {
    return '—';
  }
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);
};

const mapNotificationRecord = (payload: NotificationResponse): AdminNotificationRecord => {
  const source = normalizeSource(payload.domain ?? payload.category ?? payload.channel);
  return {
    id: String(payload.id),
    title: payload.title ?? 'Notification',
    message: payload.message ?? 'Nouvelle notification',
    timestamp: formatTimestamp(payload.createdAt),
    source,
    category: payload.category,
    severity: normalizeSeverity(payload.severity),
    icon: ICON_BY_SOURCE[source],
  };
};

const mapActivityRecord = (payload: NotificationResponse): AdminNotificationActivityRecord => ({
  id: String(payload.id),
  title: payload.title ?? 'Notification système',
  description: payload.message ?? 'Mise à jour récente',
  timestamp: formatTimestamp(payload.createdAt),
});

const getNotificationContent = (
  data: PaginatedResponse<NotificationResponse> | NotificationResponse[],
) => (Array.isArray(data) ? data : data.content ?? []);

const NOTIFICATIONS_ENDPOINT = '/notifications';

export const fetchAdminNotificationFeed = async (): Promise<AdminNotificationRecord[]> => {
  try {
    const { data } = await httpClient.get<
      PaginatedResponse<NotificationResponse> | NotificationResponse[]
    >(NOTIFICATIONS_ENDPOINT, {
      params: { mine: true },
    });
    return getNotificationContent(data).map(mapNotificationRecord);
  } catch (error) {
    console.error('Failed to fetch admin notifications', error);
    throw new Error('Impossible de récupérer les notifications administrateur');
  }
};

export const fetchAdminNotificationActivity = async (): Promise<AdminNotificationActivityRecord[]> => {
  try {
    const { data } = await httpClient.get<
      PaginatedResponse<NotificationResponse> | NotificationResponse[]
    >(NOTIFICATIONS_ENDPOINT, {
      params: { mine: true },
    });
    return getNotificationContent(data).map(mapActivityRecord);
  } catch (error) {
    console.error('Failed to fetch admin notification activity', error);
    throw new Error('Impossible de récupérer le journal des notifications administrateur');
  }
};
