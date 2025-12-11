import { useMemo, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { DashboardStatCard } from '../components/dashboard/DashboardStatCard';
import { DashboardSectionCard } from '../components/dashboard/DashboardSectionCard';
import { DashboardEmptyState } from '../components/dashboard/DashboardEmptyState';
import { DashboardAnnouncementItem } from '../components/dashboard/DashboardAnnouncementItem';
import { DashboardDeliveryItem } from '../components/dashboard/DashboardDeliveryItem';
import { DashboardPaymentItem } from '../components/dashboard/DashboardPaymentItem';
import { useClientDashboard } from '../hooks/useClientDashboard';
import type { ClientDashboardStatIconKey } from '../api/clientDashboard';

const statIconFactory: Record<ClientDashboardStatIconKey, () => ReactElement> = {
  announcements: () => <Inventory2OutlinedIcon />,
  deliveries: () => <LocalShippingOutlinedIcon />,
  payments: () => <CreditCardOutlinedIcon />,
};

export const ClientDashboardPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useClientDashboard();

  const headerSubtitle = useMemo(
    () => 'Bienvenue sur votre espace client EcoDeli',
    [],
  );

  const handleCreateAnnouncement = () => navigate('/client/annonces/nouvelle');
  const handleSeeAnnouncements = () => navigate('/client/annonces');
  const handleSeeDeliveries = () => navigate('/client/livraisons');
  const handleSeePayments = () => navigate('/client/paiements');

  if (isLoading && !data) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Chargement du tableau de bord…
        </Typography>
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Impossible de charger le tableau de bord
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Réessayez dans quelques instants.
        </Typography>
      </Box>
    );
  }

  const { stats, announcements: recentAnnouncements, deliveries: activeDeliveries, payments: pendingPayments } = data;

  const pendingPaymentsSubtitle = useMemo(() => {
    const count = pendingPayments.length;
    if (count === 0) {
      return 'Aucun paiement en attente';
    }
    return `${count} paiement${count > 1 ? 's' : ''} nécessitent votre attention`;
  }, [pendingPayments.length]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: { md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Tableau de bord
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {headerSubtitle}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleCreateAnnouncement}
          sx={{ alignSelf: { xs: 'stretch', md: 'auto' } }}
        >
          Créer une annonce
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        {stats.map((stat) => (
          <DashboardStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            icon={statIconFactory[stat.icon]()}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <DashboardSectionCard
          title="Annonces récentes"
          subtitle="Vos dernières annonces publiées"
          action={
            <Button variant="text" size="small" onClick={handleSeeAnnouncements}>
              Voir tout
            </Button>
          }
        >
          {recentAnnouncements.length === 0 ? (
            <DashboardEmptyState
              icon={<InventoryOutlinedIcon fontSize="large" />}
              title="Aucune annonce"
              description="Créez votre première annonce pour commencer."
              action={
                <Button variant="outlined" onClick={handleCreateAnnouncement}>
                  Créer une annonce
                </Button>
              }
            />
          ) : (
            <Stack spacing={2}>
              {recentAnnouncements.map((announcement) => (
                <DashboardAnnouncementItem
                  key={announcement.id}
                  {...announcement}
                  onClick={handleSeeAnnouncements}
                />
              ))}
            </Stack>
          )}
        </DashboardSectionCard>

        <DashboardSectionCard
          title="Livraisons en cours"
          subtitle="Suivez vos livraisons actives"
          action={
            <Button variant="text" size="small" onClick={handleSeeDeliveries}>
              Voir tout
            </Button>
          }
        >
          {activeDeliveries.length === 0 ? (
            <DashboardEmptyState
              icon={<LocalShippingIcon fontSize="large" />}
              title="Aucune livraison en cours"
              description="Vous serez averti dès qu'une livraison démarre."
            />
          ) : (
            <Stack spacing={2}>
              {activeDeliveries.map((delivery) => (
                <DashboardDeliveryItem
                  key={delivery.id}
                  {...delivery}
                  onClick={handleSeeDeliveries}
                />
              ))}
            </Stack>
          )}
        </DashboardSectionCard>
      </Box>

      <DashboardSectionCard
        title="Paiements en attente"
        subtitle={pendingPaymentsSubtitle}
        action={
          <Button variant="outlined" size="small" onClick={handleSeePayments}>
            Voir tous les paiements
          </Button>
        }
      >
        <Stack spacing={2}>
          {pendingPayments.map((payment) => (
            <DashboardPaymentItem
              key={payment.id}
              title={payment.title}
              dueDate={payment.dueDate}
              amount={payment.amount}
              onPay={handleSeePayments}
            />
          ))}
        </Stack>
      </DashboardSectionCard>
    </Box>
  );
};
