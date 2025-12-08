import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

interface DashboardSectionCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export const DashboardSectionCard = ({
  title,
  subtitle,
  action,
  children,
}: DashboardSectionCardProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      height: '100%',
    }}
  >
    <CardHeader
      title={
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
      }
      subheader={
        subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )
      }
      action={action}
      sx={{ '& .MuiCardHeader-action': { marginTop: 0, alignSelf: 'center' } }}
    />
    <CardContent>{children}</CardContent>
  </Card>
);
