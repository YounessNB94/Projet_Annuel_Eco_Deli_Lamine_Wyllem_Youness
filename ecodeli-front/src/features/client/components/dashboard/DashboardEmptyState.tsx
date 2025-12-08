import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface DashboardEmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const DashboardEmptyState = ({
  icon,
  title,
  description,
  action,
}: DashboardEmptyStateProps) => (
  <Box sx={{ textAlign: 'center', py: 6 }}>
    <Box
      sx={{
        width: 72,
        height: 72,
        mx: 'auto',
        borderRadius: '50%',
        bgcolor: 'grey.100',
        color: 'text.secondary',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      {icon}
    </Box>
    <Typography variant="subtitle1" fontWeight={600}>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {description}
      </Typography>
    )}
    {action && <Box sx={{ mt: 2 }}>{action}</Box>}
  </Box>
);
