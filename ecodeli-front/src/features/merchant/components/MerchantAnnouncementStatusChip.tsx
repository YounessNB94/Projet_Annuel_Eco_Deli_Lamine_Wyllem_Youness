import { Chip } from '@mui/material';
import type { MerchantAnnouncementStatus } from '../api/merchantAnnouncements';

const statusLabelMap: Record<MerchantAnnouncementStatus, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publiée',
};

const statusColorMap: Record<MerchantAnnouncementStatus, 'default' | 'success' | 'info'> = {
  DRAFT: 'default',
  PUBLISHED: 'success',
};

interface MerchantAnnouncementStatusChipProps {
  status: MerchantAnnouncementStatus;
}

export const MerchantAnnouncementStatusChip = ({ status }: MerchantAnnouncementStatusChipProps) => (
  <Chip
    size="small"
    label={statusLabelMap[status]}
    color={statusColorMap[status]}
    variant={status === 'DRAFT' ? 'outlined' : 'filled'}
  />
);
