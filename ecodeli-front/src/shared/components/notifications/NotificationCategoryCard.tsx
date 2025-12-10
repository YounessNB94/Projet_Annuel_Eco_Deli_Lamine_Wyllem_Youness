import { Card, CardContent, Chip, Stack, Typography, Box } from '@mui/material';
import type { FC } from 'react';
import type { NotificationCategory } from '../../types/notifications';

interface NotificationCategoryCardProps {
  category: NotificationCategory;
  roleLabel: string;
}

export const NotificationCategoryCard: FC<NotificationCategoryCardProps> = ({ category, roleLabel }) => {
  const Icon = category.icon;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: (theme) => theme.palette[category.accent].light,
              color: (theme) => theme.palette[category.accent].dark,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
              <Typography variant="h6" fontWeight={700}>
                {category.title}
              </Typography>
              <Chip
                label={roleLabel}
                color={category.accent}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {category.subtitle}
            </Typography>
          </Box>
          {category.actions}
        </Stack>

        <Stack component="ul" sx={{ mt: 3, pl: 2, m: 0 }} spacing={1.5}>
          {category.items.map((item) => (
            <Typography component="li" variant="body1" key={item}>
              {item}
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};
