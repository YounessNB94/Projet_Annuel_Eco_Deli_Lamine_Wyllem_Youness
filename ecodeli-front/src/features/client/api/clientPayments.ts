import { isAxiosError } from 'axios';
import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';

export type ClientPaymentStatus = 'due' | 'processing' | 'paid' | 'failed';

export interface ClientPayment {
  id: string;
  reference: string;
  deliveryTitle: string;
  amount: number;
  dueDate: string;
  status: ClientPaymentStatus;
}

export interface ClientPaymentDetail extends ClientPayment {
  serviceFee: number;
  total: number;
}

interface ClientPaymentResponse {
  id: number | string;
  reference?: string;
  invoiceNumber?: string;
  title?: string;
  label?: string;
  deliveryTitle?: string;
  delivery?: { title?: string };
  amount?: number;
  subtotal?: number;
  baseAmount?: number;
  serviceFee?: number;
  serviceFeeAmount?: number;
  total?: number;
  totalAmount?: number;
  totalCents?: number;
  amountCents?: number;
  serviceFeeCents?: number;
  currency?: string;
  dueDate?: string;
  dueOn?: string;
  issuedAt?: string;
  createdAt?: string;
  status?: string;
  state?: string;
}

const normalizeStatus = (status?: string): ClientPaymentStatus => {
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

const toAmount = (cents?: number, fallback?: number) => {
  if (typeof cents === 'number' && Number.isFinite(cents)) {
    return cents / 100;
  }
  if (typeof fallback === 'number' && Number.isFinite(fallback)) {
    return fallback;
  }
  return 0;
};

const mapPayment = (payload: ClientPaymentResponse): ClientPayment => ({
  id: String(payload.id),
  reference: payload.reference ?? payload.invoiceNumber ?? payload.label ?? 'Facture EcoDeli',
  deliveryTitle: payload.deliveryTitle ?? payload.delivery?.title ?? 'Livraison EcoDeli',
  amount: toAmount(payload.totalCents ?? payload.amountCents, payload.total ?? payload.totalAmount ?? payload.amount ?? payload.subtotal ?? payload.baseAmount),
  dueDate: payload.dueDate ?? payload.dueOn ?? payload.issuedAt ?? payload.createdAt ?? '',
  status: normalizeStatus(payload.status ?? payload.state),
});

const mapPaymentDetail = (payload: ClientPaymentResponse): ClientPaymentDetail => ({
  ...mapPayment(payload),
  serviceFee: toAmount(payload.serviceFeeCents, payload.serviceFee ?? payload.serviceFeeAmount),
  total: toAmount(payload.totalCents, payload.total ?? payload.totalAmount ?? payload.amount),
});

const extractPayments = (
  data: PaginatedResponse<ClientPaymentResponse> | ClientPaymentResponse[],
) => {
  if (Array.isArray(data)) {
    return data;
  }
  return data.content ?? [];
};

export const fetchClientPayments = async (): Promise<ClientPayment[]> => {
  try {
    const { data } = await httpClient.get<
      PaginatedResponse<ClientPaymentResponse> | ClientPaymentResponse[]
    >('/invoices', {
      params: { mine: true, sort: 'issuedAt,desc' },
    });
    return extractPayments(data).map(mapPayment);
  } catch (error) {
    console.error('Failed to fetch client payments', error);
    throw new Error('Impossible de récupérer les paiements client');
  }
};

export const fetchClientPaymentDetail = async (
  paymentId: string,
): Promise<ClientPaymentDetail | null> => {
  try {
    const { data } = await httpClient.get<ClientPaymentResponse>(`/invoices/${paymentId}`);
    return mapPaymentDetail(data);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error('Failed to fetch client payment detail', error);
    throw new Error('Impossible de récupérer le détail du paiement');
  }
};
