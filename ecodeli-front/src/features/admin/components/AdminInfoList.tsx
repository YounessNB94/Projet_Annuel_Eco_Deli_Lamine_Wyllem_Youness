import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface AdminInfoItem {
  label: string;
  value: ReactNode;
  helper?: string;
}

interface AdminInfoListProps {
  items: AdminInfoItem[];
  columns?: 1 | 2 | 3;
}

export const AdminInfoList = ({ items, columns = 1 }: AdminInfoListProps) => (
  <Box
    sx={{
      display: 'grid',
      gap: 2,
      gridTemplateColumns: {
        xs: '1fr',
        sm: `repeat(${columns}, minmax(0, 1fr))`,
      },
    }}
  >
    {items.map((item) => (
      <Box
        key={item.label}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {item.label}
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {item.value}
        </Typography>
        {item.helper && (
          <Typography variant="caption" color="text.disabled">
            {item.helper}
          </Typography>
        )}
      </Box>
    ))}
  </Box>
);
