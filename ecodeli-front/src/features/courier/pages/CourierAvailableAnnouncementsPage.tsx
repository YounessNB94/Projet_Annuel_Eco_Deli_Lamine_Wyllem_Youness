import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import EnergySavingsLeafOutlinedIcon from '@mui/icons-material/EnergySavingsLeafOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import type { CourierAvailableAnnouncement } from '../api/courierAnnouncements';
import { useCourierAvailableAnnouncements } from '../hooks/useCourierAvailableAnnouncements';
import { useCourierTakeOverAnnouncement } from '../hooks/useCourierTakeOverAnnouncement';
import { AvailableAnnouncementCard } from '../components/AvailableAnnouncementCard';

const StatCard = ({ icon, title, value }: { icon: ReactNode; title: string; value: string }) => (
  <Stack
    spacing={1}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      p: 3,
      bgcolor: 'background.paper',
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      {icon}
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </Stack>
    <Typography variant="h5" fontWeight={600}>
      {value}
    </Typography>
  </Stack>
);

export const CourierAvailableAnnouncementsPage = () => {
  const { data = [], isLoading, isError, refetch } = useCourierAvailableAnnouncements();
  const { mutateAsync, isPending } = useCourierTakeOverAnnouncement();

  const [announcementIdToConfirm, setAnnouncementIdToConfirm] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const totalCarbonSaving = useMemo(
    () => data.reduce((acc, announcement) => acc + announcement.carbonSavingKg, 0),
    [data],
  );

  const handleTakeOver = (id: string) => setAnnouncementIdToConfirm(id);

  const confirmTakeOver = async () => {
    if (!announcementIdToConfirm) {
      return;
    }

    try {
      const result = await mutateAsync(announcementIdToConfirm);
      setSnackbar({ message: result.message, severity: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      setSnackbar({ message, severity: 'error' });
    } finally {
      setAnnouncementIdToConfirm(null);
    }
  };

  const closeSnackbar = () => setSnackbar(null);

  const cardGridSx = {
    display: 'grid',
    gap: 3,
    gridTemplateColumns: {
      xs: '1fr',
      md: 'repeat(2, minmax(0, 1fr))',
      xl: 'repeat(3, minmax(0, 1fr))',
    },
  } as const;

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={cardGridSx}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Box key={`skeleton-${index}`}>
              <Skeleton variant="rounded" height={320} animation="wave" />
            </Box>
          ))}
        </Box>
      );
    }

    if (isError) {
      return (
        <Alert severity="error" sx={{ borderRadius: 2 }} action={<Button onClick={() => refetch()}>Reessayer</Button>}>
          Impossible de charger les annonces disponibles.
        </Alert>
      );
    }

    if (data.length === 0) {
      return (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Aucune annonce disponible pour le moment. Pensez a rafraichir plus tard.
        </Alert>
      );
    }

    return (
      <Box sx={cardGridSx}>
        {data.map((announcement: CourierAvailableAnnouncement) => (
          <Box key={announcement.id}>
            <AvailableAnnouncementCard
              announcement={announcement}
              onTakeOver={handleTakeOver}
              disabled={isPending}
            />
          </Box>
        ))}
      </Box>
    );
  };

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
            Annonces disponibles
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Selectionnez une mission et prenez-la en charge en un clic.
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
          <StatCard icon={<ListAltOutlinedIcon color="primary" />} title="Annonces ouvertes" value={`${data.length}`} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 240 }}>
          <StatCard
            icon={<EnergySavingsLeafOutlinedIcon color="success" />}
            title="Impact carbone economise"
            value={`${totalCarbonSaving.toFixed(1)} kg`}
          />
        </Box>
      </Box>

      {renderContent()}

      <Dialog open={Boolean(announcementIdToConfirm)} onClose={() => setAnnouncementIdToConfirm(null)}>
        <DialogTitle>Confirmer la prise en charge</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous prendre en charge cette annonce ? Le client sera notifie instantanement.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnnouncementIdToConfirm(null)}>Annuler</Button>
          <Button onClick={confirmTakeOver} variant="contained" disabled={isPending}>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {snackbar ? (
          <Alert severity={snackbar.severity} onClose={closeSnackbar} variant="filled" sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};
