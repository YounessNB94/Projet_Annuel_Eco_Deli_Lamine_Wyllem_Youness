import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

interface ProviderStatCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'flat';
    label?: string;
  };
  sx?: SxProps<Theme>;
}

const trendColors = {
  up: 'success.main',
  down: 'error.main',
  flat: 'text.secondary',
} as const;

const trendPrefixes = {
  up: '+',
  down: '-',
  flat: '',
} as const;

export const ProviderStatCard = ({ label, value, icon, trend, sx }: ProviderStatCardProps) => (
  <Box
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      bgcolor: 'background.paper',
      p: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      ...sx,
    }}
  >
    {icon && (
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: (theme) => theme.palette.action.hover,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.main',
        }}
      >
        {icon}
      </Box>
    )}
    <Stack spacing={0.5} flex={1}>
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {label}
      </Typography>
      <Typography variant="h4" component="p" fontWeight={700}>
        {value}
      </Typography>
      {trend && (
        <Typography
          variant="body2"
          sx={{ color: trendColors[trend.direction] }}
          fontWeight={600}
        >
          {`${trendPrefixes[trend.direction]}${trend.value.toFixed(1)}%`}
          {trend.label ? ` • ${trend.label}` : ''}
        </Typography>
      )}
    </Stack>
  </Box>
);
