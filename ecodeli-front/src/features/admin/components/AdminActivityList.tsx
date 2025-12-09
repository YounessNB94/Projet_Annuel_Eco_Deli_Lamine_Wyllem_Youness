import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export interface AdminActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon?: ReactNode;
}

interface AdminActivityListProps {
  items: AdminActivityItem[];
}

export const AdminActivityList = ({ items }: AdminActivityListProps) => (
  <List disablePadding sx={{ '& .MuiListItem-root:not(:last-of-type)': { borderBottom: (theme) => `1px solid ${theme.palette.divider}` } }}>
    {items.map((item) => (
      <ListItem key={item.id} alignItems="flex-start" sx={{ py: 1.5 }}>
        {item.icon && <ListItemAvatar><Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>{item.icon}</Avatar></ListItemAvatar>}
        <ListItemText
          primary={
            <Typography variant="body1" fontWeight={600}>
              {item.title}
            </Typography>
          }
          secondary={
            <>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {item.timestamp}
              </Typography>
            </>
          }
        />
      </ListItem>
    ))}
  </List>
);
