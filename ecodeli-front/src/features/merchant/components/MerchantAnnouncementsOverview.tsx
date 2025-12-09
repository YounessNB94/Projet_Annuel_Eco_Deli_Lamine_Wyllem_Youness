import { Box, Card, CardContent, Stack, Typography, Chip } from '@mui/material';
import type { MerchantAnnouncement } from '../api/merchantAnnouncements';

interface MerchantAnnouncementsOverviewProps {
  announcements: MerchantAnnouncement[];
}

const metricsConfig = [
  {
    key: 'total',
    label: 'Annonces actives',
    color: 'primary' as const,
    compute: (items: MerchantAnnouncement[]) => items.length,
  },
  {
    key: 'published',
    label: 'Publiées',
    color: 'success' as const,
    compute: (items: MerchantAnnouncement[]) =>
      items.filter((item) => item.status === 'PUBLISHED').length,
  },
  {
    key: 'draft',
    label: 'Brouillons',
    color: 'default' as const,
    compute: (items: MerchantAnnouncement[]) =>
      items.filter((item) => item.status === 'DRAFT').length,
  },
];

export const MerchantAnnouncementsOverview = ({ announcements }: MerchantAnnouncementsOverviewProps) => (
  <Box
    sx={{
      display: 'grid',
      gap: 2,
      gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
    }}
  >
    {metricsConfig.map((metric) => (
      <Card
        key={metric.key}
        elevation={0}
        sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary">
              {metric.label}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {metric.compute(announcements)}
            </Typography>
            <Chip label={metric.label} color={metric.color} size="small" variant="outlined" />
          </Stack>
        </CardContent>
      </Card>
    ))}
  </Box>
);
