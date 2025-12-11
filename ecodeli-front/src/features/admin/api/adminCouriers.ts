import type { AxiosResponse } from 'axios';
import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { AdminStatus } from '../components/AdminStatusChip';

export type AdminCourierMetricIconKey = 'shield';

export interface AdminCourierMetric {
  label: string;
  value: number | string;
  helper?: string;
  icon?: AdminCourierMetricIconKey;
}

export interface AdminCourierRow {
  id: string;
  name: string;
  company: string;
  zone: string;
  level: 'Bronze' | 'Argent' | 'Or';
  status: AdminStatus;
  documents: {
    verified: number;
    total: number;
  };
  lastUpdate: string;
  submittedAt: string;
}

export interface AdminCourierActivityRecord {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface AdminCouriersData {
  metrics: AdminCourierMetric[];
  couriers: AdminCourierRow[];
  validationActivity: AdminCourierActivityRecord[];
}

interface AdminCourierResponse {
  id: number | string;
  fullName?: string;
  companyName?: string;
  zone?: string;
  level?: string;
  status?: string;
  documentsVerified?: number;
  documentsTotal?: number;
  updatedAt?: string;
  submittedAt?: string;
}

interface AdminCourierDocumentResponse {
  id: number | string;
  courierId?: number | string;
  documentType?: string;
  status?: string;
  updatedAt?: string;
  reviewerName?: string;
}

const getPaginatedData = <T>(
  result: PromiseSettledResult<AxiosResponse<PaginatedResponse<T>>>,
): PaginatedResponse<T> | undefined => (result.status === 'fulfilled' ? result.value.data : undefined);

const normalizeStatus = (status?: string): AdminStatus => {
  switch (String(status ?? '').toUpperCase()) {
    case 'PENDING':
      return 'pending';
    case 'UNDER_REVIEW':
    case 'REVIEW':
      return 'review';
    case 'APPROVED':
    case 'VALIDATED':
      return 'approved';
    case 'REJECTED':
      return 'rejected';
    case 'PAUSED':
      return 'paused';
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

const formatRelativeTime = (value?: string) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  const now = Date.now();
  const diffInMinutes = Math.round((now - date.getTime()) / 60000);
  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} min`;
  }
  const diffInHours = Math.round(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Il y a ${diffInHours} h`;
  }
  const formatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit' });
  return formatter.format(date);
};

const computeAverageValidationTime = (couriers: AdminCourierResponse[] = []) => {
  const durations = couriers
    .map((courier) => {
      if (!courier.updatedAt || !courier.submittedAt) {
        return null;
      }
      const updated = new Date(courier.updatedAt).getTime();
      const submitted = new Date(courier.submittedAt).getTime();
      if (Number.isNaN(updated) || Number.isNaN(submitted)) {
        return null;
      }
      return Math.max(0, updated - submitted);
    })
    .filter((value): value is number => value !== null);

  if (durations.length === 0) {
    return '—';
  }

  const averageDurationMs = durations.reduce((accumulator, duration) => accumulator + duration, 0) / durations.length;
  const hours = Math.round(averageDurationMs / 3_600_000);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (days === 0) {
    return `${remainingHours}h`;
  }
  return `${days}j ${remainingHours}h`;
};

const mapCouriersToRows = (couriers: AdminCourierResponse[] = []): AdminCourierRow[] =>
  couriers.map((courier) => ({
    id: String(courier.id),
    name: courier.fullName ?? '—',
    company: courier.companyName ?? '—',
    zone: courier.zone ?? '—',
    level: normalizeLevel(courier.level),
    status: normalizeStatus(courier.status),
    documents: {
      verified: courier.documentsVerified ?? 0,
      total: courier.documentsTotal ?? courier.documentsVerified ?? 0,
    },
    lastUpdate: formatRelativeTime(courier.updatedAt),
    submittedAt: formatRelativeTime(courier.submittedAt),
  }));

const mapDocumentsToActivity = (documents: AdminCourierDocumentResponse[] = []): AdminCourierActivityRecord[] => {
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  return documents.slice(0, 6).map((document) => ({
    id: String(document.id),
    title: document.documentType ?? 'Document',
    description: document.reviewerName
      ? `${document.reviewerName} • ${String(document.status ?? '').toLowerCase()}`
      : String(document.status ?? 'Mise à jour'),
    timestamp: document.updatedAt ? formatter.format(new Date(document.updatedAt)) : '—',
  }));
};

export const fetchAdminCouriersData = async (): Promise<AdminCouriersData> => {
  const [couriersResult, pendingResult, approvedResult, rejectedResult, documentsResult] =
    await Promise.allSettled([
      httpClient.get<PaginatedResponse<AdminCourierResponse>>('/admin/couriers', {
        params: { page: 0, size: 50, sort: 'submittedAt,desc' },
      }),
      httpClient.get<PaginatedResponse<AdminCourierResponse>>('/admin/couriers', {
        params: { status: 'PENDING', page: 0, size: 1 },
      }),
      httpClient.get<PaginatedResponse<AdminCourierResponse>>('/admin/couriers', {
        params: { status: 'APPROVED', page: 0, size: 1 },
      }),
      httpClient.get<PaginatedResponse<AdminCourierResponse>>('/admin/couriers', {
        params: { status: 'REJECTED', page: 0, size: 1 },
      }),
      httpClient.get<PaginatedResponse<AdminCourierDocumentResponse>>('/admin/courier-documents', {
        params: { status: 'PENDING', page: 0, size: 10, sort: 'updatedAt,desc' },
      }),
    ]);

  const couriersData = getPaginatedData(couriersResult);
  const pendingData = getPaginatedData(pendingResult);
  const approvedData = getPaginatedData(approvedResult);
  const rejectedData = getPaginatedData(rejectedResult);
  const documentsData = getPaginatedData(documentsResult);

  const averageValidationTime = computeAverageValidationTime((couriersData?.content ?? []).filter(
    (courier) => normalizeStatus(courier.status) === 'approved',
  ));

  const metrics: AdminCourierMetric[] = [
    {
      label: 'Dossiers en attente',
      value: pendingData?.totalElements ?? 0,
      helper: `${pendingData?.content.length ?? 0} en file`,
      icon: 'shield',
    },
    {
      label: 'Validés',
      value: approvedData?.totalElements ?? 0,
      helper: 'Sur la période courante',
    },
    {
      label: 'Dossiers refusés',
      value: rejectedData?.totalElements ?? 0,
      helper: 'Documents non conformes',
    },
    {
      label: 'Temps moyen validation',
      value: averageValidationTime,
      helper: 'Entre soumission et validation',
    },
  ];

  return {
    metrics,
    couriers: mapCouriersToRows(couriersData?.content),
    validationActivity: mapDocumentsToActivity(documentsData?.content),
  };
};
