import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import type { ReactElement } from 'react';

export interface ProviderSidebarItem {
  label: string;
  path: string;
  icon: ReactElement;
}

interface ProviderSidebarProps {
  items: ProviderSidebarItem[];
}

export const ProviderSidebar = ({ items }: ProviderSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        alignSelf: 'stretch',
        bgcolor: 'background.paper',
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <List sx={{ p: 1 }}>
        {items.map((item) => (
          <ListItemButton
            key={item.path}
            selected={isActive(item.path)}
            onClick={() => navigate(item.path)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '1.1rem' }}>
                  {item.label}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};
