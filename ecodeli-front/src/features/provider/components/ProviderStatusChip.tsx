import { Chip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ProviderStatusToken } from '../types';

interface ProviderStatusChipProps {
  status: ProviderStatusToken;
  sx?: SxProps<Theme>;
}

const STATUS_CONFIG = {
  PENDING: { label: 'En attente', color: '#B45309', background: 'rgba(245,158,11,0.15)' },
  CONFIRMED: { label: 'Confirmée', color: '#065F46', background: 'rgba(16,185,129,0.18)' },
  IN_PROGRESS: { label: 'En cours', color: '#0E7490', background: 'rgba(14,116,144,0.16)' },
  COMPLETED: { label: 'Terminée', color: '#065F46', background: 'rgba(16,185,129,0.18)' },
  CANCELLED: { label: 'Annulée', color: '#991B1B', background: 'rgba(239,68,68,0.16)' },
  PENDING_REVIEW: { label: 'En validation', color: '#92400E', background: 'rgba(245,158,11,0.12)' },
  APPROVED: { label: 'Validée', color: '#166534', background: 'rgba(34,197,94,0.14)' },
  REJECTED: { label: 'Refusée', color: '#991B1B', background: 'rgba(239,68,68,0.18)' },
  MISSING: { label: 'Manquant', color: '#B91C1C', background: 'rgba(248,113,113,0.18)' },
  UNDER_REVIEW: { label: 'En vérification', color: '#92400E', background: 'rgba(251,191,36,0.16)' },
  EXPIRED: { label: 'Expiré', color: '#9A3412', background: 'rgba(251,146,60,0.16)' },
  AVAILABLE: { label: 'Disponible', color: '#0F766E', background: 'rgba(45,212,191,0.16)' },
  UNAVAILABLE: { label: 'Indisponible', color: '#9A3412', background: 'rgba(251,146,60,0.16)' },
  READY: { label: 'Prêt', color: '#065F46', background: 'rgba(16,185,129,0.16)' },
  DUE: { label: 'À payer', color: '#92400E', background: 'rgba(251,191,36,0.16)' },
  PAID: { label: 'Payée', color: '#14532D', background: 'rgba(34,197,94,0.16)' },
  PROCESSING: { label: 'En traitement', color: '#0E7490', background: 'rgba(14,165,233,0.16)' },
  READY_FOR_PAYOUT: { label: 'Paiement prêt', color: '#0F766E', background: 'rgba(45,212,191,0.18)' },
  PAUSED: { label: 'En pause', color: '#4B5563', background: 'rgba(107,114,128,0.16)' },
} as const;

export type ProviderStatusKey = keyof typeof STATUS_CONFIG;

export const ProviderStatusChip = ({ status, sx }: ProviderStatusChipProps) => {
  const config = STATUS_CONFIG[status as ProviderStatusKey] ?? {
    label: status,
    color: '#1F2937',
    background: 'rgba(148,163,184,0.18)',
  };

  return (
    <Chip
      size="small"
      label={config.label}
      sx={{
        fontWeight: 600,
        letterSpacing: 0.2,
        color: config.color,
        bgcolor: config.background,
        ...sx,
      }}
    />
  );
};
