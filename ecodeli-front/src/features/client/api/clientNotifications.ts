import { isAxiosError } from 'axios';
import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';

export type ClientNotificationSource =
  | 'Commande & livraison'
  | 'Suivi & ETA'
  | 'Paiement'
  | 'Annonces & offres'
  | 'Support'
  | 'Compte & sécurité';

export type ClientNotificationIconKey =
  | 'orders'
  | 'eta'
  | 'payment'
  | 'campaign'
  | 'support'
  | 'security';

export interface ClientNotificationRecord {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  source: ClientNotificationSource;
  category?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  icon: ClientNotificationIconKey;
}

export interface ClientNotificationActivityRecord {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

interface ClientNotificationResponse {
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
  body?: string;
  content?: string;
  createdOn?: string;
  type?: string;
  severityLevel?: string;
}

interface ClientNotificationActivityResponse {
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

const normalizeSource = (source?: string): ClientNotificationSource => {
  switch (String(source ?? '').toUpperCase()) {
    case 'ETA':
    case 'TRACKING':
    case 'SUIVI':
      return 'Suivi & ETA';
    case 'PAYMENT':
    case 'BILLING':
    case 'FACTURATION':
      return 'Paiement';
    case 'CAMPAIGN':
    case 'PROMOTION':
    case 'MARKETING':
      return 'Annonces & offres';
    case 'SUPPORT':
    case 'HELP':
      return 'Support';
    case 'SECURITY':
    case 'ACCOUNT':
    case 'SECURITE':
      return 'Compte & sécurité';
    case 'ORDER':
    case 'DELIVERY':
    case 'COMMANDE':
    default:
      return 'Commande & livraison';
  }
};

const normalizeIcon = (source: ClientNotificationSource): ClientNotificationIconKey => {
  switch (source) {
    case 'Suivi & ETA':
      return 'eta';
    case 'Paiement':
      return 'payment';
    case 'Annonces & offres':
      return 'campaign';
    case 'Support':
      return 'support';
    case 'Compte & sécurité':
      return 'security';
    case 'Commande & livraison':
    default:
      return 'orders';
  }
};

const normalizeSeverity = (
  severity?: string,
  fallback?: string,
): ClientNotificationRecord['severity'] => {
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

const mapNotification = (payload: ClientNotificationResponse): ClientNotificationRecord => {
  const source = normalizeSource(payload.source);
  return {
    id: String(payload.id),
    title: payload.title ?? 'Notification EcoDeli',
    message:
      payload.message ??
      payload.body ??
      payload.content ??
      'Nouvelle notification disponible.',
    timestamp: formatRelativeTimestamp(payload.createdAt ?? payload.createdOn ?? payload.timestamp),
    source,
    category: payload.category ?? payload.type ?? undefined,
    severity: normalizeSeverity(payload.severity ?? payload.severityLevel, payload.level),
    icon: normalizeIcon(source),
  };
};

const getNotificationContent = (
  data: PaginatedResponse<ClientNotificationResponse> | ClientNotificationResponse[],
) => {
  if (Array.isArray(data)) {
    return data;
  }
  return data.content ?? [];
};

const mapActivity = (
  payload: ClientNotificationActivityResponse,
): ClientNotificationActivityRecord => ({
  id: String(payload.id),
  title: payload.title ?? 'Suivi notification',
  description: payload.description ?? 'Mise à jour disponible.',
  timestamp: formatRelativeTimestamp(payload.createdAt ?? payload.timestamp),
});

const getActivityContent = (
  data:
    | PaginatedResponse<ClientNotificationActivityResponse>
    | ClientNotificationActivityResponse[],
) => {
  if (Array.isArray(data)) {
    return data;
  }
  return data.content ?? [];
};

export const fetchClientNotificationFeed = async (): Promise<ClientNotificationRecord[]> => {
  try {
    const { data } = await httpClient.get<
      PaginatedResponse<ClientNotificationResponse> | ClientNotificationResponse[]
    >('/notifications', {
      params: { mine: true, sort: 'createdAt,desc' },
    });
    return getNotificationContent(data).map(mapNotification);
  } catch (error) {
    console.error('Failed to fetch client notifications', error);
    throw new Error('Impossible de récupérer les notifications client');
  }
};

export const fetchClientNotificationActivity = async (): Promise<ClientNotificationActivityRecord[]> => {
  try {
    const { data } = await httpClient.get<
      | PaginatedResponse<ClientNotificationActivityResponse>
      | ClientNotificationActivityResponse[]
    >('/notifications', {
      params: { mine: true, sort: 'createdAt,desc' },
    });
    return getActivityContent(data).map(mapActivity);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    console.error('Failed to fetch client notification activity', error);
    throw new Error('Impossible de récupérer le journal des notifications client');
  }
};
