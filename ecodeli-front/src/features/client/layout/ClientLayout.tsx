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
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const menuItems = [
  {
    label: 'Tableau de bord',
    path: '/client/dashboard',
    icon: <DashboardOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Mes annonces',
    path: '/client/annonces',
    icon: <ListAltOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Mes livraisons',
    path: '/client/livraisons',
    icon: <LocalShippingOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Paiements',
    path: '/client/paiements',
    icon: <CreditCardOutlinedIcon fontSize="small" />,
  },
];

export const ClientLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);
  const handleNavigation = (path: string) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const sidebarContent = (
    <List
      sx={{
        p: 1,
        height: '100%',
      }}
    >
      {menuItems.map((item) => (
        <ListItemButton
          key={item.path}
          onClick={() => handleNavigation(item.path)}
          selected={isActive(item.path)}
          sx={{
            borderRadius: 2,
            mb: 0.5,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '1.2rem' }}>
                {item.label}
              </Typography>
            }
          />
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        width: '100%',
        bgcolor: 'background.default',
        flexGrow: 1,
        minHeight: '100%',
        alignItems: 'stretch',
        flexDirection: { xs: 'column', md: 'row' },
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
            Menu client
          </Typography>
          <Divider />
          {sidebarContent}
        </Stack>
      </Drawer>

      <Box
        sx={{
          width: 280,
          flexShrink: 0,
          alignSelf: 'stretch',
          bgcolor: 'background.paper',
          borderRight: (t) => `1px solid ${t.palette.divider}`,
          display: { xs: 'none', md: 'block' },
        }}
      >
        {sidebarContent}
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          minHeight: '100%',
          px: { xs: 2, md: 3, lg: 4 },
          py: { xs: 3, md: 4 },
        }}
      >
        <IconButton
          color="inherit"
          onClick={() => setSidebarOpen(true)}
          aria-label="Ouvrir le menu client"
          sx={{ display: { xs: 'inline-flex', md: 'none' }, mb: 2 }}
        >
          <MenuOutlinedIcon />
        </IconButton>
        <Outlet />
      </Box>
    </Box>
  );
};
