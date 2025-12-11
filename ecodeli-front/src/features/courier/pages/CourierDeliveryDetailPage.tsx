import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import type {
  CourierDeliveryDetail,
  CourierDeliveryStatus,
  CourierDeliveryTimelineItem,
} from '../api/courierDeliveries';
import { useCourierDeliveryDetail } from '../hooks/useCourierDeliveryDetail';
import { useCourierAdvanceDeliveryStatus } from '../hooks/useCourierAdvanceDeliveryStatus';

const STATUS_FLOW: CourierDeliveryStatus[] = ['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];

const statusLabels: Record<CourierDeliveryStatus, string> = {
  ACCEPTED: 'Mission acceptee',
  PICKED_UP: 'Colis collecte',
  IN_TRANSIT: 'En cours de livraison',
  DELIVERED: 'Livree',
};

const statusColors: Record<CourierDeliveryStatus, 'default' | 'info' | 'warning' | 'success'> = {
  ACCEPTED: 'default',
  PICKED_UP: 'info',
  IN_TRANSIT: 'warning',
  DELIVERED: 'success',
};

const TimelineList = ({ items }: { items: CourierDeliveryTimelineItem[] }) => (
  <Stack spacing={2}>
    {items.map((item) => (
      <Stack key={item.status} direction="row" spacing={2} alignItems="center">
        <Chip
          label={statusLabels[item.status]}
          color={statusColors[item.status]}
          variant={item.completed ? 'filled' : 'outlined'}
        />
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {item.label}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.dateLabel}
          </Typography>
        </Box>
      </Stack>
    ))}
  </Stack>
);

const ContactCard = ({
  title,
  address,
  contactName,
  phone,
}: {
  title: string;
  address: string;
  contactName: string;
  phone: string;
}) => (
  <Card variant="outlined" sx={{ borderRadius: 3 }}>
    <CardHeader title={title} sx={{ '& .MuiCardHeader-title': { fontSize: 16, fontWeight: 600 } }} />
    <CardContent>
      <Typography variant="body2" fontWeight={600}>
        {address}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Contact {contactName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Tel {phone}
      </Typography>
    </CardContent>
  </Card>
);

const MissionSummary = ({ detail }: { detail: CourierDeliveryDetail }) => (
  <Card variant="outlined" sx={{ borderRadius: 3 }}>
    <CardHeader
      avatar={<LocalShippingOutlinedIcon color="primary" />}
      title="Mission"
      subheader={`Vehicule ${detail.vehicleType}`}
      sx={{ '& .MuiCardHeader-title': { fontSize: 16, fontWeight: 600 } }}
    />
    <CardContent>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Fenetre collecte
          </Typography>
          <Typography variant="body2">{detail.pickupWindow}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Fenetre livraison
          </Typography>
          <Typography variant="body2">{detail.dropoffWindow}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Distance / gains
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {detail.distanceKm} km • {detail.earnings.toFixed(0)} EUR
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Chargement
          </Typography>
          <Typography variant="body2">{detail.packageType}</Typography>
          <Typography variant="body2" color="text.secondary">
            {detail.weight}
          </Typography>
        </Box>
        {detail.instructions ? (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Instructions
            </Typography>
            <Typography variant="body2">{detail.instructions}</Typography>
          </Box>
        ) : null}
      </Stack>
    </CardContent>
  </Card>
);

export const CourierDeliveryDetailPage = () => {
  const navigate = useNavigate();
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const { data, isLoading, isError } = useCourierDeliveryDetail(deliveryId);
  const { mutateAsync, isPending } = useCourierAdvanceDeliveryStatus();

  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const nextStatus = useMemo(() => {
    if (!data) {
      return null;
    }
    const currentIndex = STATUS_FLOW.indexOf(data.status);
    if (currentIndex === -1 || currentIndex === STATUS_FLOW.length - 1) {
      return null;
    }
    return STATUS_FLOW[currentIndex + 1];
  }, [data]);

  const handleAdvanceStatus = async () => {
    if (!deliveryId || !nextStatus) {
      return;
    }
    try {
      const updated = await mutateAsync({ deliveryId, nextStatus });
      setSnackbar({ message: `Statut mis a jour vers ${statusLabels[updated.status]}`, severity: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Action impossible';
      setSnackbar({ message, severity: 'error' });
    }
  };

  const closeSnackbar = () => setSnackbar(null);

  const handleBack = () => navigate('/courier/livraisons');

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={240} height={48} />
        <Skeleton variant="rounded" height={320} sx={{ mt: 3 }} />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        Impossible de charger cette livraison.
      </Alert>
    );
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Retour
          </Button>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <Typography variant="h4" component="h1" fontWeight={700}>
                Livraison #{data.id}
              </Typography>
              <Chip label={statusLabels[data.status]} color={statusColors[data.status]} />
            </Stack>
            <Typography variant="body1" color="text.secondary">
              {data.title}
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          startIcon={<CheckCircleOutlineOutlinedIcon />}
          onClick={handleAdvanceStatus}
          disabled={!nextStatus || isPending}
        >
          {nextStatus ? `Passer a ${statusLabels[nextStatus]}` : 'Mission terminee'}
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3,
        }}
      >
        <Box flex={1}>
          <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
            <CardHeader
              title="Statut et etapes"
              subheader="Suivi des evenements"
              sx={{ '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 } }}
            />
            <CardContent>
              <TimelineList items={data.timeline} />
            </CardContent>
          </Card>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
            }}
          >
            <Box flex={1}>
              <ContactCard
                title="Collecte"
                address={data.pickupAddress}
                contactName={data.pickupContact.name}
                phone={data.pickupContact.phone}
              />
            </Box>
            <Box flex={1}>
              <ContactCard
                title="Livraison"
                address={data.dropoffAddress}
                contactName={data.dropoffContact.name}
                phone={data.dropoffContact.phone}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: { xs: '100%', lg: 360 },
            flexShrink: 0,
          }}
        >
          <MissionSummary detail={data} />
        </Box>
      </Box>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={3500}
        onClose={closeSnackbar}
        message={snackbar?.message}
      />
    </Box>
  );
};
