import { useMemo } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

import type { Announcement } from '../api/clientAnnouncements';
import type { AnnouncementFormValues } from '../types/announcementForm';
import { AnnouncementStatusChip } from './AnnouncementStatusChip';
import { ClientAnnouncementForm, type AnnouncementFormSubmitAction } from './ClientAnnouncementForm';

interface ClientAnnouncementEditDialogProps {
  open: boolean;
  announcement: Announcement | null;
  onClose: () => void;
  onSubmit: (values: AnnouncementFormValues) => void;
}

const announcementToFormValues = (announcement: Announcement): AnnouncementFormValues => ({
  ...(announcement as unknown as AnnouncementFormValues),
});

export const ClientAnnouncementEditDialog = ({
  open,
  announcement,
  onClose,
  onSubmit,
}: ClientAnnouncementEditDialogProps) => {
  const initialValues = useMemo<AnnouncementFormValues | null>(() => {
    if (!announcement) {
      return null;
    }
    return announcementToFormValues(announcement);
  }, [announcement]);

  const handleSubmit = (values: AnnouncementFormValues, action: AnnouncementFormSubmitAction) => {
    if (action !== 'save') {
      return;
    }
    onSubmit(values);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Modifier l'annonce</DialogTitle>
      <DialogContent dividers>
        {announcement && initialValues ? (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Annonce
              </Typography>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {announcement.title}
                <AnnouncementStatusChip status={announcement.status} />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trajet actuel : {announcement.origin} {'->'} {announcement.destination}
              </Typography>
            </Box>

            <ClientAnnouncementForm
              mode="edit"
              variant="dialog"
              initialValues={initialValues}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Aucune annonce selectionnee.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

ClientAnnouncementEditDialog.displayName = 'ClientAnnouncementEditDialog';
