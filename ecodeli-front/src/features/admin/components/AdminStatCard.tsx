import { Card, CardContent, Stack, Typography, Chip, Box } from '@mui/material';
import type { ReactNode } from 'react';

interface AdminStatCardProps {
  label: string;
  value: string | number;
  helper?: string;
  icon?: ReactNode;
  trend?: {
    label: string;
    color?: 'default' | 'success' | 'error' | 'warning' | 'info';
  };
}

export const AdminStatCard = ({ label, value, helper, icon, trend }: AdminStatCardProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      height: '100%',
    }}
  >
    <CardContent>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          {icon && <Box sx={{ color: 'primary.main' }}>{icon}</Box>}
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
        </Stack>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
        {helper && (
          <Typography variant="body2" color="text.secondary">
            {helper}
          </Typography>
        )}
        {trend && <Chip label={trend.label} color={trend.color ?? 'success'} size="small" variant="outlined" />}
      </Stack>
    </CardContent>
  </Card>
);
