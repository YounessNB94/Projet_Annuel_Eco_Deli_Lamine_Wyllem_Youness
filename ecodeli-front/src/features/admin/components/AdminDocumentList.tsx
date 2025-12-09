import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';
import type { ReactNode } from 'react';

export interface AdminDocumentItem {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  status: {
    label: string;
    color?: ChipProps['color'];
    variant?: 'filled' | 'outlined';
  };
  icon?: ReactNode;
  actions?: ReactNode;
}

interface AdminDocumentListProps {
  items: AdminDocumentItem[];
}

export const AdminDocumentList = ({ items }: AdminDocumentListProps) => (
  <Stack spacing={2}>
    {items.map((item) => (
      <Stack
        key={item.id}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        sx={{
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" flex={1} minWidth={0}>
          <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
            {item.icon ?? <DescriptionOutlinedIcon fontSize="small" />}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" fontWeight={600} noWrap>
              {item.title}
            </Typography>
            {item.description && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {item.description}
              </Typography>
            )}
            {item.meta && (
              <Typography variant="caption" color="text.disabled">
                {item.meta}
              </Typography>
            )}
          </Box>
        </Stack>
        <Chip
          label={item.status.label}
          color={item.status.color}
          variant={item.status.variant ?? 'outlined'}
          size="small"
          sx={{ fontWeight: 600 }}
        />
        {item.actions && (
          <Box sx={{ display: 'flex', gap: 1 }}>{item.actions}</Box>
        )}
      </Stack>
    ))}
  </Stack>
);
