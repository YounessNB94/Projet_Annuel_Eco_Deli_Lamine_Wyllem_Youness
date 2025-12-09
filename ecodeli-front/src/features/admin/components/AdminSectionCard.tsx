import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';

interface AdminSectionCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export const AdminSectionCard = ({ title, subtitle, action, children }: AdminSectionCardProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      height: '100%',
    }}
  >
    <CardHeader
      title={title}
      subheader={subtitle}
      action={action}
      sx={{
        '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 },
        '& .MuiCardHeader-subheader': { fontSize: 14, color: 'text.secondary' },
        pb: 1,
      }}
    />
    <CardContent sx={{ p: 3 }}>{children}</CardContent>
  </Card>
);
