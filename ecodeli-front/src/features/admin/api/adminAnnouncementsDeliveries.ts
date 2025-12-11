import type { AxiosResponse } from 'axios';
import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { AdminStatus } from '../components/AdminStatusChip';

export type AdminFlowType = 'announcement' | 'delivery';

export interface AdminOverviewStat {
  label: string;
  value: number | string;
  helper?: string;
}

export interface AdminFlowRow {
  id: string;
  type: AdminFlowType;
  title: string;
  merchant: string;
  zone: string;
  window: string;
  status: AdminStatus;
  volume: string;
  couriers: number;
}

export interface AdminPlanningSnapshotItem {
  label: string;
  value: string;
  helper?: string;
}

export interface AdminAnnouncementsActivityRecord {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface AdminAnnouncementsDeliveriesData {
  overviewStats: AdminOverviewStat[];
  flowRows: AdminFlowRow[];
  planningSnapshot: AdminPlanningSnapshotItem[];
  liveActivity: AdminAnnouncementsActivityRecord[];
}

interface AdminAnnouncementResponse {
  id: number | string;
  title?: string;
  merchantName?: string;
  status?: string;
  zone?: string;
  startAt?: string;
  endAt?: string;
  expectedVolume?: number;
  couriersAssigned?: number;
}

interface AdminDeliveryResponse {
  id: number | string;
  reference?: string;
  merchantName?: string;
  status?: string;
  eta?: string;
  zone?: string;
  plannedWindowStart?: string;
  plannedWindowEnd?: string;
  parcels?: number;
  couriersAssigned?: number;
}

const getPaginatedData = <T>(
  result: PromiseSettledResult<AxiosResponse<PaginatedResponse<T>>>,
): PaginatedResponse<T> | undefined => (result.status === 'fulfilled' ? result.value.data : undefined);

const formatWindow = (start?: string, end?: string) => {
  if (!start && !end) {
    return '—';
  }
  const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  const startLabel = start ? dateFormatter.format(new Date(start)) : null;
  const endLabel = end ? dateFormatter.format(new Date(end)) : null;
  if (startLabel && endLabel) {
    return `${startLabel} • ${endLabel}`;
  }
  return startLabel ?? endLabel ?? '—';
};

const normalizeStatus = (status?: string): AdminStatus => {
  switch (String(status ?? '').toUpperCase()) {
    case 'ACTIVE':
    case 'IN_PROGRESS':
    case 'IN_TRANSIT':
      return 'active';
    case 'REVIEW':
      return 'review';
    case 'PENDING':
      return 'pending';
    case 'SCHEDULED':
      return 'scheduled';
    case 'PAUSED':
      return 'paused';
    case 'DELIVERED':
    case 'COMPLETED':
      return 'delivered';
    case 'CANCELLED':
    case 'CANCELED':
      return 'cancelled';
    case 'DELAYED':
    case 'LATE':
      return 'delayed';
    default:
      return 'scheduled';
  }
};

const toFlowRowFromAnnouncement = (announcement: AdminAnnouncementResponse): AdminFlowRow => ({
  id: String(announcement.id),
  type: 'announcement',
  title: announcement.title ?? 'Campagne',
  merchant: announcement.merchantName ?? '—',
  zone: announcement.zone ?? '—',
  window: formatWindow(announcement.startAt, announcement.endAt),
  status: normalizeStatus(announcement.status),
  volume: `${announcement.expectedVolume ?? 0} colis`,
  couriers: announcement.couriersAssigned ?? 0,
});

const toFlowRowFromDelivery = (delivery: AdminDeliveryResponse): AdminFlowRow => ({
  id: String(delivery.id),
  type: 'delivery',
  title: delivery.reference ?? 'Livraison',
  merchant: delivery.merchantName ?? '—',
  zone: delivery.zone ?? '—',
  window: delivery.eta ? `ETA ${new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(delivery.eta))}` : formatWindow(delivery.plannedWindowStart, delivery.plannedWindowEnd),
  status: normalizeStatus(delivery.status),
  volume: `${delivery.parcels ?? 0} colis`,
  couriers: delivery.couriersAssigned ?? 0,
});

const buildOverviewStats = (
  announcements?: PaginatedResponse<AdminAnnouncementResponse>,
  deliveries?: PaginatedResponse<AdminDeliveryResponse>,
): AdminOverviewStat[] => {
  const announcementContent = announcements?.content ?? [];
  const deliveryContent = deliveries?.content ?? [];

  const activeAnnouncements = announcementContent.filter(
    (announcement) => normalizeStatus(announcement.status) === 'active',
  ).length;
  const scheduledAnnouncements = announcementContent.filter(
    (announcement) => ['scheduled', 'review', 'pending'].includes(normalizeStatus(announcement.status)),
  ).length;
  const inProgressDeliveries = deliveryContent.filter(
    (delivery) => normalizeStatus(delivery.status) === 'active',
  ).length;
  const delayedDeliveries = deliveryContent.filter(
    (delivery) => normalizeStatus(delivery.status) === 'delayed',
  ).length;

  return [
    { label: 'Campagnes actives', value: activeAnnouncements, helper: `${scheduledAnnouncements} en préparation` },
    { label: 'Livraisons suivies', value: deliveryContent.length, helper: `${inProgressDeliveries} en cours` },
    { label: 'Retards détectés', value: delayedDeliveries, helper: 'Actions recommandées ASAP' },
    {
      label: 'Taux de complétion',
      value: `${announcements?.totalElements ? Math.round((activeAnnouncements / announcements.totalElements) * 100) : 0}%`,
      helper: `${announcements?.totalElements ?? 0} campagnes en cours`,
    },
  ];
};

const buildPlanningSnapshot = (
  announcements?: PaginatedResponse<AdminAnnouncementResponse>,
  deliveries?: PaginatedResponse<AdminDeliveryResponse>,
): AdminPlanningSnapshotItem[] => {
  const announcementContent = announcements?.content ?? [];
  const deliveryContent = deliveries?.content ?? [];

  const multiZoneAnnouncements = announcementContent.filter((announcement) => (announcement.zone ?? '').includes(',')).length;
  const criticalDeliveries = deliveryContent.filter(
    (delivery) => ['DELAYED', 'CANCELLED'].includes(String(delivery.status ?? '').toUpperCase()),
  ).length;

  const totalVolume = announcementContent.reduce((accumulator, announcement) => accumulator + (announcement.expectedVolume ?? 0), 0)
    + deliveryContent.reduce((accumulator, delivery) => accumulator + (delivery.parcels ?? 0), 0);

  return [
    { label: 'Fenêtres critiques', value: String(criticalDeliveries), helper: 'Livraisons à prioriser' },
    { label: 'Campagnes multi-zones', value: String(multiZoneAnnouncements), helper: 'Coordination hub à prévoir' },
    { label: 'Volume global', value: `${totalVolume} colis`, helper: 'Horizon 48h' },
  ];
};

const buildActivityFeed = (deliveries?: PaginatedResponse<AdminDeliveryResponse>): AdminAnnouncementsActivityRecord[] => {
  const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (deliveries?.content ?? []).slice(0, 5).map((delivery) => ({
    id: String(delivery.id),
    title: delivery.reference ?? 'Livraison',
    description: delivery.merchantName ?? delivery.zone ?? 'Suivi EcoDeli',
    timestamp: delivery.eta ? dateFormatter.format(new Date(delivery.eta)) : '—',
  }));
};

export const fetchAdminAnnouncementsDeliveriesData = async (): Promise<AdminAnnouncementsDeliveriesData> => {
  const [announcementsResult, deliveriesResult] = await Promise.allSettled([
    httpClient.get<PaginatedResponse<AdminAnnouncementResponse>>('/admin/announcements', {
      params: { page: 0, size: 25, sort: 'startAt,asc' },
    }),
    httpClient.get<PaginatedResponse<AdminDeliveryResponse>>('/admin/deliveries', {
      params: { page: 0, size: 25, sort: 'plannedWindowStart,asc' },
    }),
  ]);

  const announcementsData = getPaginatedData(announcementsResult);
  const deliveriesData = getPaginatedData(deliveriesResult);

  const flowRows: AdminFlowRow[] = [
    ...(announcementsData?.content ?? []).slice(0, 10).map(toFlowRowFromAnnouncement),
    ...(deliveriesData?.content ?? []).slice(0, 10).map(toFlowRowFromDelivery),
  ].slice(0, 10);

  return {
    overviewStats: buildOverviewStats(announcementsData, deliveriesData),
    flowRows,
    planningSnapshot: buildPlanningSnapshot(announcementsData, deliveriesData),
    liveActivity: buildActivityFeed(deliveriesData),
  };
};
