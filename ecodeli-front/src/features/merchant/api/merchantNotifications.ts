import { isAxiosError } from 'axios';
import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';

export type MerchantNotificationSource =
  | 'Campagnes & annonces'
  | 'Livraisons & exécution'
  | 'Capacité & planning'
  | 'Finance & facturation'
  | 'Qualité & retours clients'
  | 'Compte & équipe';

export type MerchantNotificationIconKey =
  | 'campaign'
  | 'logistics'
  | 'capacity'
  | 'finance'
  | 'quality'
  | 'account';

export interface MerchantNotificationRecord {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  source: MerchantNotificationSource;
  category?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  icon: MerchantNotificationIconKey;
}

export interface MerchantNotificationActivityRecord {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

interface MerchantNotificationResponse {
  id: number | string;
  title?: string;
  message?: string;
  createdAt?: string;
  timestamp?: string;
  source?: string;
  category?: string;
  severity?: string;
  level?: string;
  type?: string;
}

interface MerchantNotificationActivityResponse {
  id: number | string;
  title?: string;
  description?: string;
  createdAt?: string;
  timestamp?: string;
}

const parseDate = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const formatRelativeTimestamp = (value?: string) => {
  const date = parseDate(value);
  if (!date) {
    return 'Il y a quelques instants';
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes <= 0) {
    return 'Il y a quelques instants';
  }
  if (diffMinutes < 60) {
    return `Il y a ${diffMinutes} min`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `Il y a ${diffHours} h`;
  }

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) {
    return `Il y a ${diffDays} j`;
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const normalizeSource = (source?: string): MerchantNotificationSource => {
  switch (String(source ?? '').toUpperCase()) {
    case 'LOGISTICS':
    case 'DELIVERY':
    case 'LIVRAISON':
      return 'Livraisons & exécution';
    case 'CAPACITY':
    case 'PLANNING':
    case 'PLANIFICATION':
      return 'Capacité & planning';
    case 'FINANCE':
    case 'BILLING':
    case 'FACTURATION':
      return 'Finance & facturation';
    case 'QUALITY':
    case 'CUSTOMER_FEEDBACK':
      return 'Qualité & retours clients';
    case 'ACCOUNT':
    case 'TEAM':
    case 'COMPTE':
      return 'Compte & équipe';
    case 'CAMPAIGN':
    case 'ANNOUNCEMENT':
    default:
      return 'Campagnes & annonces';
  }
};

const normalizeIcon = (source: MerchantNotificationSource): MerchantNotificationIconKey => {
  switch (source) {
    case 'Livraisons & exécution':
      return 'logistics';
    case 'Capacité & planning':
      return 'capacity';
    case 'Finance & facturation':
      return 'finance';
    case 'Qualité & retours clients':
      return 'quality';
    case 'Compte & équipe':
      return 'account';
    case 'Campagnes & annonces':
    default:
      return 'campaign';
  }
};

const normalizeSeverity = (
  severity?: string,
  fallback?: string,
): MerchantNotificationRecord['severity'] => {
  switch (String(severity ?? fallback ?? '').toLowerCase()) {
    case 'error':
    case 'danger':
    case 'critical':
      return 'error';
    case 'warning':
    case 'warn':
      return 'warning';
    case 'success':
    case 'positive':
      return 'success';
    case 'info':
    case 'information':
      return 'info';
    default:
      return undefined;
  }
};

const mapNotification = (payload: MerchantNotificationResponse): MerchantNotificationRecord => {
  const source = normalizeSource(payload.source ?? payload.type ?? payload.category);
  return {
    id: String(payload.id),
    title: payload.title ?? 'Notification commerçant',
    message: payload.message ?? 'Nouvelle notification disponible.',
    timestamp: formatRelativeTimestamp(payload.createdAt ?? payload.timestamp),
    source,
    category: payload.category ?? undefined,
    severity: normalizeSeverity(payload.severity, payload.level),
    icon: normalizeIcon(source),
  };
};

const getNotificationContent = (
  data:
    | PaginatedResponse<MerchantNotificationResponse>
    | MerchantNotificationResponse[],
) => (Array.isArray(data) ? data : data.content ?? []);

const mapActivity = (
  payload: MerchantNotificationActivityResponse,
): MerchantNotificationActivityRecord => ({
  id: String(payload.id),
  title: payload.title ?? 'Suivi notification',
  description: payload.description ?? 'Mise à jour disponible.',
  timestamp: formatRelativeTimestamp(payload.createdAt ?? payload.timestamp),
});

const getActivityContent = (
  data:
    | PaginatedResponse<MerchantNotificationActivityResponse>
    | MerchantNotificationActivityResponse[],
) => (Array.isArray(data) ? data : data.content ?? []);

export const fetchMerchantNotificationFeed = async (): Promise<MerchantNotificationRecord[]> => {
  try {
    const { data } = await httpClient.get<
      PaginatedResponse<MerchantNotificationResponse> | MerchantNotificationResponse[]
    >('/merchant/notifications', {
      params: { page: 0, size: 50, sort: 'createdAt,desc' },
    });
    return getNotificationContent(data).map(mapNotification);
  } catch (error) {
    console.error('Failed to fetch merchant notifications', error);
    throw new Error('Impossible de récupérer les notifications commerçant');
  }
};

export const fetchMerchantNotificationActivity = async (): Promise<MerchantNotificationActivityRecord[]> => {
  try {
    const { data } = await httpClient.get<
      | PaginatedResponse<MerchantNotificationActivityResponse>
      | MerchantNotificationActivityResponse[]
    >('/merchant/notifications/activity', {
      params: { page: 0, size: 20, sort: 'createdAt,desc' },
    });
    return getActivityContent(data).map(mapActivity);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    console.error('Failed to fetch merchant notification activity', error);
    throw new Error('Impossible de récupérer le journal des notifications commerçant');
  }
};
