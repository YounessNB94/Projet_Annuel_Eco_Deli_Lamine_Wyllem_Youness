import { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Button, Chip, Snackbar, Stack, Typography } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

import { AdminStatCard } from '../components/AdminStatCard';
import { AdminSectionCard } from '../components/AdminSectionCard';
import { AdminDataTable, type AdminTableColumn } from '../components/AdminDataTable';
import { AdminStatusChip, type AdminStatus } from '../components/AdminStatusChip';
import { AdminFilterToolbar, type AdminFilterOption } from '../components/AdminFilterToolbar';
import { AdminInfoList } from '../components/AdminInfoList';
import { AdminActivityList, type AdminActivityItem } from '../components/AdminActivityList';
import { AdminCreateCampaignDialog, type CreateCampaignPayload } from '../components/AdminCreateCampaignDialog';
import { exportAdminFlowsCsv } from '../utils/exportAdminFlowsCsv';
import {
  type AdminAnnouncementsActivityRecord,
  type AdminFlowRow,
  type AdminFlowType,
  type AdminOverviewStat,
  type AdminPlanningSnapshotItem,
} from '../api/adminAnnouncementsDeliveries';
import { useAdminAnnouncementsDeliveriesData } from '../hooks/useAdminAnnouncementsDeliveries';

type FlowType = AdminFlowType;
type FlowTypeFilter = 'all' | FlowType;
type StatusFilter = 'all' | AdminStatus;

type FlowRow = AdminFlowRow;

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

const mapActivityToAdminItem = (activity: AdminAnnouncementsActivityRecord): AdminActivityItem => ({
  ...activity,
});

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
    render: (_row) => (
      <Button size="small" variant="text">
        Ouvrir
      </Button>
    ),
  },
];

export const AdminAnnouncementsDeliveriesPage = () => {
  const { data } = useAdminAnnouncementsDeliveriesData();
  const [rows, setRows] = useState<FlowRow[]>([]);
  const [typeFilter, setTypeFilter] = useState<FlowTypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [createdSnack, setCreatedSnack] = useState<string | null>(null);

  useEffect(() => {
    if (data?.flowRows) {
      setRows(data.flowRows);
    }
  }, [data?.flowRows]);

  const overviewStats = useMemo<AdminOverviewStat[]>(
    () => data?.overviewStats ?? [],
    [data],
  );

  const planningSnapshot = useMemo<AdminPlanningSnapshotItem[]>(
    () => data?.planningSnapshot ?? [],
    [data],
  );

  const liveActivity = useMemo<AdminActivityItem[]>(
    () => (data?.liveActivity ?? []).map(mapActivityToAdminItem),
    [data],
  );

  const filteredRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return rows.filter((row) => {
      const matchType = typeFilter === 'all' || row.type === typeFilter;
      const matchStatus = statusFilter === 'all' || row.status === statusFilter;
      const matchSearch =
        normalized.length === 0 ||
        row.title.toLowerCase().includes(normalized) ||
        row.id.toLowerCase().includes(normalized) ||
        row.merchant.toLowerCase().includes(normalized);
      return matchType && matchStatus && matchSearch;
    });
  }, [rows, typeFilter, statusFilter, searchTerm]);

  const handleCreateCampaign = (payload: CreateCampaignPayload) => {
    const idPrefix = payload.type === 'delivery' ? 'DLV' : 'ANN';
    const idRand = Math.floor(Math.random() * 9000) + 1000;
    const id = `${idPrefix}-${idRand}`;
    const windowLabel = `${payload.date} • ${payload.slot}`;
    const newRow: FlowRow = {
      id,
      type: payload.type,
      title: payload.title,
      merchant: payload.merchant,
      zone: payload.zones,
      window: windowLabel,
      status: 'scheduled',
      volume: `${payload.volume} colis`,
      couriers: Number(payload.couriers),
    };

    setRows((prev) => [newRow, ...prev]);
    setOpenCreate(false);
    setCreatedSnack(`Campagne ${id} créée`);
    // Log extended planning params for future backend wiring
    console.info('New campaign (admin)', {
      id,
      type: payload.type,
      title: payload.title,
      merchant: payload.merchant,
      zones: payload.zones,
      window: windowLabel,
      volume: payload.volume,
      couriers: payload.couriers,
      slaTargetMin: payload.slaTargetMin,
    });
  };

  const handleExport = () => {
    if (filteredRows.length === 0) {
      return;
    }

    const fileName = `campagnes-${new Date().toISOString().split('T')[0]}.csv`;
    exportAdminFlowsCsv(
      filteredRows.map((row) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        merchant: row.merchant,
        zone: row.zone,
        window: row.window,
        status: row.status,
        volume: row.volume,
        couriers: row.couriers,
      })),
      fileName,
    );
  };

  return (
    <>
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
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={handleExport}
            disabled={filteredRows.length === 0}
          >
            Exporter
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddOutlinedIcon />}
            onClick={() => setOpenCreate(true)}
          >
            Nouvelle campagne
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
        {overviewStats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
        ))}
      </Box>

      <AdminSectionCard title="Flux actifs" subtitle={`${filteredRows.length} lignes correspondent à vos filtres`}>
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

    <AdminCreateCampaignDialog
      open={openCreate}
      onClose={() => setOpenCreate(false)}
      onCreate={handleCreateCampaign}
    />

    <Snackbar
      open={!!createdSnack}
      autoHideDuration={3000}
      onClose={() => setCreatedSnack(null)}
      message={createdSnack ?? ''}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    />
    </>
  );
};
