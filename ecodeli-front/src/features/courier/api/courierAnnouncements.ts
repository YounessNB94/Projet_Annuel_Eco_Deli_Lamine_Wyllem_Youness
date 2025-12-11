import { isAxiosError } from 'axios';
import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';

export type CourierAnnouncementStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'ASSIGNED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CourierAvailableAnnouncement {
  id: string;
  title: string;
  type: string;
  origin: string;
  destination: string;
  pickupWindow: string;
  deliveryWindow: string;
  distanceKm: number;
  budget: number;
  carbonSavingKg: number;
  clientName: string;
  clientRating: number;
  equipment?: string[];
  status: CourierAnnouncementStatus;
}

export interface CourierAssignmentResult {
  announcementId: string;
  assignmentId: string;
  assignedAt: string;
  pickupEta: string;
  message: string;
}

interface CourierAnnouncementClientResponse {
  name?: string;
  rating?: number;
}

interface CourierAnnouncementResponse {
  id: number | string;
  title?: string;
  category?: string;
  type?: string;
  pickupAddress?: string;
  pickupCity?: string;
  pickupWindowStart?: string;
  pickupWindowEnd?: string;
  pickupStartAt?: string;
  pickupEndAt?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryWindowStart?: string;
  deliveryWindowEnd?: string;
  deliveryStartAt?: string;
  deliveryEndAt?: string;
  distanceKm?: number;
  distanceMeters?: number;
  budgetAmount?: number;
  budget?: number;
  currency?: string;
  carbonSavingKg?: number;
  co2SavedKg?: number;
  clientName?: string;
  clientRating?: number;
  client?: CourierAnnouncementClientResponse;
  requiredEquipment?: string[];
  equipment?: string[];
  status?: string;
}

interface CourierAssignmentResponse {
  announcementId?: number | string;
  assignmentId?: number | string;
  assignment?: { id?: number | string };
  assignedAt?: string;
  assignedOn?: string;
  pickupEta?: string;
  pickupEtaTimestamp?: string;
  pickupWindowStart?: string;
  pickupWindowEnd?: string;
  pickupStartAt?: string;
  pickupEndAt?: string;
  message?: string;
}

const normalizeStatus = (status?: string): CourierAnnouncementStatus => {
  switch (String(status ?? '').toUpperCase()) {
    case 'DRAFT':
      return 'DRAFT';
    case 'ASSIGNED':
      return 'ASSIGNED';
    case 'COMPLETED':
    case 'DELIVERED':
      return 'COMPLETED';
    case 'CANCELLED':
    case 'CANCELED':
      return 'CANCELLED';
    case 'PUBLISHED':
    default:
      return 'PUBLISHED';
  }
};

const parseDate = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const formatLocation = (primary?: string, fallback?: string) => {
  if (primary && primary.trim().length > 0) {
    return primary;
  }
  if (fallback && fallback.trim().length > 0) {
    return fallback;
  }
  return 'Adresse non renseignée';
};

const formatWindow = (startValue?: string, endValue?: string) => {
  const start = parseDate(startValue);
  const end = parseDate(endValue);
  const dayFormatter = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
  });
  const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (!start && !end) {
    return 'Créneau à confirmer';
  }

  if (start && end) {
    const sameDay = start.toDateString() === end.toDateString();
    if (sameDay) {
      return `${dayFormatter.format(start)} • ${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
    }
    return `${dayFormatter.format(start)} ${timeFormatter.format(start)} → ${dayFormatter.format(end)} ${timeFormatter.format(end)}`;
  }

  const reference = start ?? end;
  if (!reference) {
    return 'Créneau à confirmer';
  }
  return `${dayFormatter.format(reference)} • ${timeFormatter.format(reference)}`;
};

const formatDistance = (distanceKm?: number, distanceMeters?: number) => {
  if (typeof distanceKm === 'number' && Number.isFinite(distanceKm)) {
    return Math.round(distanceKm * 10) / 10;
  }
  if (typeof distanceMeters === 'number' && Number.isFinite(distanceMeters)) {
    return Math.round((distanceMeters / 1000) * 10) / 10;
  }
  return 0;
};

const mapAnnouncement = (payload: CourierAnnouncementResponse): CourierAvailableAnnouncement => {
  const pickupWindow = formatWindow(
    payload.pickupWindowStart ?? payload.pickupStartAt,
    payload.pickupWindowEnd ?? payload.pickupEndAt,
  );
  const deliveryWindow = formatWindow(
    payload.deliveryWindowStart ?? payload.deliveryStartAt,
    payload.deliveryWindowEnd ?? payload.deliveryEndAt,
  );
  const equipment = (payload.requiredEquipment ?? payload.equipment)?.filter(Boolean);

  return {
    id: String(payload.id),
    title: payload.title ?? 'Annonce EcoDeli',
    type: payload.category ?? payload.type ?? 'Livraison',
    origin: formatLocation(payload.pickupAddress, payload.pickupCity),
    destination: formatLocation(payload.deliveryAddress, payload.deliveryCity),
    pickupWindow,
    deliveryWindow,
    distanceKm: formatDistance(payload.distanceKm, payload.distanceMeters),
    budget: payload.budgetAmount ?? payload.budget ?? 0,
    carbonSavingKg: payload.carbonSavingKg ?? payload.co2SavedKg ?? 0,
    clientName: payload.client?.name ?? payload.clientName ?? 'Client EcoDeli',
    clientRating: payload.client?.rating ?? payload.clientRating ?? 0,
    equipment: equipment && equipment.length > 0 ? equipment : undefined,
    status: normalizeStatus(payload.status),
  };
};

const formatDateTime = (value?: string) => {
  const date = parseDate(value);
  if (!date) {
    return '—';
  }
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const mapAssignment = (
  payload: CourierAssignmentResponse,
  fallbackAnnouncementId: string,
): CourierAssignmentResult => {
  const pickupWindow = formatWindow(
    payload.pickupWindowStart ?? payload.pickupStartAt,
    payload.pickupWindowEnd ?? payload.pickupEndAt,
  );
  const pickupEta = payload.pickupEta ?? payload.pickupEtaTimestamp;
  const formattedPickupEta = pickupEta ? formatDateTime(pickupEta) : pickupWindow;

  const assignmentIdSource =
    payload.assignmentId ?? payload.assignment?.id ?? `ASSIGN-${Math.floor(Date.now() % 100000)}`;

  return {
    announcementId: String(payload.announcementId ?? fallbackAnnouncementId),
    assignmentId: String(assignmentIdSource),
    assignedAt: formatDateTime(payload.assignedAt ?? payload.assignedOn ?? new Date().toISOString()),
    pickupEta: formattedPickupEta !== '—' ? formattedPickupEta : pickupWindow,
    message:
      payload.message ?? "Vous avez pris en charge cette annonce. Le client a été notifié.",
  };
};

export const fetchCourierAvailableAnnouncements = async (): Promise<CourierAvailableAnnouncement[]> => {
  try {
    const { data } = await httpClient.get<PaginatedResponse<CourierAnnouncementResponse>>(
      '/announcements',
      {
        params: {
          type: 'DELIVERY',
          status: 'PUBLISHED',
          page: 0,
          size: 50,
          sort: 'pickupWindowStart,asc',
        },
      },
    );

    return (data.content ?? []).map(mapAnnouncement);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    console.error('Failed to fetch courier announcements', error);
    throw new Error("Impossible de récupérer les annonces disponibles");
  }
};

const extractErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const maybeMessage = (error.response?.data as { message?: string })?.message;
    if (maybeMessage && typeof maybeMessage === 'string') {
      return maybeMessage;
    }
  }
  return undefined;
};

export const takeOverCourierAnnouncement = async (
  announcementId: string,
): Promise<CourierAssignmentResult> => {
  try {
    const { data } = await httpClient.post<CourierAssignmentResponse>(
      `/announcements/${announcementId}/assignments`,
    );
    return mapAssignment(data ?? {}, announcementId);
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Annonce introuvable');
      }
      if (error.response?.status === 409) {
        throw new Error(extractErrorMessage(error) ?? "Cette annonce n'est plus disponible");
      }
    }
    console.error('Failed to take over courier announcement', error);
    throw new Error("Impossible de prendre en charge l'annonce");
  }
};
