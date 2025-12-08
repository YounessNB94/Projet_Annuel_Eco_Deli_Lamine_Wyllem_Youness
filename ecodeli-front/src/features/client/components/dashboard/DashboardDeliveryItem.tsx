import type { MouseEventHandler } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import type { DeliveryStatus } from '../../api/clientDeliveries';
import { DeliveryStatusChip } from '../DeliveryStatusChip';

interface DashboardDeliveryItemProps {
  title: string;
  driver: string;
  from: string;
  to: string;
  estimatedTime: string;
  status: DeliveryStatus;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const DashboardDeliveryItem = ({
  title,
  driver,
  from,
  to,
  estimatedTime,
  status,
  onClick,
}: DashboardDeliveryItemProps) => (
  <Box
    onClick={onClick}
    sx={{
      p: 2.5,
      borderRadius: 2,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': {
        borderColor: (theme) => theme.palette.info.main,
      },
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
      <Box>
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Livreur: {driver}
        </Typography>
      </Box>
      <DeliveryStatusChip status={status} />
    </Stack>

    <Stack direction="row" spacing={2} color="text.secondary" sx={{ mt: 2 }}>
      <RoomOutlinedIcon fontSize="small" />
      <Box>
        <Typography variant="body2">{from}</Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {to}
        </Typography>
      </Box>
    </Stack>

    <Divider sx={{ my: 2 }} />

    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary">
        Arrivée estimée
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center" color="info.main">
        <AccessTimeOutlinedIcon fontSize="small" />
        <Typography variant="body2" fontWeight={600}>
          {estimatedTime}
        </Typography>
      </Stack>
    </Stack>
  </Box>
);
