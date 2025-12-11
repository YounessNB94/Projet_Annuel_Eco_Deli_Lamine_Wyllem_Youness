import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const navigationItems = [
  {
    label: 'Annonces ',
    path: '/courier/annonces',
    icon: <CampaignOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Mes livraisons',
    path: '/courier/livraisons',
    icon: <LocalShippingOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Notifications',
    path: '/courier/notifications',
    icon: <NotificationsNoneOutlinedIcon fontSize="small" />,
  },
];

export const CourierLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);
  const handleNavigation = (path: string) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const sidebarContent = (
    <List sx={{ p: 1 }}>
      {navigationItems.map((item) => (
        <ListItemButton
          key={item.path}
          disabled={item.disabled}
          selected={isActive(item.path)}
          onClick={() => !item.disabled && handleNavigation(item.path)}
          sx={{ borderRadius: 2, mb: 0.5, opacity: item.disabled ? 0.6 : 1 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '1.2rem' }}>
                {item.label}
              </Typography>
            }
            secondary={item.disabled ? 'Bientot disponible' : undefined}
            secondaryTypographyProps={{ variant: 'caption' }}
          />
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        flexGrow: 1,
        bgcolor: 'background.default',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
      }}
    >
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 280, bgcolor: 'background.paper' },
        }}
      >
        <Stack spacing={1.5} sx={{ height: '100%', p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Menu livreur
          </Typography>
          <Divider />
          {sidebarContent}
        </Stack>
      </Drawer>

      <Box
        sx={{
          width: 280,
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          display: { xs: 'none', md: 'block' },
        }}
      >
        {sidebarContent}
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 },
        }}
      >
        <IconButton
          color="inherit"
          onClick={() => setSidebarOpen(true)}
          aria-label="Ouvrir le menu livreur"
          sx={{ display: { xs: 'inline-flex', md: 'none' }, mb: 2 }}
        >
          <MenuOutlinedIcon />
        </IconButton>
        <Outlet />
      </Box>
    </Box>
  );
};
