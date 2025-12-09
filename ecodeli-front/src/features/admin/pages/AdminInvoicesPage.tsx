import { useCallback, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

import { AdminStatCard } from '../components/AdminStatCard';
import { AdminSectionCard } from '../components/AdminSectionCard';
import { AdminDataTable, type AdminTableColumn } from '../components/AdminDataTable';
import { AdminStatusChip, type AdminStatus } from '../components/AdminStatusChip';
import { AdminFilterToolbar, type AdminFilterOption } from '../components/AdminFilterToolbar';
import { AdminInfoList } from '../components/AdminInfoList';
import { AdminActivityList, type AdminActivityItem } from '../components/AdminActivityList';

const invoiceStats = [
  { label: 'Factures en attente', value: '12', helper: '8 échéances < 7 jours' },
  { label: 'Montant à encaisser', value: '32,4 K€', helper: 'Clients commerçants' },
  { label: 'Payées ce mois-ci', value: '58', helper: '+12% vs M-1' },
  { label: 'Taux de litiges', value: '1,3%', helper: 'Objectif < 2%' },
];

type InvoiceEntity = 'all' | 'merchant' | 'courier';
type InvoiceFilter = 'all' | AdminStatus;

interface InvoiceRow {
  id: string;
  entity: InvoiceEntity;
  counterpart: string;
  period: string;
  amount: string;
  status: AdminStatus;
  issuedAt: string;
  dueAt: string;
}

const invoiceRows: InvoiceRow[] = [
  {
    id: 'INV-2024-781',
    entity: 'merchant',
    counterpart: 'EcoMarket Paris',
    period: 'Novembre 2025',
    amount: '6 540 €',
    status: 'due',
    issuedAt: '02 déc 2025',
    dueAt: '12 déc 2025',
  },
  {
    id: 'INV-2024-779',
    entity: 'merchant',
    counterpart: 'Greenify Lille',
    period: 'Novembre 2025',
    amount: '3 120 €',
    status: 'paid',
    issuedAt: '01 déc 2025',
    dueAt: '10 déc 2025',
  },
  {
    id: 'INV-2024-768',
    entity: 'courier',
    counterpart: 'Yohan Pereira',
    period: 'Novembre 2025',
    amount: '1 240 €',
    status: 'paid',
    issuedAt: '28 nov 2025',
    dueAt: '05 déc 2025',
  },
  {
    id: 'INV-2024-751',
    entity: 'merchant',
    counterpart: 'Upcycle Store',
    period: 'Octobre 2025',
    amount: '9 980 €',
    status: 'overdue',
    issuedAt: '08 nov 2025',
    dueAt: '25 nov 2025',
  },
  {
    id: 'INV-2024-740',
    entity: 'courier',
    counterpart: 'Nadia Benali',
    period: 'Octobre 2025',
    amount: '980 €',
    status: 'due',
    issuedAt: '04 nov 2025',
    dueAt: '18 nov 2025',
  },
  {
    id: 'INV-2024-701',
    entity: 'merchant',
    counterpart: 'Maison Verde',
    period: 'Septembre 2025',
    amount: '5 420 €',
    status: 'paid',
    issuedAt: '05 oct 2025',
    dueAt: '15 oct 2025',
  },
];

const statusFilters: AdminFilterOption<InvoiceFilter>[] = [
  { label: 'Tous les statuts', value: 'all' },
  { label: 'À régler', value: 'due' },
  { label: 'Payée', value: 'paid' },
  { label: 'Retard', value: 'overdue' },
];

const entityFilters: AdminFilterOption<InvoiceEntity>[] = [
  { label: 'Tous profils', value: 'all' },
  { label: 'Commerçants', value: 'merchant' },
  { label: 'Livreurs', value: 'courier' },
];

const paymentActivity: AdminActivityItem[] = [
  {
    id: 'pay-1',
    title: 'Paiement reçu - INV-2024-779',
    description: 'Greenify Lille - virement SEPA confirmé.',
    timestamp: 'Il y a 12 min',
  },
  {
    id: 'pay-2',
    title: 'Relance envoyée - INV-2024-751',
    description: 'Email + notification backoffice programmés.',
    timestamp: 'Il y a 45 min',
  },
  {
    id: 'pay-3',
    title: 'Validation note de crédit',
    description: 'Maison Verde - avoir appliqué (450 €).',
    timestamp: 'Ce matin',
  },
];

const createInvoiceColumns = (
  onDownload: (invoice: InvoiceRow) => void
): AdminTableColumn<InvoiceRow>[] => [
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
        onClick={() => onDownload(row)}
      >
        PDF
      </Button>
    ),
  },
];

export const AdminInvoicesPage = () => {
  const [statusFilter, setStatusFilter] = useState<InvoiceFilter>('all');
  const [entityFilter, setEntityFilter] = useState<InvoiceEntity>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const handleInvoiceDownload = useCallback((invoice: InvoiceRow) => {
    console.info('Download invoice PDF', invoice.id);
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
          <Button variant="outlined" startIcon={<FilterAltOutlinedIcon />}>Exporter la vue</Button>
          <Button variant="contained" color="success" startIcon={<TrendingUpOutlinedIcon />}>Rapport mensuel</Button>
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
        action={<Button size="small">Configurer les relances</Button>}
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
            items={[
              { label: 'Total en retard', value: '9 980 €', helper: '1 facture > 10 jours' },
              { label: 'À encaisser (7 jours)', value: '12 600 €', helper: '4 factures' },
              { label: 'Reversement livreurs', value: '2 220 €', helper: 'Cycle hebdomadaire' },
              { label: 'Litiges ouverts', value: '2', helper: 'Traitement juridique' },
            ]}
          />
        </AdminSectionCard>

        <AdminSectionCard title="Transactions récentes" subtitle="Flux bancaires et relances">
          <AdminActivityList items={paymentActivity} />
        </AdminSectionCard>
      </Box>
    </Stack>
  );
};
