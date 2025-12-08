import { Chip } from '@mui/material';
import type { DeliveryStatus } from '../api/clientDeliveries';

const statusLabelMap: Record<DeliveryStatus, string> = {
  ACCEPTED: 'Acceptée',
  PICKED_UP: 'Collectée',
  IN_TRANSIT: 'En transit',
  DELIVERED: 'Livrée',
};

const statusColorMap: Record<
  DeliveryStatus,
  'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
> = {
  ACCEPTED: 'success',
  PICKED_UP: 'info',
  IN_TRANSIT: 'warning',
  DELIVERED: 'success',
};

interface Props {
  status: DeliveryStatus;
}

export const DeliveryStatusChip = ({ status }: Props) => (
  <Chip
    size="small"
    label={statusLabelMap[status]}
    color={statusColorMap[status]}
  />
);
