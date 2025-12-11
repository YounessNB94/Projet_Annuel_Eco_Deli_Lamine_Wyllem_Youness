import { isAxiosError } from 'axios';
import type { AdminStatus } from '../components/AdminStatusChip';
import type { AdminDocumentItem } from '../components/AdminDocumentList';
import type { AdminActivityItem } from '../components/AdminActivityList';
import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';

export interface AdminCourierProfile {
  id: string;
  name: string;
  company: string;
  zone: string;
  level: 'Bronze' | 'Argent' | 'Or';
  status: AdminStatus;
  deliveries: number;
  rating: string;
  averageSla: string;
  contactEmail: string;
  contactPhone: string;
}

export interface AdminCourierDocumentRecord extends Omit<AdminDocumentItem, 'actions'> {
  fileName: string;
}

export type AdminCourierActivityRecord = AdminActivityItem;

interface AdminCourierResponse {
  id: number | string;
  fullName?: string;
  companyName?: string;
  zone?: string;
  level?: string;
  status?: string;
  completedDeliveries?: number;
  averageSlaMinutes?: number;
  rating?: number;
  email?: string;
  phoneNumber?: string;
}

interface AdminCourierDocumentResponse {
  id: number | string;
  documentType?: string;
  description?: string;
  uploadedAt?: string;
  status?: string;
  fileName?: string;
  expiresAt?: string;
}

interface NotificationResponse {
  id: number | string;
  title?: string;
  message?: string;
  createdAt?: string;
  category?: string;
}

const normalizeStatus = (status?: string): AdminStatus => {
  switch (String(status ?? '').toUpperCase()) {
    case 'APPROVED':
      return 'approved';
    case 'REJECTED':
      return 'rejected';
    case 'REVIEW':
    case 'UNDER_REVIEW':
      return 'review';
    case 'PAUSED':
      return 'paused';
    case 'PENDING':
    default:
      return 'pending';
  }
};

const normalizeLevel = (level?: string): 'Bronze' | 'Argent' | 'Or' => {
  switch (String(level ?? '').toUpperCase()) {
    case 'GOLD':
    case 'OR':
      return 'Or';
    case 'SILVER':
    case 'ARGENT':
      return 'Argent';
    default:
      return 'Bronze';
  }
};

const formatSla = (minutes?: number) => {
  if (!minutes || Number.isNaN(minutes)) {
    return 'N/A';
  }
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) {
    return `${remainder} min`;
  }
  return `${hours}h ${remainder} min`;
};

const formatRating = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'N/A';
  }
  return `${value.toFixed(1)}/5`;
};

const formatMeta = (uploadedAt?: string, expiresAt?: string) => {
  const parts: string[] = [];
  if (uploadedAt) {
    const uploadedLabel = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(uploadedAt));
    parts.push(`Ajouté le ${uploadedLabel}`);
  }
  if (expiresAt) {
    const expiryLabel = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
    }).format(new Date(expiresAt));
    parts.push(`Expire le ${expiryLabel}`);
  }
  return parts.join(' • ');
};

const normalizeDocumentStatus = (status?: string) => {
  switch (String(status ?? '').toUpperCase()) {
    case 'APPROVED':
    case 'VALIDATED':
      return { label: 'Validé', color: 'success' as const, variant: 'filled' as const };
    case 'PENDING':
    case 'UNDER_REVIEW':
      return { label: 'En revue', color: 'warning' as const };
    case 'EXPIRED':
      return { label: 'Expiré', color: 'error' as const };
    case 'REJECTED':
      return { label: 'Rejeté', color: 'error' as const, variant: 'filled' as const };
    case 'DRAFT':
      return { label: 'Brouillon', color: 'default' as const };
    default:
      return { label: 'À vérifier', color: 'info' as const };
  }
};

const toCourierProfile = (payload: AdminCourierResponse): AdminCourierProfile => ({
  id: String(payload.id),
  name: payload.fullName ?? 'Livreur',
  company: payload.companyName ?? 'Entreprise non renseignée',
  zone: payload.zone ?? 'Zone non renseignée',
  level: normalizeLevel(payload.level),
  status: normalizeStatus(payload.status),
  deliveries: payload.completedDeliveries ?? 0,
  rating: formatRating(payload.rating),
  averageSla: formatSla(payload.averageSlaMinutes),
  contactEmail: payload.email ?? 'contact@ecodeli.fr',
  contactPhone: payload.phoneNumber ?? '+33 1 80 02 12 34',
});

const toCourierDocument = (payload: AdminCourierDocumentResponse): AdminCourierDocumentRecord => ({
  id: String(payload.id),
  title: payload.documentType ?? 'Document',
  description: payload.description ?? undefined,
  meta: formatMeta(payload.uploadedAt, payload.expiresAt),
  status: normalizeDocumentStatus(payload.status),
  fileName: payload.fileName ?? `${payload.documentType ?? 'document'}.pdf`,
});

const toActivityItem = (payload: NotificationResponse): AdminCourierActivityRecord => ({
  id: String(payload.id),
  title: payload.title ?? payload.category ?? 'Notification',
  description: payload.message ?? 'Mise à jour backoffice',
  timestamp: payload.createdAt
    ? new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(payload.createdAt))
    : '—',
});

const isValidCourierIdentifier = (courierId: string) => courierId && courierId !== 'unknown';

export const DEFAULT_ADMIN_COURIER_ID = 'unknown';

export const fetchAdminCourierProfile = async (
  courierId: string,
): Promise<AdminCourierProfile | undefined> => {
  if (!isValidCourierIdentifier(courierId)) {
    return undefined;
  }
  try {
    const { data } = await httpClient.get<AdminCourierResponse>(`/admin/couriers/${courierId}`);
    return toCourierProfile(data);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return undefined;
    }
    console.error('Failed to fetch admin courier profile', error);
    return undefined;
  }
};

export const fetchAdminCourierDocuments = async (
  courierId: string,
): Promise<AdminCourierDocumentRecord[]> => {
  if (!isValidCourierIdentifier(courierId)) {
    return [];
  }
  try {
    const { data } = await httpClient.get<PaginatedResponse<AdminCourierDocumentResponse>>(
      '/admin/courier-documents',
      {
        params: { courierUserId: courierId, page: 0, size: 20, sort: 'uploadedAt,desc' },
      },
    );
    return (data.content ?? []).map(toCourierDocument);
  } catch (error) {
    console.error('Failed to fetch admin courier documents', error);
    return [];
  }
};

export const fetchAdminCourierActivity = async (
  courierId: string,
): Promise<AdminCourierActivityRecord[]> => {
  if (!isValidCourierIdentifier(courierId)) {
    return [];
  }
  try {
    const { data } = await httpClient.get<PaginatedResponse<NotificationResponse>>('/notifications', {
      params: {
        mine: true,
        courierUserId: courierId,
        page: 0,
        size: 10,
        sort: 'createdAt,desc',
      },
    });
    return (data.content ?? []).map(toActivityItem);
  } catch (error) {
    console.error('Failed to fetch admin courier activity', error);
    return [];
  }
};
