import type { AxiosResponse } from 'axios';
import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { AdminStatus } from '../components/AdminStatusChip';
import type { AdminActivityItem } from '../components/AdminActivityList';

export interface AdminInvoiceStat {
  label: string;
  value: string;
  helper?: string;
}

export type AdminInvoiceEntity = 'merchant' | 'courier';

export interface AdminInvoiceRow {
  id: string;
  entity: AdminInvoiceEntity;
  counterpart: string;
  period: string;
  amount: string;
  status: AdminStatus;
  issuedAt: string;
  dueAt: string;
}

export type AdminInvoiceActivityRecord = AdminActivityItem;

export interface AdminInvoiceSummaryItem {
  label: string;
  value: string;
  helper?: string;
}

export interface AdminInvoicesData {
  stats: AdminInvoiceStat[];
  invoices: AdminInvoiceRow[];
  paymentActivity: AdminInvoiceActivityRecord[];
  summaryItems: AdminInvoiceSummaryItem[];
}

interface AdminInvoiceResponse {
  id: number | string;
  entityType?: 'MERCHANT' | 'COURIER';
  counterpartName?: string;
  billingPeriod?: string;
  amount?: number;
  currency?: string;
  status?: string;
  issuedAt?: string;
  dueAt?: string;
  overdueDays?: number;
}

interface PaymentLogResponse {
  id: number | string;
  title?: string;
  message?: string;
  createdAt?: string;
}

const getPaginatedData = <T>(
  result: PromiseSettledResult<AxiosResponse<PaginatedResponse<T>>>,
): PaginatedResponse<T> | undefined => (result.status === 'fulfilled' ? result.value.data : undefined);

const formatCurrency = (value?: number, currency = 'EUR') => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '0 €';
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
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

const normalizeEntity = (entity?: string): AdminInvoiceEntity => {
  switch (String(entity ?? '').toUpperCase()) {
    case 'COURIER':
      return 'courier';
    default:
      return 'merchant';
  }
};

const normalizeStatus = (status?: string): AdminStatus => {
  switch (String(status ?? '').toUpperCase()) {
    case 'PAID':
      return 'paid';
    case 'OVERDUE':
    case 'LATE':
      return 'overdue';
    case 'DUE':
    default:
      return 'due';
  }
};

const mapInvoiceRow = (invoice: AdminInvoiceResponse): AdminInvoiceRow => ({
  id: String(invoice.id),
  entity: normalizeEntity(invoice.entityType),
  counterpart: invoice.counterpartName ?? '—',
  period: invoice.billingPeriod ?? '—',
  amount: formatCurrency(invoice.amount, invoice.currency),
  status: normalizeStatus(invoice.status),
  issuedAt: formatDate(invoice.issuedAt),
  dueAt: formatDate(invoice.dueAt),
});

const mapPaymentLog = (log: PaymentLogResponse): AdminInvoiceActivityRecord => ({
  id: String(log.id),
  title: log.title ?? 'Mouvement financier',
  description: log.message ?? 'Mise à jour de paiement',
  timestamp: log.createdAt
    ? new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(log.createdAt))
    : '—',
});

const computeStats = (invoices?: PaginatedResponse<AdminInvoiceResponse>): AdminInvoiceStat[] => {
  const content = invoices?.content ?? [];
  const dueInvoices = content.filter((invoice) => normalizeStatus(invoice.status) === 'due');
  const paidInvoices = content.filter((invoice) => normalizeStatus(invoice.status) === 'paid');
  const overdueInvoices = content.filter((invoice) => normalizeStatus(invoice.status) === 'overdue');

  const pendingAmount = dueInvoices.reduce((total, invoice) => total + (invoice.amount ?? 0), 0);
  const paidAmount = paidInvoices.reduce((total, invoice) => total + (invoice.amount ?? 0), 0);
  const overdueAmount = overdueInvoices.reduce((total, invoice) => total + (invoice.amount ?? 0), 0);

  return [
    { label: 'Factures en attente', value: String(dueInvoices.length), helper: `${formatCurrency(pendingAmount)} à encaisser` },
    { label: 'Montant encaissé', value: formatCurrency(paidAmount), helper: `${paidInvoices.length} factures payées` },
    { label: 'Factures en retard', value: String(overdueInvoices.length), helper: `${formatCurrency(overdueAmount)} à relancer` },
    { label: 'Factures totales', value: String(content.length), helper: `${invoices?.totalElements ?? content.length} sur la période` },
  ];
};

const computeSummaryItems = (invoices?: PaginatedResponse<AdminInvoiceResponse>): AdminInvoiceSummaryItem[] => {
  const content = invoices?.content ?? [];
  const dueSoon = content.filter((invoice) => {
    if (!invoice.dueAt) {
      return false;
    }
    const dueDate = new Date(invoice.dueAt).getTime();
    const now = Date.now();
    const diffDays = Math.round((dueDate - now) / 86_400_000);
    return diffDays >= 0 && diffDays <= 7;
  });

  const totalReversement = content
    .filter((invoice) => normalizeEntity(invoice.entityType) === 'courier')
    .reduce((total, invoice) => total + (invoice.amount ?? 0), 0);

  const disputes = content.filter((invoice) => (invoice.overdueDays ?? 0) > 15).length;

  return [
    {
      label: 'Échéances 7 jours',
      value: formatCurrency(dueSoon.reduce((total, invoice) => total + (invoice.amount ?? 0), 0)),
      helper: `${dueSoon.length} factures concernées`,
    },
    {
      label: 'Reversements livreurs',
      value: formatCurrency(totalReversement),
      helper: `${content.filter((invoice) => normalizeEntity(invoice.entityType) === 'courier').length} dossiers`,
    },
    {
      label: 'Relances critiques',
      value: String(disputes),
      helper: 'Retards > 15 jours',
    },
    {
      label: 'Total factures',
      value: formatCurrency(content.reduce((total, invoice) => total + (invoice.amount ?? 0), 0)),
      helper: 'Montant brut période',
    },
  ];
};

export const fetchAdminInvoicesData = async (): Promise<AdminInvoicesData> => {
  const [invoicesResult, activityResult] = await Promise.allSettled([
    httpClient.get<PaginatedResponse<AdminInvoiceResponse>>('/admin/invoices', {
      params: { page: 0, size: 50, sort: 'issuedAt,desc' },
    }),
    httpClient.get<PaginatedResponse<PaymentLogResponse>>('/admin/payments', {
      params: { page: 0, size: 10, sort: 'createdAt,desc' },
    }),
  ]);

  const invoicesData = getPaginatedData(invoicesResult);
  const paymentsData = getPaginatedData(activityResult);

  return {
    stats: computeStats(invoicesData),
    invoices: (invoicesData?.content ?? []).map(mapInvoiceRow),
    paymentActivity: (paymentsData?.content ?? []).map(mapPaymentLog),
    summaryItems: computeSummaryItems(invoicesData),
  };
};
