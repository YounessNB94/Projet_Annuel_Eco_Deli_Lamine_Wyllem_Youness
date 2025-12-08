import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import type { AnnouncementStatus } from '../api/clientAnnouncements';
import type { DeliveryStatus } from '../api/clientDeliveries';
import { DashboardStatCard } from '../components/dashboard/DashboardStatCard';
import { DashboardSectionCard } from '../components/dashboard/DashboardSectionCard';
import { DashboardEmptyState } from '../components/dashboard/DashboardEmptyState';
import { DashboardAnnouncementItem } from '../components/dashboard/DashboardAnnouncementItem';
import { DashboardDeliveryItem } from '../components/dashboard/DashboardDeliveryItem';
import { DashboardPaymentItem } from '../components/dashboard/DashboardPaymentItem';

const stats = [
  { label: 'Annonces actives', value: 12, color: '#2E7D32', icon: <Inventory2OutlinedIcon /> },
  { label: 'Livraisons en cours', value: 3, color: '#0277BD', icon: <LocalShippingOutlinedIcon /> },
  { label: 'En attente de paiement', value: 2, color: '#F57C00', icon: <CreditCardOutlinedIcon /> },
];

const recentAnnouncements = [
  {
    id: 'ANN-001',
    title: 'Colis Paris → Lyon',
    type: 'Petite livraison',
    deadline: '15 Dec 2025',
    budget: '25€',
    status: 'PUBLISHED' as AnnouncementStatus,
  },
  {
    id: 'ANN-002',
    title: 'Documents Marseille → Toulouse',
    type: 'Document',
    deadline: '10 Dec 2025',
    budget: '15€',
    status: 'ASSIGNED' as AnnouncementStatus,
  },
  {
    id: 'ANN-003',
    title: 'Palette Lille → Nantes',
    type: 'Grande livraison',
    deadline: '20 Dec 2025',
    budget: '85€',
    status: 'DRAFT' as AnnouncementStatus,
  },
];

const activeDeliveries = [
  {
    id: 'DLV-001',
    title: 'Paris → Lyon',
    driver: 'Marie L.',
    from: 'Paris 75001',
    to: 'Lyon 69001',
    estimatedTime: '2h 30min',
    status: 'IN_TRANSIT' as DeliveryStatus,
  },
  {
    id: 'DLV-002',
    title: 'Bordeaux → Rennes',
    driver: 'Thomas M.',
    from: 'Bordeaux 33000',
    to: 'Rennes 35000',
    estimatedTime: '5h 15min',
    status: 'PICKED_UP' as DeliveryStatus,
  },
];

const pendingPayments = [
  { id: 'PAY-001', title: 'Livraison Paris → Lyon', dueDate: '8 Dec 2025', amount: '25,00 €' },
  { id: 'PAY-002', title: 'Livraison Marseille → Toulouse', dueDate: '10 Dec 2025', amount: '15,00 €' },
];

export const ClientDashboardPage = () => {
  const navigate = useNavigate();

  const headerSubtitle = useMemo(
    () => 'Bienvenue sur votre espace client EcoDeli',
    [],
  );

  const handleCreateAnnouncement = () => navigate('/client/annonces/nouvelle');
  const handleSeeAnnouncements = () => navigate('/client/annonces');
  const handleSeeDeliveries = () => navigate('/client/livraisons');
  const handleSeePayments = () => navigate('/client/paiements');

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
          <DashboardStatCard key={stat.label} {...stat} />
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
        subtitle="2 paiements nécessitent votre attention"
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
