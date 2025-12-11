import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';

export type DeliveryStatus = 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';

export interface Delivery {
  id: string;
  origin: string;
  destination: string;
  courierName: string;
  date: string;
  estimatedTime: string;
  price: number;
  status: DeliveryStatus;
}

interface AddressResponse {
  line1?: string;
  line2?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
}

interface ClientDeliveryCourierResponse {
  fullName?: string;
  name?: string;
}

interface ClientDeliveryResponse {
  id: number | string;
  pickupAddress?: string;
  deliveryAddress?: string;
  courierName?: string;
  courier?: ClientDeliveryCourierResponse;
  assignedCourier?: ClientDeliveryCourierResponse;
  deliveryDate?: string;
  scheduledAt?: string;
  eta?: string;
  estimatedArrivalAt?: string;
  estimatedMinutes?: number;
  estimatedDurationMinutes?: number;
  priceAmount?: number;
  priceCents?: number;
  totalAmount?: number;
  status?: string;
  deliveryStatus?: string;
  fromAddress?: AddressResponse;
  toAddress?: AddressResponse;
}

type DeliveryCollectionResponse =
  | PaginatedResponse<ClientDeliveryResponse>
  | ClientDeliveryResponse[];

const extractDeliveries = (
  data: DeliveryCollectionResponse,
): ClientDeliveryResponse[] => (Array.isArray(data) ? data : data.content ?? []);

const normalizeStatus = (status?: string): DeliveryStatus => {
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

const formatAddress = (address?: AddressResponse, fallback?: string) => {
  const parts = [address?.line1 ?? fallback, address?.postalCode, address?.city]
    .filter((value) => value && value.trim().length > 0);
  if (parts.length > 0) {
    return parts.join(', ');
  }
  return fallback ?? 'Adresse non renseignée';
};

const formatDate = (value?: string) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatEta = (eta?: string, minutes?: number, status?: string) => {
  if (String(status ?? '').toUpperCase() === 'DELIVERED') {
    return 'Livré';
  }
  if (eta) {
    const date = new Date(eta);
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    }
    return eta;
  }
  if (typeof minutes === 'number' && Number.isFinite(minutes)) {
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    if (hours === 0) {
      return `${remaining} min`;
    }
    return `${hours}h ${remaining.toString().padStart(2, '0')}min`;
  }
  return 'En attente';
};

const pickCourierName = (payload: ClientDeliveryResponse) =>
  payload.courierName ?? payload.courier?.fullName ?? payload.courier?.name ?? payload.assignedCourier?.fullName ?? payload.assignedCourier?.name ?? 'Livreur à attribuer';

const toAmount = (cents?: number, fallback?: number) => {
  if (typeof cents === 'number' && Number.isFinite(cents)) {
    return cents / 100;
  }
  if (typeof fallback === 'number' && Number.isFinite(fallback)) {
    return fallback;
  }
  return 0;
};

const mapDelivery = (payload: ClientDeliveryResponse): Delivery => ({
  id: String(payload.id),
  origin: formatAddress(payload.fromAddress, payload.pickupAddress),
  destination: formatAddress(payload.toAddress, payload.deliveryAddress),
  courierName: pickCourierName(payload),
  date: formatDate(payload.deliveryDate ?? payload.scheduledAt ?? payload.eta ?? payload.estimatedArrivalAt),
  estimatedTime: formatEta(
    payload.eta ?? payload.estimatedArrivalAt,
    payload.estimatedMinutes ?? payload.estimatedDurationMinutes,
    payload.status ?? payload.deliveryStatus,
  ),
  price: toAmount(payload.priceCents, payload.priceAmount ?? payload.totalAmount),
  status: normalizeStatus(payload.status ?? payload.deliveryStatus),
});

export const fetchClientDeliveries = async (): Promise<Delivery[]> => {
  try {
    const { data } = await httpClient.get<DeliveryCollectionResponse>('/deliveries', {
      params: { mine: true, sort: 'deliveryDate,desc' },
    });

    return extractDeliveries(data).map(mapDelivery);
  } catch (error) {
    console.error('Failed to fetch client deliveries', error);
    throw new Error('Impossible de récupérer les livraisons client');
  }
};
