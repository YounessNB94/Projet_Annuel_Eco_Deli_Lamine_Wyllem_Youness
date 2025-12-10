import { Chip } from '@mui/material';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import EuroSymbolOutlinedIcon from '@mui/icons-material/EuroSymbolOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import type { ReactNode } from 'react';

export const adminStatusConfig = {
  pending: {
    label: 'En attente',
    color: 'warning' as const,
    icon: <HourglassEmptyOutlinedIcon fontSize="inherit" />,
  },
  review: {
    label: 'En revue',
    color: 'info' as const,
    icon: <PendingActionsOutlinedIcon fontSize="inherit" />,
  },
  approved: {
    label: 'Validé',
    color: 'success' as const,
    icon: <TaskAltOutlinedIcon fontSize="inherit" />,
  },
  rejected: {
    label: 'Refusé',
    color: 'error' as const,
    icon: <HighlightOffOutlinedIcon fontSize="inherit" />,
  },
  paused: {
    label: 'Suspendu',
    color: 'default' as const,
    icon: <PauseCircleOutlineOutlinedIcon fontSize="inherit" />,
  },
  scheduled: {
    label: 'Planifiée',
    color: 'info' as const,
    icon: <EventNoteOutlinedIcon fontSize="inherit" />,
  },
  active: {
    label: 'En cours',
    color: 'primary' as const,
    icon: <PlayCircleOutlineIcon fontSize="inherit" />,
  },
  delivered: {
    label: 'Livrée',
    color: 'success' as const,
    icon: <DoneAllOutlinedIcon fontSize="inherit" />,
  },
  cancelled: {
    label: 'Annulée',
    color: 'error' as const,
    icon: <CancelOutlinedIcon fontSize="inherit" />,
  },
  delayed: {
    label: 'Retard',
    color: 'warning' as const,
    icon: <AccessTimeOutlinedIcon fontSize="inherit" />,
  },
  paid: {
    label: 'Payée',
    color: 'success' as const,
    icon: <PaidOutlinedIcon fontSize="inherit" />,
  },
  due: {
    label: 'À régler',
    color: 'primary' as const,
    icon: <EuroSymbolOutlinedIcon fontSize="inherit" />,
  },
  overdue: {
    label: 'En retard',
    color: 'error' as const,
    icon: <WarningAmberOutlinedIcon fontSize="inherit" />,
  },
  draft: {
    label: 'Brouillon',
    color: 'default' as const,
    icon: <DraftsOutlinedIcon fontSize="inherit" />,
  },
};

export type AdminStatus = keyof typeof adminStatusConfig;

interface AdminStatusChipProps {
  status: AdminStatus;
  label?: string;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined';
  icon?: ReactNode;
}

export const AdminStatusChip = ({ status, label, size = 'small', variant = 'filled', icon }: AdminStatusChipProps) => {
  const config = adminStatusConfig[status];

  return (
    <Chip
      size={size}
      label={label ?? config.label}
      color={config.color}
      variant={variant}
      icon={icon ?? config.icon}
      sx={{ fontWeight: 600 }}
    />
  );
};
