import { isAxiosError } from 'axios';
import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';

export type CourierNotificationSource =
  | 'Missions'
  | 'Temps réel'
  | 'Preuves de livraison'
  | 'Gains'
  | 'Qualité & sécurité'
  | 'Conformité & dossiers';

export type CourierNotificationIconKey =
  | 'missions'
  | 'realtime'
  | 'proof'
  | 'earnings'
  | 'quality'
  | 'compliance';

export interface CourierNotificationRecord {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  source: CourierNotificationSource;
  category?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  icon: CourierNotificationIconKey;
}

export interface CourierNotificationActivityRecord {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

interface CourierNotificationResponse {
  id: number | string;
  title?: string;
  message?: string;
  createdAt?: string;
  timestamp?: string;
  source?: string;
  category?: string;
  severity?: string;
  level?: string;
  icon?: string;
  iconKey?: string;
}

interface CourierNotificationActivityResponse {
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

const normalizeSource = (source?: string): CourierNotificationSource => {
  switch (String(source ?? '').toUpperCase()) {
    case 'REAL_TIME':
    case 'REALTIME':
    case 'TEMPS_REEL':
      return 'Temps réel';
    case 'PROOF':
    case 'DELIVERY_PROOF':
    case 'PREUVES':
      return 'Preuves de livraison';
    case 'EARNINGS':
    case 'PAYMENTS':
    case 'GAINS':
      return 'Gains';
    case 'QUALITY':
    case 'SECURITY':
    case 'QUALITE':
      return 'Qualité & sécurité';
    case 'COMPLIANCE':
    case 'CONFORMITE':
    case 'DOCUMENTS':
      return 'Conformité & dossiers';
    case 'MISSIONS':
    default:
      return 'Missions';
  }
};

const normalizeIcon = (icon?: string): CourierNotificationIconKey => {
  switch (String(icon ?? '').toLowerCase()) {
    case 'realtime':
    case 'real_time':
    case 'temps_reel':
      return 'realtime';
    case 'proof':
    case 'delivery_proof':
      return 'proof';
    case 'earnings':
    case 'bonus':
      return 'earnings';
    case 'quality':
    case 'security':
      return 'quality';
    case 'compliance':
    case 'documents':
      return 'compliance';
    case 'missions':
    default:
      return 'missions';
  }
};

const normalizeSeverity = (
  severity?: string,
  fallback?: string,
): CourierNotificationRecord['severity'] => {
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

const mapNotification = (payload: CourierNotificationResponse): CourierNotificationRecord => ({
  id: String(payload.id),
  title: payload.title ?? 'Notification EcoDeli',
  message: payload.message ?? 'Nouvelle mise à jour disponible.',
  timestamp: formatRelativeTimestamp(payload.createdAt ?? payload.timestamp),
  source: normalizeSource(payload.source),
  category: payload.category ?? undefined,
  severity: normalizeSeverity(payload.severity, payload.level),
  icon: normalizeIcon(payload.icon ?? payload.iconKey),
});

const getNotificationContent = (
  data: PaginatedResponse<CourierNotificationResponse> | CourierNotificationResponse[],
) => {
  if (Array.isArray(data)) {
    return data;
  }
  return data.content ?? [];
};

const mapActivity = (
  payload: CourierNotificationActivityResponse,
): CourierNotificationActivityRecord => ({
  id: String(payload.id),
  title: payload.title ?? 'Suivi activité',
  description: payload.description ?? 'Mise à jour disponible.',
  timestamp: formatRelativeTimestamp(payload.createdAt ?? payload.timestamp),
});

const getActivityContent = (
  data:
    | PaginatedResponse<CourierNotificationActivityResponse>
    | CourierNotificationActivityResponse[],
) => {
  if (Array.isArray(data)) {
    return data;
  }
  return data.content ?? [];
};

export const fetchCourierNotificationFeed = async (): Promise<CourierNotificationRecord[]> => {
  try {
    const { data } = await httpClient.get<
      PaginatedResponse<CourierNotificationResponse> | CourierNotificationResponse[]
    >('/courier/notifications', {
      params: { page: 0, size: 50, sort: 'createdAt,desc' },
    });
    return getNotificationContent(data).map(mapNotification);
  } catch (error) {
    console.error('Failed to fetch courier notifications', error);
    throw new Error('Impossible de récupérer les notifications coursier');
  }
};

export const fetchCourierNotificationActivity = async (): Promise<CourierNotificationActivityRecord[]> => {
  try {
    const { data } = await httpClient.get<
      | PaginatedResponse<CourierNotificationActivityResponse>
      | CourierNotificationActivityResponse[]
    >('/courier/notifications/activity', {
      params: { page: 0, size: 20, sort: 'createdAt,desc' },
    });
    return getActivityContent(data).map(mapActivity);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    console.error('Failed to fetch courier notification activity', error);
    throw new Error('Impossible de récupérer le journal des notifications');
  }
};
