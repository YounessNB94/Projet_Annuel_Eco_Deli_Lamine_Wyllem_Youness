import { useCallback, useMemo, useState } from 'react';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

import { AdminStatCard } from '../components/AdminStatCard';
import { AdminSectionCard } from '../components/AdminSectionCard';
import { AdminDataTable, type AdminTableColumn } from '../components/AdminDataTable';
import { AdminStatusChip, type AdminStatus } from '../components/AdminStatusChip';
import { AdminFilterToolbar, type AdminFilterOption } from '../components/AdminFilterToolbar';
import { AdminInfoList } from '../components/AdminInfoList';
import { AdminActivityList } from '../components/AdminActivityList';
import {
  type AdminInvoiceRow,
  type AdminInvoiceEntity,
} from '../api/adminInvoices';
import { useAdminInvoicesData } from '../hooks/useAdminInvoices';
import { downloadAdminInvoicePdf } from '../utils/downloadAdminInvoicePdf';
import { exportAdminInvoiceReportCsv } from '../utils/exportAdminInvoiceReportCsv';

type InvoiceEntity = AdminInvoiceEntity;
type InvoiceEntityFilter = 'all' | InvoiceEntity;
type InvoiceFilter = 'all' | AdminStatus;

const normalizeText = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const statusFilters: AdminFilterOption<InvoiceFilter>[] = [
  { label: 'Tous les statuts', value: 'all' },
  { label: 'À régler', value: 'due' },
  { label: 'Payée', value: 'paid' },
  { label: 'Retard', value: 'overdue' },
];
const entityFilters: AdminFilterOption<InvoiceEntityFilter>[] = [
  { label: 'Tous profils', value: 'all' },
  { label: 'Commerçants', value: 'merchant' },
  { label: 'Livreurs', value: 'courier' },
];
const createInvoiceColumns = (
  onDownload: (invoice: AdminInvoiceRow) => Promise<void> | void,
): AdminTableColumn<AdminInvoiceRow>[] => [
  {
    key: 'invoice',
    label: 'Facture',
    render: (row) => (
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
          {row.entity === 'merchant'
            ? row.counterpart[0]
            : row.counterpart
                .split(' ')
                .map((chunk) => chunk[0])
                .join('')
                .slice(0, 2)}
        </Avatar>
        <Box>
          <Typography variant="body1" fontWeight={600}>
            {row.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {row.counterpart} • {row.period}
          </Typography>
        </Box>
      </Stack>
    ),
  },
  {
    key: 'amount',
    label: 'Montant',
    render: (row) => (
      <Typography variant="body2" fontWeight={600}>
        {row.amount}
      </Typography>
    ),
  },
  {
    key: 'dates',
    label: 'Emission / Échéance',
    hideOnMobile: true,
    render: (row) => (
      <Stack spacing={0.3}>
        <Typography variant="body2">Émis le {row.issuedAt}</Typography>
        <Typography variant="caption" color="text.secondary">
          Échéance le {row.dueAt}
        </Typography>
      </Stack>
    ),
  },
  {
    key: 'status',
    label: 'Statut',
    render: (row) => <AdminStatusChip status={row.status} />,
  },
  {
    key: 'actions',
    label: '',
    align: 'right',
    render: (row) => (
      <Button
        size="small"
        variant="outlined"
        startIcon={<PictureAsPdfOutlinedIcon />}
        onClick={() => {
          void onDownload(row);
        }}
      >
        PDF
      </Button>
    ),
  },
];

export const AdminInvoicesPage = () => {
  const { data } = useAdminInvoicesData();
  const invoiceStats = data?.stats ?? [];
  const invoiceRows = data?.invoices ?? [];
  const paymentActivity = data?.paymentActivity ?? [];
  const summaryItems = data?.summaryItems ?? [];
  const [statusFilter, setStatusFilter] = useState<InvoiceFilter>('all');
  const [entityFilter, setEntityFilter] = useState<InvoiceEntityFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const handleInvoiceDownload = useCallback(async (invoice: AdminInvoiceRow) => {
    try {
      await downloadAdminInvoicePdf({
        id: invoice.id,
        entity: invoice.entity,
        counterpart: invoice.counterpart,
        period: invoice.period,
        amount: invoice.amount,
        status: invoice.status,
        issuedAt: invoice.issuedAt,
        dueAt: invoice.dueAt,
      });
    } catch (error) {
      console.error('Failed to download invoice PDF', error);
    }
  }, []);
  const invoiceColumns = useMemo(() => createInvoiceColumns(handleInvoiceDownload), [handleInvoiceDownload]);

  const filteredInvoices = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return invoiceRows.filter((invoice) => {
      const matchStatus = statusFilter === 'all' || invoice.status === statusFilter;
      const matchEntity = entityFilter === 'all' || invoice.entity === entityFilter;
      const matchSearch =
        normalized.length === 0 ||
        invoice.id.toLowerCase().includes(normalized) ||
        invoice.counterpart.toLowerCase().includes(normalized);
      return matchStatus && matchEntity && matchSearch;
    });
  }, [statusFilter, entityFilter, searchTerm]);

  const currentPeriodLabel = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' });
    const formatted = formatter.format(new Date());
    if (formatted.length === 0) {
      return '';
    }
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, []);

  const { reportInvoices, reportPeriodLabel } = useMemo(() => {
    if (filteredInvoices.length === 0) {
      return { reportInvoices: filteredInvoices, reportPeriodLabel: currentPeriodLabel };
    }

    const normalizedTarget = normalizeText(currentPeriodLabel);
    if (normalizedTarget.length > 0) {
      const matches = filteredInvoices.filter(
        (invoice) => normalizeText(invoice.period) === normalizedTarget,
      );
      if (matches.length > 0) {
        return { reportInvoices: matches, reportPeriodLabel: currentPeriodLabel };
      }
    }

    const fallbackPeriod = filteredInvoices[0]?.period ?? currentPeriodLabel;
    return { reportInvoices: filteredInvoices, reportPeriodLabel: fallbackPeriod };
  }, [filteredInvoices, currentPeriodLabel]);

  const handleMonthlyReportExport = useCallback(() => {
    if (reportInvoices.length === 0) {
      console.warn('No invoices available for monthly report export.');
      return;
    }

    exportAdminInvoiceReportCsv({
      invoices: reportInvoices,
      periodLabel: reportPeriodLabel,
      generatedAt: new Date(),
    });
  }, [reportInvoices, reportPeriodLabel]);

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Factures & paiements
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Suivez les encaissements commerçants et les reversements livreurs en un coup d’œil.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="success"
            startIcon={<TrendingUpOutlinedIcon />}
            onClick={handleMonthlyReportExport}
            disabled={reportInvoices.length === 0}
          >
            Rapport mensuel
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'repeat(auto-fit, minmax(220px, 1fr))' },
        }}
      >
        {invoiceStats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
        ))}
      </Box>

      <AdminSectionCard
        title="Historique des factures"
        subtitle={`${filteredInvoices.length} lignes correspondent à vos filtres`}
      >
        <Stack spacing={2}>
          <AdminFilterToolbar
            filters={statusFilters}
            value={statusFilter}
            onChange={setStatusFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Rechercher une facture ou un client"
            extraFilters={
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {entityFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    size="small"
                    variant={entityFilter === filter.value ? 'contained' : 'outlined'}
                    onClick={() => setEntityFilter(filter.value)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </Stack>
            }
          />

          <AdminDataTable columns={invoiceColumns} rows={filteredInvoices} getRowKey={(invoice) => invoice.id} />
        </Stack>
      </AdminSectionCard>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        }}
      >
        <AdminSectionCard title="Synthèse encours" subtitle="Montants clés">
          <AdminInfoList
            columns={2}
            items={summaryItems}
          />
        </AdminSectionCard>

        <AdminSectionCard title="Transactions récentes" subtitle="Flux bancaires et relances">
          <AdminActivityList items={paymentActivity} />
        </AdminSectionCard>
      </Box>
    </Stack>
  );
};
