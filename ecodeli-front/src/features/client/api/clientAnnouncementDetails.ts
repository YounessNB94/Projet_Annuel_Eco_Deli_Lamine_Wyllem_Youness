import { isAxiosError } from 'axios';
import { httpClient } from '../../../shared/api/httpClient';
import type { AnnouncementStatus } from './clientAnnouncements';

export type AnnouncementTimelineStatus = 'CREATED' | 'PUBLISHED' | 'CANCELLED';

export interface AnnouncementTimelineItem {
  status: AnnouncementTimelineStatus;
  label: string;
  dateLabel: string;
  completed: boolean;
  driver?: string;
}

export interface AnnouncementDriverSummary {
  name: string;
  rating: number;
  deliveries: number;
  phone?: string;
  email?: string;
}

export interface AnnouncementDetail {
  id: string;
  title: string;
  status: AnnouncementStatus;
  type: string;
  createdAt: string;
  fromAddress: string;
  toAddress: string;
  pickupDate: string;
  pickupTime: string;
  deliveryDate?: string;
  deliveryTime?: string;
  budget: number;
  currency: string;
  description?: string;
  driver?: AnnouncementDriverSummary;
  deliveryId?: string;
  timeline: AnnouncementTimelineItem[];
}

interface AddressDto {
  line1?: string;
  line2?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
}

interface ClientAnnouncementDetailResponse {
  id: number | string;
  title?: string;
  status?: string;
  type?: string;
  description?: string;
  fromAddress?: AddressDto;
  toAddress?: AddressDto;
  earliestAt?: string;
  latestAt?: string;
  budgetCents?: number;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
}

const normalizeStatus = (status?: string): AnnouncementStatus => {
  switch (String(status ?? '').toUpperCase()) {
    case 'DRAFT':
      return 'DRAFT';
    case 'CANCELLED':
    case 'CANCELED':
      return 'CANCELLED';
    case 'PUBLISHED':
    default:
      return 'PUBLISHED';
  }
};

const formatDate = (value?: string) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatTimeRange = (start?: string, end?: string) => {
  if (!start && !end) {
    return '—';
  }
  const formatTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (start && end) {
    return `${formatTime(start)} - ${formatTime(end)}`;
  }

  return formatTime(start ?? end ?? '');
};

const toBudget = (cents?: number) => {
  if (typeof cents === 'number' && Number.isFinite(cents)) {
    return cents / 100;
  }
  return 0;
};

const mapTypeLabel = (type?: string) => {
  switch (String(type ?? '').toUpperCase()) {
    case 'PARCEL_TRANSPORT':
      return 'Transport de colis';
    case 'ON_DEMAND_SERVICE':
      return 'Service à la demande';
    default:
      return 'Annonce';
  }
};

const formatAddress = (address?: AddressDto) => {
  const parts = [address?.line1, address?.postalCode, address?.city]
    .filter((value) => value && value.trim().length > 0);

  if (parts.length > 0) {
    return parts.join(', ');
  }

  return 'Adresse non renseignée';
};

const buildTimeline = (
  payload: ClientAnnouncementDetailResponse,
  status: AnnouncementStatus,
): AnnouncementTimelineItem[] => {
  const createdAt = payload.createdAt ?? payload.updatedAt;
  const updatedAt = payload.updatedAt ?? payload.createdAt;

  const items: AnnouncementTimelineItem[] = [
    {
      status: 'CREATED',
      label: "Annonce créée",
      dateLabel: formatDateTime(createdAt),
      completed: true,
    },
  ];

  const publicationStep: AnnouncementTimelineItem = {
    status: 'PUBLISHED',
    label: 'Annonce publiée',
    dateLabel: status === 'DRAFT' ? 'En attente de publication' : formatDateTime(updatedAt),
    completed: status !== 'DRAFT',
  };

  items.push(publicationStep);

  if (status === 'CANCELLED') {
    items.push({
      status: 'CANCELLED',
      label: 'Annonce annulée',
      dateLabel: formatDateTime(updatedAt),
      completed: true,
    });
  }

  return items;
};

const mapAnnouncementDetail = (payload: ClientAnnouncementDetailResponse): AnnouncementDetail => {
  const status = normalizeStatus(payload.status);
  const earliestAt = payload.earliestAt;
  const latestAt = payload.latestAt;
  const pickupDate = earliestAt ? formatDate(earliestAt) : 'À planifier';
  const pickupTime = earliestAt || latestAt ? formatTimeRange(earliestAt, latestAt) : 'À définir';
  const deliveryDate = latestAt ? formatDate(latestAt) : undefined;
  const deliveryTime = latestAt ? formatTimeRange(latestAt, latestAt) : undefined;

  return {
    id: String(payload.id),
    title: payload.title ?? 'Annonce EcoDeli',
    status,
    type: mapTypeLabel(payload.type),
    createdAt: formatDateTime(payload.createdAt),
    fromAddress: formatAddress(payload.fromAddress),
    toAddress: formatAddress(payload.toAddress),
    pickupDate,
    pickupTime,
    deliveryDate,
    deliveryTime,
    budget: toBudget(payload.budgetCents),
    currency: payload.currency ?? 'EUR',
    description: payload.description,
    timeline: buildTimeline(payload, status),
  };
};

export const fetchClientAnnouncementDetail = async (
  announcementId: string,
): Promise<AnnouncementDetail> => {
  try {
    const { data } = await httpClient.get<ClientAnnouncementDetailResponse>(
      `/announcements/${announcementId}`,
    );
    return mapAnnouncementDetail(data);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Annonce introuvable');
    }
    console.error('Failed to fetch client announcement detail', error);
    throw new Error('Impossible de récupérer les détails de l\'annonce');
  }
};
