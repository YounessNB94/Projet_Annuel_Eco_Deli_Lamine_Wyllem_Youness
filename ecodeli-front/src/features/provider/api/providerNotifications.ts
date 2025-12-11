import { isAxiosError } from 'axios';
import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';

export type ProviderNotificationSource =
  | 'Disponibilités'
  | 'Affectations'
  | 'Performance'
  | 'Finance'
  | 'Conformité & contrats'
  | 'Intégrations techniques';

export type ProviderNotificationIconKey =
  | 'availability'
  | 'assignment'
  | 'performance'
  | 'finance'
  | 'compliance'
  | 'integrations';

export interface ProviderNotificationRecord {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  source: ProviderNotificationSource;
  category?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  icon: ProviderNotificationIconKey;
}

export interface ProviderNotificationActivityRecord {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

interface ProviderNotificationResponse {
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
  module?: string;
  topic?: string;
}

interface ProviderNotificationActivityResponse {
  id: number | string;
  title?: string;
  description?: string;
  createdAt?: string;
  timestamp?: string;
}

const sanitizeKey = (value?: string) =>
  String(value ?? '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

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

const normalizeSource = (source?: string): ProviderNotificationSource => {
  const key = sanitizeKey(source);

  if (
    key === 'assignment' ||
    key === 'affectations' ||
    key === 'mission' ||
    key === 'missions' ||
    key === 'dispatch' ||
    key === 'routing'
  ) {
    return 'Affectations';
  }

  if (
    key === 'performance' ||
    key === 'operations' ||
    key === 'kpi' ||
    key === 'operationscore' ||
    key === 'analytics'
  ) {
    return 'Performance';
  }

  if (
    key === 'finance' ||
    key === 'billing' ||
    key === 'facturation' ||
    key === 'payments' ||
    key === 'tresorerie'
  ) {
    return 'Finance';
  }

  if (
    key === 'compliance' ||
    key === 'conformite' ||
    key === 'contrats' ||
    key === 'contracts' ||
    key === 'legal'
  ) {
    return 'Conformité & contrats';
  }

  if (
    key === 'integrations' ||
    key === 'integration' ||
    key === 'technique' ||
    key === 'technical' ||
    key === 'api'
  ) {
    return 'Intégrations techniques';
  }

  return 'Disponibilités';
};

const normalizeIcon = (source: ProviderNotificationSource): ProviderNotificationIconKey => {
  switch (source) {
    case 'Affectations':
      return 'assignment';
    case 'Performance':
      return 'performance';
    case 'Finance':
      return 'finance';
    case 'Conformité & contrats':
      return 'compliance';
    case 'Intégrations techniques':
      return 'integrations';
    case 'Disponibilités':
    default:
      return 'availability';
  }
};

const normalizeSeverity = (
  severity?: string,
  fallback?: string,
): ProviderNotificationRecord['severity'] => {
  const key = sanitizeKey(severity ?? fallback);

  if (key === 'error' || key === 'critical' || key === 'danger' || key === 'alerte') {
    return 'error';
  }

  if (key === 'warning' || key === 'warn' || key === 'avertissement') {
    return 'warning';
  }

  if (key === 'success' || key === 'ok' || key === 'positive' || key === 'valide') {
    return 'success';
  }

  if (key === 'info' || key === 'information') {
    return 'info';
  }

  return undefined;
};

const mapNotification = (payload: ProviderNotificationResponse): ProviderNotificationRecord => {
  const source = normalizeSource(
    payload.source ?? payload.category ?? payload.type ?? payload.module ?? payload.topic,
  );

  return {
    id: String(payload.id),
    title: payload.title ?? 'Notification prestataire',
    message: payload.message ?? 'Nouvelle notification disponible.',
    timestamp: formatRelativeTimestamp(payload.createdAt ?? payload.timestamp),
    source,
    category: payload.category ?? payload.type ?? undefined,
    severity: normalizeSeverity(payload.severity, payload.level),
    icon: normalizeIcon(source),
  };
};

const getNotificationContent = (
  data: PaginatedResponse<ProviderNotificationResponse> | ProviderNotificationResponse[],
) => (Array.isArray(data) ? data : data.content ?? []);

const mapActivity = (
  payload: ProviderNotificationActivityResponse,
): ProviderNotificationActivityRecord => ({
  id: String(payload.id),
  title: payload.title ?? 'Suivi prestataire',
  description: payload.description ?? 'Mise à jour disponible.',
  timestamp: formatRelativeTimestamp(payload.createdAt ?? payload.timestamp),
});

const getActivityContent = (
  data: PaginatedResponse<ProviderNotificationActivityResponse> | ProviderNotificationActivityResponse[],
) => (Array.isArray(data) ? data : data.content ?? []);

const NOTIFICATIONS_ENDPOINT = '/notifications';

export const fetchProviderNotificationFeed = async (): Promise<ProviderNotificationRecord[]> => {
  try {
    const { data } = await httpClient.get<
      PaginatedResponse<ProviderNotificationResponse> | ProviderNotificationResponse[]
    >(NOTIFICATIONS_ENDPOINT, {
      params: { mine: true },
    });
    return getNotificationContent(data).map(mapNotification);
  } catch (error) {
    console.error('Failed to fetch provider notifications', error);
    throw new Error('Impossible de récupérer les notifications prestataire');
  }
};

export const fetchProviderNotificationActivity = async (): Promise<ProviderNotificationActivityRecord[]> => {
  try {
    const { data } = await httpClient.get<
      | PaginatedResponse<ProviderNotificationActivityResponse>
      | ProviderNotificationActivityResponse[]
    >(NOTIFICATIONS_ENDPOINT, {
      params: { mine: true },
    });
    return getActivityContent(data).map(mapActivity);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    console.error('Failed to fetch provider notification activity', error);
    throw new Error('Impossible de récupérer le journal des notifications prestataire');
  }
};
