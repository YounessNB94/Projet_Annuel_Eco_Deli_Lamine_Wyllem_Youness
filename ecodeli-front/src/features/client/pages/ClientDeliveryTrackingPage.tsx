import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import { DeliveryStatusChip } from '../components/DeliveryStatusChip';
import { useClientDeliveryDetail } from '../hooks/useClientDeliveryDetail';
import { TrackingMapCard } from '../components/tracking/TrackingMapCard';
import { TrackingProgressCard } from '../components/tracking/TrackingProgressCard';
import { TrackingTimelineCard } from '../components/tracking/TrackingTimelineCard';
import { TrackingStatusCard } from '../components/tracking/TrackingStatusCard';
import { TrackingQuickActionsCard } from '../components/tracking/TrackingQuickActionsCard';
import { TrackingInfoCard } from '../components/tracking/TrackingInfoCard';
import { DeliveryDriverCard } from '../components/delivery/DeliveryDriverCard';
import type { DeliveryStatus } from '../api/clientDeliveries';

const statusLabelMap: Record<DeliveryStatus, string> = {
  ACCEPTED: 'Acceptée',
  PICKED_UP: 'Collectée',
  IN_TRANSIT: 'En transit',
  DELIVERED: 'Livrée',
};

export const ClientDeliveryTrackingPage = () => {
  const navigate = useNavigate();
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const { data: detail, isLoading } = useClientDeliveryDetail(deliveryId);

  const [lastUpdate, setLastUpdate] = useState('Il y a 2 minutes');
  const [refreshing, setRefreshing] = useState(false);

  const progress = useMemo(() => {
    if (!detail || detail.timeline.length === 0) {
      return 0;
    }
    const completedSteps = detail.timeline.filter((item) => item.completed).length;
    return Math.round((completedSteps / detail.timeline.length) * 100);
  }, [detail]);

  const currentLocation = useMemo(() => {
    if (!detail) return '';
    const currentItem = detail.timeline.find((item) => item.current);
    return currentItem?.label ?? detail.to.address;
  }, [detail]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdate("À l'instant");
    }, 1200);
  };

  const handleBack = () => navigate('/client/livraisons');
  const handleGoToDetails = () => navigate(`/client/livraisons/${detail?.id ?? ''}`);
  const handleSharePosition = async () => {
    const shareText = `Suivi de la livraison ${detail?.id ?? ''} - statut ${statusLabelMap[detail?.status ?? 'ACCEPTED']}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'EcoDeli - Tracking', text: shareText });
      } catch (error) {
        console.warn('User cancelled share', error);
      }
    } else {
      console.info(shareText);
    }
  };

  if (isLoading || !detail) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <IconButton onClick={handleBack} sx={{ bgcolor: 'background.paper' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700}>
              Tracking en temps réel
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Livraison #{detail.id}
            </Typography>
          </Box>
        </Box>
        <DeliveryStatusChip status={detail.status} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TrackingMapCard
            fromLabel={detail.from.address}
            toLabel={detail.to.address}
            statusLabel={statusLabelMap[detail.status]}
          />
          <TrackingProgressCard
            fromLabel={detail.from.address}
            toLabel={detail.to.address}
            progress={progress}
          />
          <TrackingTimelineCard items={detail.timeline} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TrackingStatusCard
            status={detail.status}
            statusLabel={statusLabelMap[detail.status]}
            currentLocation={currentLocation}
            estimatedArrival={detail.estimatedDeliveryLabel}
            lastUpdate={lastUpdate}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
          <DeliveryDriverCard driver={detail.driver} />
          <TrackingQuickActionsCard
            onViewDetails={handleGoToDetails}
            onSharePosition={handleSharePosition}
          />
          <TrackingInfoCard />
        </Box>
      </Box>
    </Box>
  );
};
