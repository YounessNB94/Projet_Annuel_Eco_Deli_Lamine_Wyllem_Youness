import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

const navigationItems = [
  { label: 'Tableau de bord', path: '/admin/dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
  { label: 'Livreurs', path: '/admin/livreurs', icon: <PeopleAltOutlinedIcon fontSize="small" /> },
  { label: 'Annonces & Livraisons', path: '/admin/annonces', icon: <LocalShippingOutlinedIcon fontSize="small" /> },
  { label: 'Factures', path: '/admin/factures', icon: <ReceiptLongOutlinedIcon fontSize="small" /> },
  { label: 'Notifications', path: '/admin/notifications', icon: <NotificationsNoneOutlinedIcon fontSize="small" /> },
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Box sx={{ display: 'flex',
            gap: 3,
            width: '100%',
            bgcolor: 'background.default',
            flexGrow: 1,
            minHeight: '100%',
            alignItems: 'stretch',}}>
      <Box
        sx={{
          width: 280,
                    flexShrink: 0,
                    alignSelf: 'stretch',
                    bgcolor: 'background.paper',
                    borderRight: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <List sx={{ p: 1,height: '100%' }}>
          {navigationItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={isActive(item.path)}
              onClick={() => navigate(item.path)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={500} sx={{fontSize: '1.2rem'}}>
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          minHeight: '100%',
          px: { xs: 2, md: 3, lg: 4 },
          py: { xs: 3, md: 4 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
