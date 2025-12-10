import { Avatar, Box, Chip, IconButton, Stack, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import type { NotificationFeedItem } from '../../types/notifications';

interface NotificationFeedListProps {
  items: NotificationFeedItem[];
  onDismiss?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
}

export const NotificationFeedList = ({ items, onDismiss, onMarkAsRead }: NotificationFeedListProps) => (
  <Stack spacing={2}>
    {items.map((notification) => (
      <Stack
        key={notification.id}
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
            {notification.icon ?? <NotificationsOutlinedIcon fontSize="small" />}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" fontWeight={600} noWrap>
              {notification.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {notification.message}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" mt={0.5}>
              <Typography variant="caption" color="text.disabled">
                {notification.timestamp}
              </Typography>
              {notification.source && (
                <Chip label={notification.source} size="small" variant="outlined" sx={{ height: 24 }} />
              )}
              {notification.category && (
                <Chip label={notification.category} size="small" color="info" variant="outlined" sx={{ height: 24 }} />
              )}
              {notification.severity && (
                <Chip
                  label={notification.severity === 'error' ? 'Critique' : 'Info'}
                  size="small"
                  color={notification.severity}
                  sx={{ height: 24 }}
                />
              )}
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => onMarkAsRead?.(notification.id)} size="small" color="success">
            <DoneOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => onDismiss?.(notification.id)} size="small" color="default">
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
          {notification.actions}
        </Stack>
      </Stack>
    ))}
  </Stack>
);
