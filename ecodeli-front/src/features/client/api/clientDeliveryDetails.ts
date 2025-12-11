import { isAxiosError } from 'axios';
import { httpClient } from '../../../shared/api/httpClient';
import type { DeliveryStatus } from './clientDeliveries';

export interface DeliveryTimelineItem {
  status: DeliveryStatus;
  label: string;
  dateLabel: string;
  completed: boolean;
  current?: boolean;
}

export interface DeliveryContactPoint {
  address: string;
  contactName: string;
  phone: string;
}

export interface DeliveryProofs {
  pickup: boolean;
  delivery: boolean;
}

export interface DeliveryDriver {
  name: string;
  phone: string;
  email: string;
  rating: number;
  totalDeliveries: number;
  vehicle: string;
}

export interface DeliveryPrice {
  total: number;
  base: number;
  serviceFees: number;
}

export interface DeliveryDetail {
  id: string;
  status: DeliveryStatus;
  title: string;
  typeLabel: string;
  pickupTimeLabel: string;
  estimatedDeliveryLabel: string;
  actualDeliveryLabel?: string | null;
  from: DeliveryContactPoint;
  to: DeliveryContactPoint;
  driver: DeliveryDriver;
  price: DeliveryPrice;
  proofs: DeliveryProofs;
  timeline: DeliveryTimelineItem[];
}

interface AddressResponse {
  line1?: string;
  line2?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
}

interface ClientDeliveryContactResponse {
  address?: string;
  contactName?: string;
  phoneNumber?: string;
  name?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  postalCode?: string;
  city?: string;
  addressLine1?: string;
  addressLine2?: string;
}

interface ClientDeliveryDriverResponse {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  rating?: number;
  totalDeliveries?: number;
  vehicleType?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
  name?: string;
  phone?: string;
  vehicleLabel?: string;
}

interface ClientDeliveryPriceResponse {
  totalAmount?: number;
  baseAmount?: number;
  serviceFeeAmount?: number;
  totalCents?: number;
  baseCents?: number;
  serviceFeeCents?: number;
}

interface ClientDeliveryProofsResponse {
  pickupConfirmed?: boolean;
  deliveryConfirmed?: boolean;
  pickupProofReceived?: boolean;
  deliveryProofReceived?: boolean;
}

interface ClientDeliveryTimelineResponse {
  status?: string;
  label?: string;
  timestamp?: string;
  completed?: boolean;
  currentStep?: boolean;
  timeRangeLabel?: string;
}

interface ClientDeliveryDetailResponse {
  id: number | string;
  status?: string;
  reference?: string;
  type?: string;
  pickupTimestamp?: string;
  estimatedDeliveryTimestamp?: string;
  deliveredAt?: string;
  pickup?: ClientDeliveryContactResponse;
  dropoff?: ClientDeliveryContactResponse;
  driver?: ClientDeliveryDriverResponse;
  price?: ClientDeliveryPriceResponse;
  proofs?: ClientDeliveryProofsResponse;
  timeline?: ClientDeliveryTimelineResponse[];
  fromAddress?: AddressResponse;
  toAddress?: AddressResponse;
  pickupAt?: string;
  dropoffAt?: string;
  pickupWindowStart?: string;
  pickupWindowEnd?: string;
  deliveryWindowStart?: string;
  deliveryWindowEnd?: string;
  amountCents?: number;
  totalAmount?: number;
}

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

const formatDateTime = (value?: string) => {
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
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const mapContact = (contact?: ClientDeliveryContactResponse): DeliveryContactPoint => ({
  address:
    contact?.address ??
    contact?.line1 ??
    contact?.addressLine1 ??
    'Adresse non renseignée',
  contactName: contact?.contactName ?? contact?.name ?? 'Contact indisponible',
  phone: contact?.phoneNumber ?? contact?.phone ?? 'N/A',
});

const buildVehicleLabel = (driver?: ClientDeliveryDriverResponse) => {
  const segments = [driver?.vehicleType, driver?.vehicleModel, driver?.vehiclePlate]
    .filter((segment) => Boolean(segment))
    .join(' - ');
  return segments.length > 0 ? segments : 'Véhicule à confirmer';
};

const mapDriver = (driver?: ClientDeliveryDriverResponse): DeliveryDriver => ({
  name: driver?.fullName ?? driver?.name ?? 'Livreur EcoDeli',
  phone: driver?.phoneNumber ?? driver?.phone ?? 'N/A',
  email: driver?.email ?? 'contact@ecodeli.fr',
  rating: driver?.rating ?? 0,
  totalDeliveries: driver?.totalDeliveries ?? 0,
  vehicle: driver?.vehicleLabel ?? buildVehicleLabel(driver),
});

const mapPrice = (price?: ClientDeliveryPriceResponse): DeliveryPrice => ({
  total:
    typeof price?.totalCents === 'number' && Number.isFinite(price.totalCents)
      ? price.totalCents / 100
      : price?.totalAmount ?? 0,
  base:
    typeof price?.baseCents === 'number' && Number.isFinite(price.baseCents)
      ? price.baseCents / 100
      : price?.baseAmount ?? price?.totalAmount ?? 0,
  serviceFees:
    typeof price?.serviceFeeCents === 'number' && Number.isFinite(price.serviceFeeCents)
      ? price.serviceFeeCents / 100
      : price?.serviceFeeAmount ?? 0,
});

const mapProofs = (proofs?: ClientDeliveryProofsResponse): DeliveryProofs => ({
  pickup: Boolean(proofs?.pickupConfirmed ?? proofs?.pickupProofReceived),
  delivery: Boolean(proofs?.deliveryConfirmed ?? proofs?.deliveryProofReceived),
});

const mapTimeline = (items: ClientDeliveryTimelineResponse[] = []): DeliveryTimelineItem[] =>
  items.map((item) => ({
    status: normalizeStatus(item.status),
    label: item.label ?? 'Étape de livraison',
    dateLabel: item.timeRangeLabel ?? formatDateTime(item.timestamp),
    completed: Boolean(item.completed),
    current: Boolean(item.currentStep),
  }));

const buildTitle = (payload: ClientDeliveryDetailResponse) => {
  const pickup =
    payload.pickup?.address ??
    payload.pickup?.line1 ??
    payload.pickup?.addressLine1 ??
    payload.fromAddress?.line1;
  const dropoff =
    payload.dropoff?.address ??
    payload.dropoff?.line1 ??
    payload.dropoff?.addressLine1 ??
    payload.toAddress?.line1;
  if (pickup && dropoff) {
    return `${pickup} → ${dropoff}`;
  }
  return payload.reference ?? 'Livraison EcoDeli';
};

const mapDeliveryDetail = (payload: ClientDeliveryDetailResponse): DeliveryDetail => ({
  id: String(payload.id),
  status: normalizeStatus(payload.status),
  title: buildTitle(payload),
  typeLabel: payload.type ?? 'Livraison',
  pickupTimeLabel: formatDateTime(
    payload.pickupTimestamp ?? payload.pickupAt ?? payload.pickupWindowStart,
  ),
  estimatedDeliveryLabel: formatDateTime(
    payload.estimatedDeliveryTimestamp ?? payload.deliveryWindowStart ?? payload.dropoffAt,
  ),
  actualDeliveryLabel: payload.deliveredAt ? formatDateTime(payload.deliveredAt) : null,
  from: mapContact(
    payload.pickup ?? {
      address: payload.fromAddress?.line1,
      line1: payload.fromAddress?.line1,
      line2: payload.fromAddress?.line2,
      postalCode: payload.fromAddress?.postalCode,
      city: payload.fromAddress?.city,
    },
  ),
  to: mapContact(
    payload.dropoff ?? {
      address: payload.toAddress?.line1,
      line1: payload.toAddress?.line1,
      line2: payload.toAddress?.line2,
      postalCode: payload.toAddress?.postalCode,
      city: payload.toAddress?.city,
    },
  ),
  driver: mapDriver(payload.driver),
  price: mapPrice({
    totalAmount: payload.price?.totalAmount ?? payload.totalAmount,
    totalCents: payload.price?.totalCents ?? payload.amountCents,
    baseAmount: payload.price?.baseAmount,
    baseCents: payload.price?.baseCents,
    serviceFeeAmount: payload.price?.serviceFeeAmount,
    serviceFeeCents: payload.price?.serviceFeeCents,
  }),
  proofs: mapProofs(payload.proofs),
  timeline: mapTimeline(payload.timeline),
});

export const fetchClientDeliveryDetail = async (
  id: string,
): Promise<DeliveryDetail> => {
  try {
    const { data } = await httpClient.get<ClientDeliveryDetailResponse>(`/deliveries/${id}`);
    return mapDeliveryDetail(data);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Livraison introuvable');
    }
    console.error('Failed to fetch client delivery detail', error);
    throw new Error('Impossible de récupérer les détails de la livraison');
  }
};
