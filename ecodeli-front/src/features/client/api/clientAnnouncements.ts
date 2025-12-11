import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';

export type AnnouncementStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';

export interface Announcement {
  id: string;
  title: string;
  type: string;
  origin: string;
  destination: string;
  createdAt: string;
  dueDate: string;
  budget: number;
  currency: string;
  status: AnnouncementStatus;
}

interface AddressDto {
  line1?: string;
  line2?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
}

interface ClientAnnouncementResponse {
  id: number | string;
  title?: string;
  type?: string;
  status?: string;
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

type AnnouncementCollectionResponse =
  | PaginatedResponse<ClientAnnouncementResponse>
  | ClientAnnouncementResponse[];

const extractAnnouncements = (
  data: AnnouncementCollectionResponse,
): ClientAnnouncementResponse[] => (Array.isArray(data) ? data : data.content ?? []);

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

const formatAddress = (address?: AddressDto) => {
  const parts = [address?.line1, address?.postalCode, address?.city]
    .filter((value) => value && value.trim().length > 0);

  if (parts.length > 0) {
    return parts.join(', ');
  }

  return 'Adresse non renseignée';
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

const toBudget = (cents?: number) => {
  if (typeof cents === 'number' && Number.isFinite(cents)) {
    return cents / 100;
  }
  return 0;
};

const mapAnnouncement = (payload: ClientAnnouncementResponse): Announcement => ({
  id: String(payload.id),
  title: payload.title ?? 'Annonce EcoDeli',
  type: mapTypeLabel(payload.type),
  origin: formatAddress(payload.fromAddress),
  destination: formatAddress(payload.toAddress),
  createdAt: payload.createdAt ?? '',
  dueDate: payload.latestAt ?? payload.earliestAt ?? '',
  budget: toBudget(payload.budgetCents),
  currency: payload.currency ?? 'EUR',
  status: normalizeStatus(payload.status),
});

export const fetchClientAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const { data } = await httpClient.get<AnnouncementCollectionResponse>('/announcements', {
      params: { mine: true, sort: 'createdAt,desc' },
    });

    return extractAnnouncements(data).map(mapAnnouncement);
  } catch (error) {
    console.error('Failed to fetch client announcements', error);
    throw new Error('Impossible de récupérer les annonces client');
  }
};
