import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { AnnouncementStatusChip } from '../components/AnnouncementStatusChip';
import { AnnouncementTimelineCard } from '../components/announcements/AnnouncementTimelineCard';
import { AnnouncementTripCard } from '../components/announcements/AnnouncementTripCard';
import { AnnouncementDescriptionCard } from '../components/announcements/AnnouncementDescriptionCard';
import { AnnouncementBudgetCard } from '../components/announcements/AnnouncementBudgetCard';
import { AnnouncementDriverCard } from '../components/announcements/AnnouncementDriverCard';
import { DeliveryTypeCard } from '../components/delivery/DeliveryTypeCard';
import { useClientAnnouncementDetail } from '../hooks/useClientAnnouncementDetail';

export const ClientAnnouncementDetailPage = () => {
  const navigate = useNavigate();
  const { announcementId } = useParams<{ announcementId: string }>();
  const { data: detail, isLoading, isError } = useClientAnnouncementDetail(announcementId);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const canEdit = useMemo(
    () => detail && (detail.status === 'DRAFT' || detail.status === 'PUBLISHED'),
    [detail],
  );
  const canCancel = useMemo(
    () => detail && detail.status !== 'CANCELLED',
    [detail],
  );

  const handleBack = () => navigate('/client/annonces');
  const handleEdit = () => navigate('/client/annonces/nouvelle');
  const handleViewDelivery = () => {
    if (detail?.deliveryId) {
      navigate(`/client/livraisons/${detail.deliveryId}`);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <Typography>Chargement de l'annonce…</Typography>
      </Box>
    );
  }

  if (isError || !detail) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" gutterBottom>
          Annonce introuvable
        </Typography>
        <Button onClick={handleBack}>Retour à la liste</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ md: 'center' }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={handleBack} sx={{ bgcolor: 'background.paper' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <Typography variant="h4" component="h1" fontWeight={700}>
                {detail.title}
              </Typography>
              <AnnouncementStatusChip status={detail.status} />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Créée le {detail.createdAt}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {canEdit && (
            <Button variant="outlined" startIcon={<EditOutlinedIcon />} onClick={handleEdit}>
              Modifier
            </Button>
          )}
          {canCancel && (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineOutlinedIcon />}
                onClick={() => setCancelDialogOpen(true)}
              >
                Annuler
              </Button>
              <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
                <DialogTitle>Annuler cette annonce ?</DialogTitle>
                <DialogContent>
                  <Typography variant="body2" color="text.secondary">
                    Cette action est irréversible. Le livreur sera notifié.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setCancelDialogOpen(false)}>Retour</Button>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() => setCancelDialogOpen(false)}
                  >
                    Confirmer l'annulation
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <AnnouncementTimelineCard items={detail.timeline} />
          <AnnouncementTripCard
            fromAddress={detail.fromAddress}
            pickupDate={detail.pickupDate}
            pickupTime={detail.pickupTime}
            toAddress={detail.toAddress}
            deliveryDate={detail.deliveryDate}
            deliveryTime={detail.deliveryTime}
          />
          {detail.description && <AnnouncementDescriptionCard description={detail.description} />}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <AnnouncementBudgetCard amount={detail.budget} currency={detail.currency} />
          <DeliveryTypeCard typeLabel={detail.type} />
          {detail.driver && (
            <AnnouncementDriverCard
              driver={detail.driver}
              onViewDelivery={detail.deliveryId ? handleViewDelivery : undefined}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
