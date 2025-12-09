import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

import { AdminStatCard } from '../components/AdminStatCard';
import { AdminSectionCard } from '../components/AdminSectionCard';
import { AdminDataTable, type AdminTableColumn } from '../components/AdminDataTable';
import { AdminStatusChip, type AdminStatus } from '../components/AdminStatusChip';
import { AdminFilterToolbar, type AdminFilterOption } from '../components/AdminFilterToolbar';
import { AdminInfoList } from '../components/AdminInfoList';
import { AdminActivityList, type AdminActivityItem } from '../components/AdminActivityList';

const overviewStats = [
  { label: 'Campagnes actives', value: 12, helper: '4 en préparation' },
  { label: 'Livraisons du jour', value: 486, helper: '+9% vs semaine dernière' },
  { label: 'Taux de succès', value: '96,2%', helper: 'annulations < 3%' },
  { label: 'SLA moyen', value: '78 min', helper: 'objectif < 90 min' },
];

type FlowType = 'announcement' | 'delivery';
type FlowTypeFilter = 'all' | FlowType;
type StatusFilter = 'all' | AdminStatus;

interface FlowRow {
  id: string;
  type: FlowType;
  title: string;
  merchant: string;
  zone: string;
  window: string;
  status: AdminStatus;
  volume: string;
  couriers: number;
}

const flowRows: FlowRow[] = [
  {
    id: 'ANN-1042',
    type: 'announcement',
    title: 'EcoMarket • Fête locale',
    merchant: 'EcoMarket Dijon',
    zone: 'Dijon & agglomération',
    window: '12 déc • 08h-13h',
    status: 'scheduled',
    volume: '74 colis',
    couriers: 8,
  },
  {
    id: 'ANN-1036',
    type: 'announcement',
    title: 'BioDistrict • Fin d’année',
    merchant: 'BioDistrict Paris 15',
    zone: 'Paris intra-muros',
    window: '11 déc • 14h-20h',
    status: 'active',
    volume: '128 colis',
    couriers: 14,
  },
  {
    id: 'DLV-77231',
    type: 'delivery',
    title: 'Lot n°43 - Premium',
    merchant: 'Maison Verde',
    zone: 'Lyon Est',
    window: 'En cours (ETA 17h12)',
    status: 'delayed',
    volume: '32 colis',
    couriers: 5,
  },
  {
    id: 'DLV-77221',
    type: 'delivery',
    title: 'Suivi express - Nord',
    merchant: 'Greenify',
    zone: 'Lille • HDF',
    window: 'Livré 10 déc',
    status: 'delivered',
    volume: '58 colis',
    couriers: 6,
  },
  {
    id: 'ANN-1029',
    type: 'announcement',
    title: 'Outlet durable',
    merchant: 'Upcycle Store',
    zone: 'Marseille littoral',
    window: '14 déc • 10h-19h',
    status: 'review',
    volume: '92 colis',
    couriers: 11,
  },
  {
    id: 'DLV-77198',
    type: 'delivery',
    title: 'Régulier J+1',
    merchant: 'EcoMarket Toulouse',
    zone: 'Toulouse métropole',
    window: 'Annulé (incident météo)',
    status: 'cancelled',
    volume: '40 colis',
    couriers: 7,
  },
];

const statusFilters: AdminFilterOption<StatusFilter>[] = [
  { label: 'Tous les statuts', value: 'all' },
  { label: 'Planifié', value: 'scheduled' },
  { label: 'En cours', value: 'active' },
  { label: 'Retard', value: 'delayed' },
  { label: 'Livré', value: 'delivered' },
  { label: 'En revue', value: 'review' },
];

const typeFilters: AdminFilterOption<FlowTypeFilter>[] = [
  { label: 'Tout', value: 'all' },
  { label: 'Annonces', value: 'announcement' },
  { label: 'Livraisons', value: 'delivery' },
];

const planningSnapshot = [
  { label: 'Fenêtres critiques', value: '3', helper: 'ETA < 90 min' },
  { label: 'Campagnes multi-villes', value: '5', helper: '13 hubs concernés' },
  { label: 'Volume total J+2', value: '1 230 colis', helper: '+18% vs J+1' },
];

const liveActivity: AdminActivityItem[] = [
  {
    id: 'activity-10',
    title: 'Greenify - retard météo',
    description: 'Recalage des créneaux clients terminé.',
    timestamp: 'Il y a 8 min',
  },
  {
    id: 'activity-11',
    title: 'Maison Verde - lot 43',
    description: 'Point de contrôle validé (hub 2).',
    timestamp: 'Il y a 25 min',
  },
  {
    id: 'activity-12',
    title: 'BioDistrict - renfort',
    description: '2 livreurs supplémentaires affectés.',
    timestamp: 'Il y a 1 h',
  },
];

const getFlowIcon = (type: FlowType) => {
  if (type === 'delivery') {
    return <LocalShippingOutlinedIcon fontSize="small" />;
  }
  return <CampaignOutlinedIcon fontSize="small" />;
};

const flowColumns: AdminTableColumn<FlowRow>[] = [
  {
    key: 'flow',
    label: 'Flux',
    render: (row) => (
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
          {getFlowIcon(row.type)}
        </Avatar>
        <Box>
          <Typography variant="body1" fontWeight={600}>
            {row.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {row.id} • {row.merchant}
          </Typography>
        </Box>
      </Stack>
    ),
  },
  {
    key: 'zone',
    label: 'Zone couverte',
    hideOnMobile: true,
    render: (row) => (
      <Typography variant="body2" color="text.secondary">
        {row.zone}
      </Typography>
    ),
  },
  {
    key: 'window',
    label: 'Fenêtre',
    hideOnMobile: true,
    render: (row) => (
      <Typography variant="body2" fontWeight={500}>
        {row.window}
      </Typography>
    ),
  },
  {
    key: 'volume',
    label: 'Volume',
    render: (row) => (
      <Typography variant="body2">
        {row.volume} • {row.couriers} livreurs
      </Typography>
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
      <Button size="small" variant="text">
        Ouvrir
      </Button>
    ),
  },
];

export const AdminAnnouncementsDeliveriesPage = () => {
  const [typeFilter, setTypeFilter] = useState<FlowTypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return flowRows.filter((row) => {
      const matchType = typeFilter === 'all' || row.type === typeFilter;
      const matchStatus = statusFilter === 'all' || row.status === statusFilter;
      const matchSearch =
        normalized.length === 0 ||
        row.title.toLowerCase().includes(normalized) ||
        row.id.toLowerCase().includes(normalized) ||
        row.merchant.toLowerCase().includes(normalized);
      return matchType && matchStatus && matchSearch;
    });
  }, [typeFilter, statusFilter, searchTerm]);

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Annonces & livraisons
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Vision consolidée des campagnes en cours, fenêtres critiques et flux à suivre.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />}>Exporter</Button>
          <Button variant="contained" color="success" startIcon={<AddOutlinedIcon />}>Nouvelle campagne</Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'repeat(auto-fit, minmax(220px, 1fr))' },
        }}
      >
        {overviewStats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
        ))}
      </Box>

      <AdminSectionCard title="Flux actifs" subtitle={`${filteredRows.length} lignes correspondent à vos filtres`} action={<Button size="small" startIcon={<TuneOutlinedIcon />}>Configurer les alertes</Button>}>
        <Stack spacing={2}>
          <AdminFilterToolbar
            filters={statusFilters}
            value={statusFilter}
            onChange={setStatusFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Rechercher une annonce ou livraison"
            extraFilters={
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {typeFilters.map((filter) => (
                  <Chip
                    key={filter.value}
                    label={filter.label}
                    variant={typeFilter === filter.value ? 'filled' : 'outlined'}
                    color={typeFilter === filter.value ? 'secondary' : 'default'}
                    onClick={() => setTypeFilter(filter.value)}
                    sx={{ borderRadius: 999 }}
                  />
                ))}
              </Stack>
            }
          />

          <AdminDataTable columns={flowColumns} rows={filteredRows} getRowKey={(row) => row.id} />
        </Stack>
      </AdminSectionCard>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        }}
      >
        <AdminSectionCard title="Récap planning J+2">
          <AdminInfoList items={planningSnapshot} columns={2} />
        </AdminSectionCard>

        <AdminSectionCard title="Activité en direct" subtitle="Derniers événements sur les flux">
          <AdminActivityList items={liveActivity} />
        </AdminSectionCard>
      </Box>
    </Stack>
  );
};
