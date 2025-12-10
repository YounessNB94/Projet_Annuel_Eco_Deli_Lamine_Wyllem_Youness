import type { ReactNode } from 'react';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

interface ProviderSectionCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  disableContentPadding?: boolean;
  sx?: SxProps<Theme>;
}

export const ProviderSectionCard = ({
  title,
  subtitle,
  action,
  children,
  disableContentPadding,
  sx,
}: ProviderSectionCardProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      bgcolor: 'background.paper',
      ...sx,
    }}
  >
    <CardHeader
      title={
        <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1.2rem' }}>
          {title}
        </Typography>
      }
      subheader={subtitle}
      action={action}
      sx={{
        pb: subtitle ? 1 : 0,
      }}
    />
    <CardContent
      sx={
        disableContentPadding
          ? { px: 0, pb: 0 }
          : {
              pt: 0,
            }
      }
    >
      {children}
    </CardContent>
  </Card>
);
