import type { ReactNode } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';

interface ProviderEmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export const ProviderEmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: ProviderEmptyStateProps) => (
  <Stack spacing={2} alignItems="center" textAlign="center" sx={{ py: 6 }}>
    {icon && (
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 2,
          bgcolor: (theme) => theme.palette.action.hover,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
        }}
      >
        {icon}
      </Box>
    )}
    <Stack spacing={0.5}>
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </Stack>
    {actionLabel && onAction && (
      <Button variant="contained" color="primary" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Stack>
);
