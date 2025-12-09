import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  MenuItem,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import type { CourierDelivery, CourierDeliveryDetail, CourierDeliveryStatus } from '../api/courierDeliveries';
import { useCourierDeliveries } from '../hooks/useCourierDeliveries';
import { useCourierAdvanceDeliveryStatus } from '../hooks/useCourierAdvanceDeliveryStatus';
import { CourierDeliveryCard } from '../components/CourierDeliveryCard';

const statusLabels: Record<CourierDeliveryStatus, string> = {
  ACCEPTED: 'Mission acceptee',
  PICKED_UP: 'Collecte effectuee',
  IN_TRANSIT: 'En transit',
  DELIVERED: 'Livree',
};

interface TrackingEvent {
  id: string;
  message: string;
  dateLabel: string;
}

const StatCard = ({ icon, title, value }: { icon: ReactNode; title: string; value: string }) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: 3,
    }}
  >
    <CardContent>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        {icon}
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Stack>
      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export const CourierDeliveriesPage = () => {
  const { data = [], isLoading, isError, refetch } = useCourierDeliveries();
  const { mutateAsync, isPending } = useCourierAdvanceDeliveryStatus();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | CourierDeliveryStatus>('ALL');
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [trackingDetail, setTrackingDetail] = useState<CourierDeliveryDetail | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [progressingId, setProgressingId] = useState<string | null>(null);

  const activeDeliveries = useMemo(
    () => data.filter((delivery) => delivery.status !== 'DELIVERED'),
    [data],
  );

  const totalEarnings = useMemo(
    () => data.reduce((acc, delivery) => acc + delivery.earnings, 0),
    [data],
  );

  const deliveriesGridSx = {
    display: 'grid',
    gap: 3,
    gridTemplateColumns: {
      xs: '1fr',
      md: 'repeat(2, minmax(0, 1fr))',
    },
  } as const;

  const filteredDeliveries = useMemo(() => {
    const searchLower = search.toLowerCase();

    return data.filter((delivery) => {
      const matchesSearch =
        !search ||
        delivery.id.toLowerCase().includes(searchLower) ||
        delivery.title.toLowerCase().includes(searchLower) ||
        delivery.clientName.toLowerCase().includes(searchLower) ||
        delivery.pickupAddress.toLowerCase().includes(searchLower) ||
        delivery.dropoffAddress.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'ALL' || delivery.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const handleViewBrief = (deliveryId: string) => {
    navigate(`/courier/livraisons/${deliveryId}`);
  };

  const pushTrackingEvent = (detail: CourierDeliveryDetail) => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    const event: TrackingEvent = {
      id: `${detail.id}-${now.getTime()}`,
      message: `Statut passe a ${statusLabels[detail.status]}`,
      dateLabel: formatter.format(now),
    };
    setTrackingEvents((previous) => [event, ...previous].slice(0, 5));
  };

  const handleProgress = async (deliveryId: string) => {
    if (progressingId) {
      return;
    }
    setProgressingId(deliveryId);
    try {
      const updated = await mutateAsync(deliveryId);
      setSnackbar(`Statut mis a jour: ${statusLabels[updated.status]}`);
      pushTrackingEvent(updated);
      setTrackingDetail(updated);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Action impossible';
      setSnackbar(message);
    } finally {
      setProgressingId(null);
    }
  };

  const closeTrackingDialog = () => setTrackingDetail(null);

  const goToTrackingDetail = () => {
    if (!trackingDetail) {
      return;
    }
    const targetId = trackingDetail.id;
    closeTrackingDialog();
    navigate(`/courier/livraisons/${targetId}`);
  };

  const closeSnackbar = () => setSnackbar(null);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={deliveriesGridSx}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Box key={`delivery-skeleton-${index}`}>
              <Skeleton variant="rounded" height={320} animation="wave" />
            </Box>
          ))}
        </Box>
      );
    }

    if (isError) {
      return (
        <Alert severity="error" sx={{ borderRadius: 2 }} action={<Button onClick={() => refetch()}>Reessayer</Button>}>
          Impossible de charger vos livraisons.
        </Alert>
      );
    }

    if (filteredDeliveries.length === 0) {
      return (
        <Alert severity="info" icon={<LocalShippingOutlinedIcon />} sx={{ borderRadius: 2 }}>
          Aucun resultat avec ces filtres. Ajuste ta recherche pour retrouver une mission.
        </Alert>
      );
    }

    return (
      <Box sx={deliveriesGridSx}>
        {filteredDeliveries.map((delivery: CourierDelivery) => (
          <Box key={delivery.id}>
            <CourierDeliveryCard
              delivery={delivery}
              onViewBrief={handleViewBrief}
              onSimulateProgress={handleProgress}
              isUpdating={progressingId === delivery.id && isPending}
            />
          </Box>
        ))}
      </Box>
    );
  };

  const trackingDialog = trackingDetail ? (
    <Dialog open onClose={closeTrackingDialog} fullWidth maxWidth="md">
      <DialogTitle>Suivi de la livraison #{trackingDetail.id}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Timeline des evenements
            </Typography>
            <Stack spacing={2}>
              {trackingDetail.timeline.map((item) => (
                <Box
                  key={`${trackingDetail.id}-${item.status}`}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    bgcolor: item.current ? 'action.hover' : 'background.paper',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack spacing={0.5}>
                      <Typography variant="body1" fontWeight={600}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.dateLabel}
                      </Typography>
                    </Stack>
                    <Chip
                      color={item.completed ? (item.current ? 'info' : 'success') : 'default'}
                      label={statusLabels[item.status]}
                      variant={item.completed ? 'filled' : 'outlined'}
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Evenements de suivi
            </Typography>
            {trackingEvents.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Aucun evenement enregistre pour le moment.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {trackingEvents.map((event) => (
                  <Box
                    key={event.id}
                    sx={{
                      borderRadius: 2,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {event.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {event.dateLabel}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeTrackingDialog}>Fermer</Button>
        <Button onClick={goToTrackingDetail}>
          Voir la fiche
        </Button>
      </DialogActions>
    </Dialog>
  ) : null;

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Mes livraisons
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Toutes les missions qui te sont assignees et leurs prochaines etapes.
          </Typography>
        </Box>

        <Button variant="outlined" startIcon={<RefreshOutlinedIcon />} onClick={() => refetch()} disabled={isLoading}>
          Rafraichir
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          mb: 4,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 240 }}>
          <StatCard
            icon={<LocalShippingOutlinedIcon color="primary" />}
            title="Livraisons actives"
            value={`${activeDeliveries.length}`}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 240 }}>
          <StatCard icon={<RefreshOutlinedIcon color="success" />} title="Gains cumules" value={`${totalEarnings.toFixed(0)} EUR`} />
        </Box>
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Rechercher une mission..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              size="small"
              select
              label="Statut"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'ALL' | CourierDeliveryStatus)}
            >
              <MenuItem value="ALL">Tous les statuts</MenuItem>
              <MenuItem value="ACCEPTED">Mission acceptee</MenuItem>
              <MenuItem value="PICKED_UP">Collecte effectuee</MenuItem>
              <MenuItem value="IN_TRANSIT">En transit</MenuItem>
              <MenuItem value="DELIVERED">Livree</MenuItem>
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {renderContent()}

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={3500}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={snackbar ?? ''}
      />

      {trackingDialog}
    </Box>
  );
};
