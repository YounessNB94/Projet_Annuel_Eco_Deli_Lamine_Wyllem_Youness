import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

import { useClientDeliveryDetail } from '../hooks/useClientDeliveryDetail';
import { DeliveryStatusChip } from '../components/DeliveryStatusChip';
import { DeliveryTimeline } from '../components/delivery/DeliveryTimeline';
import { DeliveryAddressesCard } from '../components/delivery/DeliveryAddressesCard';
import { DeliveryProofsCard } from '../components/delivery/DeliveryProofsCard';
import { DeliveryDriverCard } from '../components/delivery/DeliveryDriverCard';
import { DeliveryPriceCard } from '../components/delivery/DeliveryPriceCard';
import { DeliveryTypeCard } from '../components/delivery/DeliveryTypeCard';

export const ClientDeliveryDetailPage = () => {
  const navigate = useNavigate();
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const { data: detail, isLoading } = useClientDeliveryDetail(deliveryId);

  const handleBack = () => navigate('/client/livraisons');
  const handleViewTracking = () => {
    if (deliveryId) {
      navigate(`/client/livraisons/${deliveryId}/tracking`);
    }
  };

  if (isLoading || !detail) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Chargement de la livraison…
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flex: 1 }}>
          <IconButton onClick={handleBack} sx={{ bgcolor: 'background.paper' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                alignItems: 'center',
              }}
            >
              <Typography variant="h4" component="h1">
                Livraison #{detail.id}
              </Typography>
              <DeliveryStatusChip status={detail.status} />
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {detail.title}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<MapOutlinedIcon />}
          onClick={handleViewTracking}
        >
          Voir le tracking
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            <CardHeader
              title="Statut de la livraison"
              subheader="Suivi en temps réel de votre livraison"
              sx={{
                '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 },
              }}
            />
            <CardContent>
              <DeliveryTimeline items={detail.timeline} />
            </CardContent>
          </Card>

          <DeliveryAddressesCard detail={detail} />

          <DeliveryProofsCard detail={detail} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <DeliveryDriverCard driver={detail.driver} />
          <DeliveryPriceCard price={detail.price} />
          <DeliveryTypeCard typeLabel={detail.typeLabel} />
        </Box>
      </Box>
    </Box>
  );
};
