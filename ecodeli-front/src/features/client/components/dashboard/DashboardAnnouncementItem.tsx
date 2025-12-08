import type { MouseEventHandler } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import type { AnnouncementStatus } from '../../api/clientAnnouncements';
import { AnnouncementStatusChip } from '../AnnouncementStatusChip';

interface DashboardAnnouncementItemProps {
  title: string;
  type: string;
  deadline: string;
  budget: string;
  status: AnnouncementStatus;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const DashboardAnnouncementItem = ({
  title,
  type,
  deadline,
  budget,
  status,
  onClick,
}: DashboardAnnouncementItemProps) => (
  <Box
    onClick={onClick}
    sx={{
      p: 2.5,
      borderRadius: 2,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': {
        borderColor: (theme) => theme.palette.success.main,
      },
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
      <Box>
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {type}
        </Typography>
      </Box>
      <AnnouncementStatusChip status={status} />
    </Stack>

    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{ mt: 2 }}
    >
      <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
        <AccessTimeOutlinedIcon fontSize="small" />
        <Typography variant="body2">{deadline}</Typography>
      </Stack>
      <Typography variant="subtitle1" color="success.main" fontWeight={700}>
        {budget}
      </Typography>
    </Stack>
  </Box>
);
