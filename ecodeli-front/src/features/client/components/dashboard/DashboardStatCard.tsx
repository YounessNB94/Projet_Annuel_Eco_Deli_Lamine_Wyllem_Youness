import type { ReactNode } from 'react';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';

interface DashboardStatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

export const DashboardStatCard = ({
  label,
  value,
  icon,
  color,
}: DashboardStatCardProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      height: '100%',
      width:'100%'
    }}
  >
    <CardHeader
      title={
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>
      }
      action={
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: `${color}20`,
            color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      }
      sx={{ pb: 0 }}
    />
    <CardContent sx={{ pt: 1.5 }}>
      <Typography variant="h3" fontWeight={700} sx={{ color }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);
