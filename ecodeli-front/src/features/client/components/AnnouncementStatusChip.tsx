import { Chip } from '@mui/material';
import type { AnnouncementStatus } from '../api/clientAnnouncements';

const statusLabelMap: Record<AnnouncementStatus, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publiée',
  ASSIGNED: 'Assignée',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
};

const statusColorMap: Record<
  AnnouncementStatus,
  'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
> = {
  DRAFT: 'default',
  PUBLISHED: 'info',
  ASSIGNED: 'success',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

interface Props {
  status: AnnouncementStatus;
}

export const AnnouncementStatusChip = ({ status }: Props) => (
  <Chip
    size="small"
    label={statusLabelMap[status]}
    color={statusColorMap[status]}
    variant={status === 'DRAFT' ? 'outlined' : 'filled'}
  />
);
