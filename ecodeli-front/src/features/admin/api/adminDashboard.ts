import type { AxiosResponse } from 'axios';
import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';

export type AdminDashboardStatIconKey =
  | 'pendingCouriers'
  | 'validations'
  | 'deliveries'
  | 'billing';

export type AdminDashboardActivityIconKey =
  | 'validation'
  | 'anomaly'
  | 'campaign';

export interface AdminDashboardStat {
  label: string;
  value: number | string;
  helper: string;
  icon: AdminDashboardStatIconKey;
  trend?: {
    label: string;
    color?: 'info' | 'success';
  };
}

export interface AdminDashboardPendingCourier {
  id: string;
  name: string;
  company: string;
  submittedAt: string;
  documents: number;
}

export interface AdminDashboardActivityRecord {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: AdminDashboardActivityIconKey;
}

export interface AdminDashboardAlert {
  id: string;
  label: string;
  detail: string;
  severity: 'warning' | 'error';
}

export interface AdminDashboardData {
  stats: AdminDashboardStat[];
  pendingCouriers: AdminDashboardPendingCourier[];
  activityItems: AdminDashboardActivityRecord[];
  globalAlerts: AdminDashboardAlert[];
}

interface AdminCourierResponse {
  id: number | string;
  fullName?: string;
  companyName?: string;
  zone?: string;
  status?: string;
  submittedAt?: string;
  documentsVerified?: number;
  documentsTotal?: number;
}

interface AdminDeliveryResponse {
  id: number | string;
  reference?: string;
  merchantName?: string;
  status?: string;
  eta?: string;
  windowStart?: string;
  windowEnd?: string;
  volume?: number;
  couriersAssigned?: number;
  zone?: string;
}

interface AdminInvoiceResponse {
  id: number | string;
  amount?: number;
  currency?: string;
  status?: string;
  issuedAt?: string;
  dueAt?: string;
}

interface AdminAnnouncementResponse {
  id: number | string;
  title?: string;
  merchantName?: string;
  status?: string;
  createdAt?: string;
}

const toLocaleDateTime = (value?: string) => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  }).format(date);
};

const toCurrency = (value?: number, currency = 'EUR') => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '0 €';
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

const getPaginatedData = <T>(
  result: PromiseSettledResult<AxiosResponse<PaginatedResponse<T>>>,
): PaginatedResponse<T> | undefined => (result.status === 'fulfilled' ? result.value.data : undefined);

const mapPendingCouriers = (couriers: AdminCourierResponse[] = []): AdminDashboardPendingCourier[] =>
  couriers.map((courier) => ({
    id: String(courier.id),
    name: courier.fullName ?? '—',
    company: courier.companyName ?? courier.zone ?? '—',
    submittedAt: toLocaleDateTime(courier.submittedAt) || '—',
    documents: courier.documentsVerified ?? 0,
  }));

const mapAnnouncementsToActivity = (
  announcements: AdminAnnouncementResponse[] = [],
): AdminDashboardActivityRecord[] =>
  announcements.slice(0, 4).map((announcement) => ({
    id: String(announcement.id),
    title: announcement.title ?? 'Campagne',
    description: announcement.merchantName ?? 'Annonce EcoDeli',
    timestamp: toLocaleDateTime(announcement.createdAt) || '—',
    icon: 'campaign',
  }));

const mapDeliveriesToAlerts = (deliveries: AdminDeliveryResponse[] = []): AdminDashboardAlert[] =>
  deliveries
    .filter((delivery) => ['DELAYED', 'CANCELLED'].includes(String(delivery.status ?? '').toUpperCase()))
    .slice(0, 3)
    .map((delivery) => ({
      id: String(delivery.id),
      label: delivery.reference ?? 'Livraison',
      detail: delivery.merchantName ?? delivery.zone ?? 'Suivi requis',
      severity: String(delivery.status ?? '').toUpperCase() === 'CANCELLED' ? 'error' : 'warning',
    }));

export const fetchAdminDashboardData = async (): Promise<AdminDashboardData> => {
  const [pendingCouriersResult, approvedCouriersResult, deliveriesResult, invoicesResult, announcementsResult] =
    await Promise.allSettled([
      httpClient.get<PaginatedResponse<AdminCourierResponse>>('/admin/couriers', {
        params: { status: 'PENDING', page: 0, size: 5, sort: 'submittedAt,desc' },
      }),
      httpClient.get<PaginatedResponse<AdminCourierResponse>>('/admin/couriers', {
        params: { status: 'APPROVED', page: 0, size: 1 },
      }),
      httpClient.get<PaginatedResponse<AdminDeliveryResponse>>('/admin/deliveries', {
        params: { status: 'IN_PROGRESS', page: 0, size: 10, sort: 'updatedAt,desc' },
      }),
      httpClient.get<PaginatedResponse<AdminInvoiceResponse>>('/admin/invoices', {
        params: { status: 'DUE', page: 0, size: 20, sort: 'dueAt,asc' },
      }),
      httpClient.get<PaginatedResponse<AdminAnnouncementResponse>>('/admin/announcements', {
        params: { page: 0, size: 5, sort: 'createdAt,desc' },
      }),
    ]);

  const pendingCouriersData = getPaginatedData(pendingCouriersResult);
  const approvedCouriersData = getPaginatedData(approvedCouriersResult);
  const deliveriesData = getPaginatedData(deliveriesResult);
  const invoicesData = getPaginatedData(invoicesResult);
  const announcementsData = getPaginatedData(announcementsResult);

  const pendingCouriersCount = pendingCouriersData?.totalElements ?? 0;
  const approvedCouriersCount = approvedCouriersData?.totalElements ?? 0;
  const deliveriesInProgress = deliveriesData?.totalElements ?? 0;
  const dueInvoicesAmount = (invoicesData?.content ?? []).reduce((total, invoice) => total + (invoice.amount ?? 0), 0);

  const stats: AdminDashboardStat[] = [
    {
      label: 'Livreurs en attente',
      value: pendingCouriersCount,
      helper: `${Math.min(pendingCouriersCount, pendingCouriersData?.content.length ?? 0)} dossiers à traiter`,
      icon: 'pendingCouriers',
    },
    {
      label: 'Validations traitées',
      value: approvedCouriersCount,
      helper: 'Conformité couriers approuvés',
      icon: 'validations',
    },
    {
      label: 'Livraisons en cours',
      value: deliveriesInProgress,
      helper: `${deliveriesData?.content.length ?? 0} suivies récemment`,
      icon: 'deliveries',
    },
    {
      label: 'Montant factures dues',
      value: toCurrency(dueInvoicesAmount),
      helper: `${invoicesData?.totalElements ?? 0} factures en attente`,
      icon: 'billing',
    },
  ];

  return {
    stats,
    pendingCouriers: mapPendingCouriers(pendingCouriersData?.content),
    activityItems: mapAnnouncementsToActivity(announcementsData?.content),
    globalAlerts: mapDeliveriesToAlerts(deliveriesData?.content),
  };
};
