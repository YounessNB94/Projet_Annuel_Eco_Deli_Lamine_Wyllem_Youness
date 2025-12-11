import { useMemo, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import EuroOutlinedIcon from '@mui/icons-material/EuroOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { AdminStatCard } from '../components/AdminStatCard';
import { AdminSectionCard } from '../components/AdminSectionCard';
import { AdminActivityList, type AdminActivityItem } from '../components/AdminActivityList';
import { useAdminDashboardData } from '../hooks/useAdminDashboard';
import type {
  AdminDashboardActivityIconKey,
  AdminDashboardAlert,
  AdminDashboardPendingCourier,
  AdminDashboardStat,
  AdminDashboardStatIconKey,
} from '../api/adminDashboard';

const statIconFactory: Record<AdminDashboardStatIconKey, () => ReactElement> = {
  pendingCouriers: () => <PeopleOutlineIcon fontSize="small" />,
  validations: () => <AssignmentTurnedInOutlinedIcon fontSize="small" />,
  deliveries: () => <LocalShippingOutlinedIcon fontSize="small" />,
  billing: () => <EuroOutlinedIcon fontSize="small" />,
};

const activityIconFactory: Record<AdminDashboardActivityIconKey, () => ReactElement> = {
  validation: () => <CheckCircleOutlineIcon fontSize="small" />,
  anomaly: () => <ErrorOutlineIcon fontSize="small" />,
  campaign: () => <NotificationsActiveOutlinedIcon fontSize="small" />,
};

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { data } = useAdminDashboardData();

  const stats = useMemo<AdminDashboardStat[]>(() => data?.stats ?? [], [data]);
  const pendingCouriers = useMemo<AdminDashboardPendingCourier[]>(
    () => data?.pendingCouriers ?? [],
    [data],
  );
  const globalAlerts = useMemo<AdminDashboardAlert[]>(() => data?.globalAlerts ?? [], [data]);

  const activityItems = useMemo<AdminActivityItem[]>(
    () =>
      (data?.activityItems ?? []).map((item) => ({
        ...item,
        icon: activityIconFactory[item.icon](),
      })),
    [data],
  );

  const computedStats = useMemo(
    () =>
      stats.map((stat) => ({
        ...stat,
        icon: statIconFactory[stat.icon](),
      })),
    [stats],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Backoffice EcoDeli
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Suivez les dossiers livreurs, les campagnes et l'état de facturation en un coup d'œil.
          </Typography>
        </Box>
        <Button variant="contained" color="success" sx={{ alignSelf: { xs: 'flex-start', md: 'center' } }}>
          Exporter le rapport
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'repeat(auto-fit, minmax(220px, 1fr))' },
        }}
      >
        {computedStats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        }}
      >
        <Stack spacing={3}>
          <AdminSectionCard
            title="Validations livreurs"
            subtitle="3 dossiers prêtent à être approuvés"
            action={
              <Button size="small" onClick={() => navigate('/admin/livreurs')}>
                Voir tous les dossiers
              </Button>
            }
          >
            <Stack spacing={2}>
              {pendingCouriers.map((courier) => (
                <Stack
                  key={courier.id}
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 1.5,
                    cursor: 'pointer',
                    transition: 'border-color 150ms ease',
                    '&:hover': {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                  }}
                  onClick={() => navigate(`/admin/livreurs/${courier.id}`)}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {courier.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {courier.company} • {courier.documents} documents
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(event) => event.stopPropagation()}
                    >
                      Refuser
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={(event) => event.stopPropagation()}
                    >
                      Approuver
                    </Button>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </AdminSectionCard>

          <AdminSectionCard title="Alertes globales" subtitle="Points à surveiller">
            <Stack spacing={2} sx={{ p: 0 }}>
              {globalAlerts.map((alert) => (
                <Stack key={alert.id} direction="row" spacing={2} alignItems="center">
                  <Chip label={alert.label} color={alert.severity} size="small" />
                  <Divider flexItem orientation="vertical" />
                  <Typography variant="body2">{alert.detail}</Typography>
                </Stack>
              ))}
            </Stack>
          </AdminSectionCard>
        </Stack>

        <Stack spacing={3}>
          <AdminSectionCard title="Activité récente" subtitle="Actions backoffice des dernières heures">
            <AdminActivityList items={activityItems} />
          </AdminSectionCard>

          <AdminSectionCard title="Campagnes en surperformance" subtitle="Annonces à suivre">
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" fontWeight={600}>
                  MHD-001 • Opération Noël
                </Typography>
                <Chip label="+18%" color="success" size="small" />
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" fontWeight={600}>
                  MHD-003 • Outlet Lyon
                </Typography>
                <Chip label="+9%" color="info" size="small" />
              </Stack>
            </Stack>
          </AdminSectionCard>
        </Stack>
      </Box>
    </Box>
  );
};
