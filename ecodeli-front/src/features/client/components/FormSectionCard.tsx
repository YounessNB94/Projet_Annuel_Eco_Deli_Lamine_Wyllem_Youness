import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';

interface FormSectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const FormSectionCard = ({
  title,
  subtitle,
  children,
}: FormSectionCardProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (t) => `1px solid ${t.palette.divider}`,
    }}
  >
    <CardHeader
      title={title}
      subheader={subtitle}
      sx={{
        '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 },
        '& .MuiCardHeader-subheader': {
          fontSize: 14,
          color: 'text.secondary',
        },
        pb: 1.5,
      }}
    />
    <CardContent sx={{ pt: 1.5 }}>{children}</CardContent>
  </Card>
);
