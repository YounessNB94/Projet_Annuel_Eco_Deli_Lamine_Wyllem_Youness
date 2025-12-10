import { Chip } from '@mui/material';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import type { ClientPaymentStatus } from '../../api/clientPayments';

const STATUS_META: Record<ClientPaymentStatus, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'; icon: React.ReactElement }> = {
  due: {
    label: 'A payer',
    color: 'warning',
    icon: <PendingActionsOutlinedIcon fontSize="inherit" />,
  },
  processing: {
    label: 'Traitement',
    color: 'info',
    icon: <AutorenewOutlinedIcon fontSize="inherit" />,
  },
  paid: {
    label: 'Payee',
    color: 'success',
    icon: <PaidOutlinedIcon fontSize="inherit" />,
  },
  failed: {
    label: 'Echec',
    color: 'error',
    icon: <ErrorOutlineOutlinedIcon fontSize="inherit" />,
  },
};

interface ClientPaymentStatusChipProps {
  status: ClientPaymentStatus;
}

export const ClientPaymentStatusChip = ({ status }: ClientPaymentStatusChipProps) => {
  const meta = STATUS_META[status];
  return <Chip size="small" color={meta.color} label={meta.label} icon={meta.icon} sx={{ fontWeight: 600 }} />;
};
