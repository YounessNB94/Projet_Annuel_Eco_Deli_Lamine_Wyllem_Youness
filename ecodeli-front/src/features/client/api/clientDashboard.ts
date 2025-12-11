import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { Announcement } from './clientAnnouncements';
import { fetchClientAnnouncements } from './clientAnnouncements';
import type { Delivery } from './clientDeliveries';
import { fetchClientDeliveries } from './clientDeliveries';
import type { ClientPayment, ClientPaymentStatus } from './clientPayments';
import { fetchClientPayments } from './clientPayments';
import type { AnnouncementStatus } from './clientAnnouncements';
import type { DeliveryStatus } from './clientDeliveries';

export type ClientDashboardStatIconKey = 'announcements' | 'deliveries' | 'payments';

export interface ClientDashboardStatRecord {
  label: string;
  value: number;
  color: string;
  icon: ClientDashboardStatIconKey;
}

export interface ClientDashboardAnnouncementRecord {
  id: string;
  title: string;
  type: string;
  deadline: string;
  budget: string;
  status: AnnouncementStatus;
}

export interface ClientDashboardDeliveryRecord {
  id: string;
  title: string;
  driver: string;
  from: string;
  to: string;
  estimatedTime: string;
  status: DeliveryStatus;
}

export interface ClientDashboardPaymentRecord {
  id: string;
  title: string;
  dueDate: string;
  amount: string;
}

export interface ClientDashboardData {
  stats: ClientDashboardStatRecord[];
  announcements: ClientDashboardAnnouncementRecord[];
  deliveries: ClientDashboardDeliveryRecord[];
  payments: ClientDashboardPaymentRecord[];
}

interface AddressResponse {
  line1?: string;
  line2?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
}

interface ClientDashboardAnnouncementResponse {
  id: number | string;
  title?: string;
  type?: string;
  category?: string;
  status?: string;
  fromAddress?: AddressResponse;
  toAddress?: AddressResponse;
  earliestAt?: string;
  latestAt?: string;
  dueDate?: string;
  deadline?: string;
  budget?: number;
  budgetAmount?: number;
  currency?: string;
  budgetCents?: number;
  pickupAddress?: string;
  deliveryAddress?: string;
  originCity?: string;
  destinationCity?: string;
}

interface ClientDashboardDeliveryCourierResponse {
  fullName?: string;
  name?: string;
}

interface ClientDashboardDeliveryResponse {
  id: number | string;
  title?: string;
  driver?: string;
  courierName?: string;
  courier?: ClientDashboardDeliveryCourierResponse;
  assignedCourier?: ClientDashboardDeliveryCourierResponse;
  from?: string;
  pickupAddress?: string;
  fromAddress?: AddressResponse;
  pickupCity?: string;
  to?: string;
  deliveryAddress?: string;
  toAddress?: AddressResponse;
  deliveryCity?: string;
  eta?: string;
  estimatedDurationMinutes?: number;
  estimatedTime?: string;
  status?: string;
  deliveryStatus?: string;
  estimatedArrivalAt?: string;
  pickupWindowStart?: string;
  pickupWindowEnd?: string;
}

interface ClientDashboardPaymentResponse {
  id: number | string;
  title?: string;
  reference?: string;
  dueDate?: string;
  dueOn?: string;
  issuedAt?: string;
  amount?: number;
  total?: number;
  currency?: string;
  totalAmount?: number;
  status?: string;
  totalCents?: number;
  amountCents?: number;
  state?: string;
}

type AnnouncementCollectionResponse =
  | PaginatedResponse<ClientDashboardAnnouncementResponse>
  | ClientDashboardAnnouncementResponse[];

type DeliveryCollectionResponse =
  | PaginatedResponse<ClientDashboardDeliveryResponse>
  | ClientDashboardDeliveryResponse[];

type PaymentCollectionResponse =
  | PaginatedResponse<ClientDashboardPaymentResponse>
  | ClientDashboardPaymentResponse[];

const extractContent = <T>(data: PaginatedResponse<T> | T[] | undefined): T[] => {
  if (!data) {
    console.log('This line will never be executed');
    return [];
  }
  console.log('This line will always be executed');
  console.log(data);
  
  
  return Array.isArray(data) ? data : data.content ?? [];
};

const parseDate = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const formatDate = (value?: string) => {
  const date = parseDate(value);
  if (!date) {
    return 'Date à confirmer';
  }
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatCurrency = (value?: number, currency = 'EUR') => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '0,00 €';
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const normalizeAnnouncementStatus = (status?: string): AnnouncementStatus => {
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

const normalizeDeliveryStatus = (status?: string): DeliveryStatus => {
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

const normalizePaymentStatus = (status?: string): ClientPaymentStatus => {
  switch (String(status ?? '').toLowerCase()) {
    case 'processing':
    case 'in_progress':
    case 'pending':
      return 'processing';
    case 'paid':
    case 'completed':
      return 'paid';
    case 'failed':
    case 'error':
      return 'failed';
    case 'due':
    case 'awaiting_payment':
    default:
      return 'due';
  }
};

const formatDuration = (minutes?: number, fallback?: string) => {
  if (fallback && fallback.trim().length > 0) {
    return fallback;
  }
  if (typeof minutes !== 'number' || Number.isNaN(minutes)) {
    return 'Durée à confirmer';
  }
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) {
    return `${remainder} min`;
  }
  return `${hours}h ${remainder.toString().padStart(2, '0')}min`;
};

const toAmount = (cents?: number, fallback?: number) => {
  if (typeof cents === 'number' && Number.isFinite(cents)) {
    return cents / 100;
  }
  if (typeof fallback === 'number' && Number.isFinite(fallback)) {
    return fallback;
  }
  return 0;
};

const formatAddress = (
  address?: AddressResponse,
  fallbackLine?: string,
  fallbackCity?: string,
) => {
  const parts = [
    address?.line1 ?? fallbackLine,
    address?.postalCode,
    address?.city ?? fallbackCity,
  ].filter((value) => value && value.trim().length > 0);

  if (parts.length > 0) {
    return parts.join(', ');
  }
  return fallbackLine ?? fallbackCity ?? 'Lieu à confirmer';
};

const mapAnnouncementType = (type?: string, fallback?: string) => {
  switch (String(type ?? fallback ?? '').toUpperCase()) {
    case 'PARCEL_TRANSPORT':
      return 'Transport de colis';
    case 'ON_DEMAND_SERVICE':
      return 'Service à la demande';
    default:
      return fallback ?? 'Livraison';
  }
};

const pickCourierName = (payload: ClientDashboardDeliveryResponse) =>
  payload.courierName ?? payload.courier?.fullName ?? payload.courier?.name ?? payload.assignedCourier?.fullName ?? payload.assignedCourier?.name ?? payload.driver ?? 'Livreur EcoDeli';

const mapAnnouncement = (
  payload: ClientDashboardAnnouncementResponse,
): ClientDashboardAnnouncementRecord => ({
  id: String(payload.id),
  title: payload.title ?? 'Annonce EcoDeli',
  type: mapAnnouncementType(payload.type, payload.category),
  deadline: formatDate(payload.latestAt ?? payload.dueDate ?? payload.deadline),
  budget: formatCurrency(
    toAmount(payload.budgetCents, payload.budgetAmount ?? payload.budget),
    payload.currency ?? 'EUR',
  ),
  status: normalizeAnnouncementStatus(payload.status),
});

const mapDelivery = (payload: ClientDashboardDeliveryResponse): ClientDashboardDeliveryRecord => ({
  id: String(payload.id),
  title: payload.title ?? 'Livraison EcoDeli',
  driver: pickCourierName(payload),
  from: formatAddress(payload.fromAddress, payload.from ?? payload.pickupAddress, payload.pickupCity),
  to: formatAddress(payload.toAddress, payload.to ?? payload.deliveryAddress, payload.deliveryCity),
  estimatedTime: formatDuration(
    payload.estimatedDurationMinutes,
    payload.estimatedTime ?? payload.eta ?? payload.estimatedArrivalAt,
  ),
  status: normalizeDeliveryStatus(payload.status ?? payload.deliveryStatus),
});

const mapPayment = (payload: ClientDashboardPaymentResponse): ClientDashboardPaymentRecord => ({
  id: String(payload.id),
  title: payload.title ?? payload.reference ?? 'Paiement EcoDeli',
  dueDate: formatDate(payload.dueDate ?? payload.dueOn ?? payload.issuedAt),
  amount: formatCurrency(
    toAmount(payload.totalCents ?? payload.amountCents, payload.amount ?? payload.total ?? payload.totalAmount),
    payload.currency ?? 'EUR',
  ),
});

const buildStatsFromFallback = (
  announcements: Announcement[],
  deliveries: Delivery[],
  payments: ClientPayment[],
): ClientDashboardStatRecord[] => [
  {
    label: 'Annonces actives',
    value: announcements.filter((item) => item.status === 'PUBLISHED').length,
    color: '#2E7D32',
    icon: 'announcements',
  },
  {
    label: 'Livraisons en cours',
    value: deliveries.filter((item) => item.status !== 'DELIVERED').length,
    color: '#0277BD',
    icon: 'deliveries',
  },
  {
    label: 'En attente de paiement',
    value: payments.filter((item) => item.status === 'due' || item.status === 'processing').length,
    color: '#F57C00',
    icon: 'payments',
  },
];

const buildAnnouncementsFromFallback = (announcements: Announcement[]) =>
  announcements.slice(0, 5).map((item) => ({
    id: item.id,
    title: item.title,
    type: item.type,
    deadline: formatDate(item.dueDate),
    budget: formatCurrency(item.budget, item.currency ?? 'EUR'),
    status: item.status,
  }));

const buildDeliveriesFromFallback = (deliveries: Delivery[]) =>
  deliveries.slice(0, 5).map((item) => ({
    id: item.id,
    title: `${item.origin} → ${item.destination}`,
    driver: item.courierName,
    from: item.origin,
    to: item.destination,
    estimatedTime: item.estimatedTime,
    status: item.status,
  }));

const buildPaymentsFromFallback = (payments: ClientPayment[]) =>
  payments.slice(0, 5).map((item) => ({
    id: item.id,
    title: item.deliveryTitle,
    dueDate: formatDate(item.dueDate),
    amount: formatCurrency(item.amount, 'EUR'),
  }));

const fetchDashboardFallback = async (): Promise<ClientDashboardData> => {
  const [announcementsResult, deliveriesResult, paymentsResult] = await Promise.allSettled([
    fetchClientAnnouncements(),
    fetchClientDeliveries(),
    fetchClientPayments(),
  ]);

  const announcements =
    announcementsResult.status === 'fulfilled' ? announcementsResult.value : ([] as Announcement[]);
  const deliveries =
    deliveriesResult.status === 'fulfilled' ? deliveriesResult.value : ([] as Delivery[]);
  const payments =
    paymentsResult.status === 'fulfilled' ? paymentsResult.value : ([] as ClientPayment[]);

  return {
    stats: buildStatsFromFallback(announcements, deliveries, payments),
    announcements: buildAnnouncementsFromFallback(announcements),
    deliveries: buildDeliveriesFromFallback(deliveries),
    payments: buildPaymentsFromFallback(payments),
  };
};

export const fetchClientDashboard = async (): Promise<ClientDashboardData> => {
  const [announcementsResult, deliveriesResult, paymentsResult] = await Promise.allSettled([
    httpClient.get<AnnouncementCollectionResponse>('/announcements', {
      params: { mine: true, sort: 'createdAt,desc' },
    }),
    httpClient.get<DeliveryCollectionResponse>('/deliveries', {
      params: { mine: true, sort: 'deliveryDate,desc' },
    }),
    httpClient.get<PaymentCollectionResponse>('/invoices', {
      params: { mine: true, sort: 'issuedAt,desc' },
    }),
  ]);

  const allFailed = [announcementsResult, deliveriesResult, paymentsResult].every(
    (result) => result.status === 'rejected',
  );

  if (allFailed) {
    return fetchDashboardFallback();
  }

  const rawAnnouncements =
    announcementsResult.status === 'fulfilled'
      ? extractContent(announcementsResult.value.data)
      : [];
  const rawDeliveries =
    deliveriesResult.status === 'fulfilled' ? extractContent(deliveriesResult.value.data) : [];
  const rawPayments =
    paymentsResult.status === 'fulfilled' ? extractContent(paymentsResult.value.data) : [];

  const mappedAnnouncements: ClientDashboardAnnouncementRecord[] = rawAnnouncements.map(
    mapAnnouncement,
  );
  const mappedDeliveries: ClientDashboardDeliveryRecord[] = rawDeliveries.map(mapDelivery);
  const mappedPayments: ClientDashboardPaymentRecord[] = rawPayments.map(mapPayment);

  const stats: ClientDashboardStatRecord[] = [
    {
      label: 'Annonces actives',
      value: rawAnnouncements.filter(
        (item) => normalizeAnnouncementStatus(item.status) === 'PUBLISHED',
      ).length,
      color: '#2E7D32',
      icon: 'announcements',
    },
    {
      label: 'Livraisons en cours',
      value: rawDeliveries.filter((item) => normalizeDeliveryStatus(item.status) !== 'DELIVERED')
        .length,
      color: '#0277BD',
      icon: 'deliveries',
    },
    {
      label: 'En attente de paiement',
      value: rawPayments.filter((item) => {
        const status = normalizePaymentStatus(item.status);
        return status === 'due' || status === 'processing';
      }).length,
      color: '#F57C00',
      icon: 'payments',
    },
  ];

  return {
    stats,
    announcements: mappedAnnouncements,
    deliveries: mappedDeliveries,
    payments: mappedPayments,
  };
};
