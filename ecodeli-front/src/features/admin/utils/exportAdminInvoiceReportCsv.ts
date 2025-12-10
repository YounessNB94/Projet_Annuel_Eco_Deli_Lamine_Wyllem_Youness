import { adminStatusConfig, type AdminStatus } from '../components/AdminStatusChip';

interface AdminInvoiceReportInput {
  invoices: Array<{
    id: string;
    entity: 'merchant' | 'courier';
    amount: string;
    status: AdminStatus;
    issuedAt: string;
    dueAt: string;
    period: string;
  }>;
  periodLabel: string;
  generatedAt?: Date;
  fileName?: string;
}

const HEADERS = ['Section', 'Indicateur', 'Valeur'];

const entityLabels: Record<'merchant' | 'courier', string> = {
  merchant: 'Commercants',
  courier: 'Livreurs',
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(value);

const formatPercent = (ratio: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(ratio);

const formatDateTime = (value: Date) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(value);

const parseAmount = (value: string) => {
  const normalized = value.replace(/[^0-9,.-]+/g, '').replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCell = (value: string | number) => {
  const raw = String(value ?? '');
  const escaped = raw.replace(/"/g, '""');
  if (/[\n";]/.test(escaped)) {
    return `"${escaped}"`;
  }
  return escaped;
};

const sanitizeForFileName = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

const buildCsvContent = (rows: string[][]) => {
  const headerLine = HEADERS.join(';');
  const dataLines = rows.map((row) => row.map((cell) => formatCell(cell)).join(';'));
  return [headerLine, ...dataLines].join('\n');
};

export const exportAdminInvoiceReportCsv = ({
  invoices,
  periodLabel,
  generatedAt = new Date(),
  fileName,
}: AdminInvoiceReportInput) => {
  if (invoices.length === 0) {
    return;
  }

  const totalsByStatus = invoices.reduce<Record<AdminStatus, number>>((acc, invoice) => {
    acc[invoice.status] = (acc[invoice.status] ?? 0) + 1;
    return acc;
  }, {} as Record<AdminStatus, number>);

  const amountsByStatus = invoices.reduce<Record<AdminStatus, number>>((acc, invoice) => {
    const amount = parseAmount(invoice.amount);
    acc[invoice.status] = (acc[invoice.status] ?? 0) + amount;
    return acc;
  }, {} as Record<AdminStatus, number>);

  const totalsByEntity = invoices.reduce<Record<'merchant' | 'courier', { count: number; amount: number }>>(
    (acc, invoice) => {
      const amount = parseAmount(invoice.amount);
      const bucket = acc[invoice.entity];
      bucket.count += 1;
      bucket.amount += amount;
      return acc;
    },
    {
      merchant: { count: 0, amount: 0 },
      courier: { count: 0, amount: 0 },
    },
  );

  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, invoice) => sum + parseAmount(invoice.amount), 0);
  const paidCount = totalsByStatus.paid ?? 0;
  const overdueCount = totalsByStatus.overdue ?? 0;
  const dueCount = totalsByStatus.due ?? 0;

  const rows: string[][] = [];

  rows.push(['Periode', 'Periode analysee', periodLabel]);
  rows.push(['Periode', 'Generation', formatDateTime(generatedAt)]);
  rows.push(['Periode', 'Factures prises en compte', String(totalInvoices)]);

  rows.push(['Volume', 'Factures payees', String(paidCount)]);
  rows.push(['Volume', 'Factures a regler', String(dueCount)]);
  rows.push(['Volume', 'Factures en retard', String(overdueCount)]);

  rows.push(['Montants', 'Montant total', formatCurrency(totalAmount)]);
  rows.push(['Montants', 'Montant paye', formatCurrency(amountsByStatus.paid ?? 0)]);
  rows.push(['Montants', 'Montant en attente', formatCurrency(amountsByStatus.due ?? 0)]);
  rows.push(['Montants', 'Montant en retard', formatCurrency(amountsByStatus.overdue ?? 0)]);
  rows.push([
    'Montants',
    'Montant moyen facture',
    formatCurrency(totalInvoices > 0 ? totalAmount / totalInvoices : 0),
  ]);

  rows.push([
    'Performance',
    'Taux de paiement',
    formatPercent(totalInvoices > 0 ? paidCount / totalInvoices : 0),
  ]);
  rows.push([
    'Performance',
    'Taux d echeance depassee',
    formatPercent(totalInvoices > 0 ? overdueCount / totalInvoices : 0),
  ]);

  rows.push(['Litiges', 'Litiges en cours', String(overdueCount)]);

  (Object.keys(totalsByStatus) as AdminStatus[]).forEach((status) => {
    const config = adminStatusConfig[status];
    if (!config) {
      return;
    }
    rows.push(['Details statut', `Volume ${config.label}`, String(totalsByStatus[status])]);
    rows.push([
      'Details statut',
      `Montant ${config.label}`,
      formatCurrency(amountsByStatus[status] ?? 0),
    ]);
  });

  (Object.keys(totalsByEntity) as Array<'merchant' | 'courier'>).forEach((entity) => {
    const bucket = totalsByEntity[entity];
    rows.push(['Ventilation profils', `${entityLabels[entity]} - volume`, String(bucket.count)]);
    rows.push([
      'Ventilation profils',
      `${entityLabels[entity]} - montant`,
      formatCurrency(bucket.amount),
    ]);
  });

  const csvContent = buildCsvContent(rows);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const normalizedPeriod = sanitizeForFileName(periodLabel);
  const stamp = generatedAt.toISOString().split('T')[0];
  const resolvedFileName =
    fileName ?? `rapport-factures-${normalizedPeriod ? `${normalizedPeriod}-` : ''}${stamp}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.download = resolvedFileName;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
