import { isAxiosError } from 'axios';
import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';

export type CourierDeliveryStatus =
  | 'ACCEPTED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED';

export interface CourierDelivery {
  id: string;
  title: string;
  clientName: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupWindow: string;
  dropoffWindow: string;
  distanceKm: number;
  earnings: number;
  status: CourierDeliveryStatus;
  vehicleType: string;
  assignmentDate: string;
  notes?: string;
}

export interface CourierDeliveryContact {
  name: string;
  phone: string;
}

export interface CourierDeliveryTimelineItem {
  status: CourierDeliveryStatus;
  label: string;
  dateLabel: string;
  completed: boolean;
  current?: boolean;
}

export interface CourierDeliveryDetail extends CourierDelivery {
  pickupContact: CourierDeliveryContact;
  dropoffContact: CourierDeliveryContact;
  packageType: string;
  weight: string;
  instructions?: string;
  timeline: CourierDeliveryTimelineItem[];
}

export interface AdvanceCourierDeliveryStatusInput {
  deliveryId: string;
  nextStatus: CourierDeliveryStatus;
}

interface CourierDeliveryClientResponse {
  name?: string;
}

interface CourierDeliveryVehicleResponse {
  type?: string;
  model?: string;
  plate?: string;
}

interface CourierDeliveryResponse {
  id: number | string;
  title?: string;
  jobTitle?: string;
  clientName?: string;
  client?: CourierDeliveryClientResponse;
  pickupAddress?: string;
  pickupCity?: string;
  dropoffAddress?: string;
  dropoffCity?: string;
  pickupWindowStart?: string;
  pickupWindowEnd?: string;
  pickupStartAt?: string;
  pickupEndAt?: string;
  dropoffWindowStart?: string;
  dropoffWindowEnd?: string;
  dropoffStartAt?: string;
  dropoffEndAt?: string;
  distanceKm?: number;
  distanceMeters?: number;
  earningsAmount?: number;
  paymentAmount?: number;
  payoutAmount?: number;
  status?: string;
  vehicleType?: string;
  vehicle?: CourierDeliveryVehicleResponse;
  assignmentDate?: string;
  assignedAt?: string;
  assignedOn?: string;
  notes?: string;
}

interface CourierDeliveryContactResponse {
  name?: string;
  phone?: string;
}

interface CourierDeliveryTimelineResponse {
  status?: string;
  label?: string;
  timestamp?: string;
  completed?: boolean;
  current?: boolean;
}

interface CourierDeliveryDetailResponse extends CourierDeliveryResponse {
  pickupContact?: CourierDeliveryContactResponse;
  pickupContactName?: string;
  pickupContactPhone?: string;
  dropoffContact?: CourierDeliveryContactResponse;
  dropoffContactName?: string;
  dropoffContactPhone?: string;
  packageType?: string;
  packageCategory?: string;
  parcelDescription?: string;
  weight?: string;
  weightKg?: number;
  packageWeight?: number;
  instructions?: string;
  timeline?: CourierDeliveryTimelineResponse[];
}

const STATUS_FLOW: CourierDeliveryStatus[] = ['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];

const STATUS_LABELS: Record<CourierDeliveryStatus, string> = {
  ACCEPTED: 'Mission acceptée',
  PICKED_UP: 'Colis collecté',
  IN_TRANSIT: 'En cours de livraison',
  DELIVERED: 'Livraison effectuée',
};

const parseDate = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const normalizeStatus = (status?: string): CourierDeliveryStatus => {
  switch (String(status ?? '').toUpperCase()) {
    case 'PICKED_UP':
    case 'PICKUP_CONFIRMED':
      return 'PICKED_UP';
    case 'IN_TRANSIT':
    case 'ON_ROUTE':
      return 'IN_TRANSIT';
    case 'DELIVERED':
      return 'DELIVERED';
    case 'ACCEPTED':
    default:
      return 'ACCEPTED';
  }
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

const formatDistance = (distanceKm?: number, distanceMeters?: number) => {
  if (typeof distanceKm === 'number' && Number.isFinite(distanceKm)) {
    return Math.round(distanceKm * 10) / 10;
  }
  if (typeof distanceMeters === 'number' && Number.isFinite(distanceMeters)) {
    return Math.round((distanceMeters / 1000) * 10) / 10;
  }
  return 0;
};

const formatWeight = (weight?: string | number) => {
  if (typeof weight === 'number' && Number.isFinite(weight)) {
    return `${weight} kg`;
  }
  if (typeof weight === 'string' && weight.trim().length > 0) {
    return weight;
  }
  return 'Poids à confirmer';
};

const formatVehicleLabel = (vehicleType?: string, vehicle?: CourierDeliveryVehicleResponse) => {
  if (vehicleType && vehicleType.trim().length > 0) {
    return vehicleType;
  }
  const parts = [vehicle?.type, vehicle?.model, vehicle?.plate]
    .filter((value) => value && value.trim().length > 0)
    .join(' - ');
  if (parts.length > 0) {
    return parts;
  }
  return 'Véhicule à confirmer';
};

const mapDeliveryBase = (payload: CourierDeliveryResponse): CourierDelivery => ({
  id: String(payload.id),
  title: payload.title ?? payload.jobTitle ?? 'Livraison EcoDeli',
  clientName: payload.clientName ?? payload.client?.name ?? 'Client EcoDeli',
  pickupAddress:
    payload.pickupAddress ?? payload.pickupCity ?? 'Adresse de collecte non renseignée',
  dropoffAddress:
    payload.dropoffAddress ?? payload.dropoffCity ?? 'Adresse de livraison non renseignée',
  pickupWindow: formatWindow(payload.pickupWindowStart ?? payload.pickupStartAt, payload.pickupWindowEnd ?? payload.pickupEndAt),
  dropoffWindow: formatWindow(payload.dropoffWindowStart ?? payload.dropoffStartAt, payload.dropoffWindowEnd ?? payload.dropoffEndAt),
  distanceKm: formatDistance(payload.distanceKm, payload.distanceMeters),
  earnings: payload.earningsAmount ?? payload.paymentAmount ?? payload.payoutAmount ?? 0,
  status: normalizeStatus(payload.status),
  vehicleType: formatVehicleLabel(payload.vehicleType, payload.vehicle),
  assignmentDate: formatDateTime(payload.assignmentDate ?? payload.assignedAt ?? payload.assignedOn),
  notes: payload.notes ?? undefined,
});

const mapContact = (
  contact?: CourierDeliveryContactResponse,
  fallbackName?: string,
  fallbackPhone?: string,
): CourierDeliveryContact => ({
  name: contact?.name ?? fallbackName ?? 'Contact à confirmer',
  phone: contact?.phone ?? fallbackPhone ?? 'N/A',
});

const syncTimelineWithStatus = (
  timeline: CourierDeliveryTimelineItem[],
  currentStatus: CourierDeliveryStatus,
) => {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  return timeline.map((step) => {
    const stepIndex = STATUS_FLOW.indexOf(step.status);
    if (stepIndex === -1) {
      return step;
    }
    return {
      ...step,
      completed: stepIndex <= currentIndex,
      current: stepIndex === currentIndex,
    };
  });
};

const mapTimeline = (
  items: CourierDeliveryTimelineResponse[] = [],
  currentStatus: CourierDeliveryStatus,
): CourierDeliveryTimelineItem[] => {
  const mapped = items.map((item) => ({
    status: normalizeStatus(item.status),
    label: item.label ?? STATUS_LABELS[normalizeStatus(item.status)],
    dateLabel: formatDateTime(item.timestamp),
    completed: Boolean(item.completed),
    current: Boolean(item.current),
  }));

  if (mapped.length === 0) {
    return syncTimelineWithStatus(
      STATUS_FLOW.map((status) => ({
        status,
        label: STATUS_LABELS[status],
        dateLabel: 'En attente',
        completed: false,
      })),
      currentStatus,
    );
  }

  const hasProgressData = mapped.some((item) => item.completed || item.current);
  if (!hasProgressData) {
    return syncTimelineWithStatus(
      mapped.map((item) => ({ ...item, completed: false, current: false })),
      currentStatus,
    );
  }

  return syncTimelineWithStatus(mapped, currentStatus);
};

const mapDeliveryDetail = (payload: CourierDeliveryDetailResponse): CourierDeliveryDetail => {
  const base = mapDeliveryBase(payload);
  const weightValue = payload.weight ?? payload.weightKg ?? payload.packageWeight;

  return {
    ...base,
    pickupContact: mapContact(
      payload.pickupContact,
      payload.pickupContactName,
      payload.pickupContactPhone,
    ),
    dropoffContact: mapContact(
      payload.dropoffContact,
      payload.dropoffContactName,
      payload.dropoffContactPhone,
    ),
    packageType: payload.packageType ?? payload.packageCategory ?? payload.parcelDescription ?? 'Marchandise',
    weight: formatWeight(weightValue),
    instructions: payload.instructions ?? payload.notes ?? base.notes,
    timeline: mapTimeline(payload.timeline, base.status),
  };
};

export const fetchCourierDeliveries = async (): Promise<CourierDelivery[]> => {
  try {
    const { data } = await httpClient.get<PaginatedResponse<CourierDeliveryResponse>>(
      '/deliveries',
      { params: { assignedToMe: true, page: 0, size: 50, sort: 'assignedAt,desc' } },
    );

    return (data.content ?? []).map(mapDeliveryBase);
  } catch (error) {
    console.error('Failed to fetch courier deliveries', error);
    throw new Error('Impossible de récupérer les livraisons en cours');
  }
};

export const fetchCourierDeliveryDetail = async (
  deliveryId: string,
): Promise<CourierDeliveryDetail> => {
  try {
    const { data } = await httpClient.get<CourierDeliveryDetailResponse>(
      `/deliveries/${deliveryId}`,
    );
    return mapDeliveryDetail(data);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Livraison introuvable');
    }
    console.error('Failed to fetch courier delivery detail', error);
    throw new Error('Impossible de récupérer les détails de la livraison');
  }
};

export const advanceCourierDeliveryStatus = async ({
  deliveryId,
  nextStatus,
}: AdvanceCourierDeliveryStatusInput): Promise<CourierDeliveryDetail> => {
  if (!nextStatus) {
    throw new Error('Statut cible manquant pour la livraison');
  }

  try {
    const { data } = await httpClient.patch<CourierDeliveryDetailResponse>(
      `/deliveries/${deliveryId}/status`,
      { status: nextStatus },
    );
    return mapDeliveryDetail(data);
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Livraison introuvable');
      }
      if (error.response?.status === 409) {
        const message = (error.response?.data as { message?: string })?.message;
        throw new Error(message ?? 'Le statut de la livraison est déjà à jour');
      }
    }

    console.error('Failed to advance courier delivery status', error);
    throw new Error('Impossible de mettre à jour le statut de la livraison');
  }
};
