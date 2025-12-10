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

const stats = [
  {
    label: 'Livreurs en attente',
    value: 8,
    helper: '2 nouveaux dossiers reçus ce matin',
    icon: <PeopleOutlineIcon fontSize="small" />,
    trend: { label: '+12% vs hier', color: 'info' as const },
  },
  {
    label: 'Validations traitées',
    value: 24,
    helper: 'Sur les dernières 24h',
    icon: <AssignmentTurnedInOutlinedIcon fontSize="small" />,
    trend: { label: '98% de conformité', color: 'success' as const },
  },
  {
    label: 'Livraisons en cours',
    value: 142,
    helper: '17 campagnes actives',
    icon: <LocalShippingOutlinedIcon fontSize="small" />,
    trend: { label: '+4 vs hier', color: 'success' as const },
  },
  {
    label: 'Montant facturé (M-1)',
    value: '45,2 K€',
    helper: 'En attente de paiement : 8,3 K€',
    icon: <EuroOutlinedIcon fontSize="small" />,
    trend: { label: '+6% vs M-2', color: 'info' as const },
  },
];

const pendingCouriers = [
  { id: 'CR-541', name: 'Nadia Benali', company: 'NB Logistics', submittedAt: '09:15', documents: 5 },
  { id: 'CR-542', name: 'Yohan Pereira', company: 'YP Services', submittedAt: '08:52', documents: 4 },
  { id: 'CR-543', name: 'Sofiane Haddad', company: 'SH Delivery', submittedAt: '08:21', documents: 6 },
];

const activityItems: AdminActivityItem[] = [
  {
    id: 'activity-1',
    title: 'Validation dossier CR-537',
    description: 'Marie Courrier a approuvé le permis de conduire (niveau argent).',
    timestamp: 'Il y a 12 min',
    icon: <CheckCircleOutlineIcon fontSize="small" />,
  },
  {
    id: 'activity-2',
    title: 'Anomalie facture CTR-78412',
    description: 'Montant détecté supérieur au devis ( +12% ).',
    timestamp: 'Il y a 45 min',
    icon: <ErrorOutlineIcon fontSize="small" />,
  },
  {
    id: 'activity-3',
    title: 'Campagne EcoMarket publiée',
    description: 'Annonce MERCHANT_HOME_DELIVERY #MHD-009 active (Paris 17).',
    timestamp: 'Il y a 1 h',
    icon: <NotificationsActiveOutlinedIcon fontSize="small" />,
  },
];

const globalAlerts = [
  { id: 'alert-1', label: 'Document expiré', detail: 'Permis CR-521', severity: 'warning' as const },
  { id: 'alert-2', label: 'Livraison critique', detail: 'MHD-002 • colis sensibles', severity: 'error' as const },
];

export const AdminDashboardPage = () => {
  const navigate = useNavigate();

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
        {stats.map((stat) => (
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
