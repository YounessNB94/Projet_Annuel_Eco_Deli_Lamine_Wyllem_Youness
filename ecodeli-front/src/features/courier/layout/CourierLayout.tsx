import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

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

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        flexGrow: 1,
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          width: 280,
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
        }}
      >
        <List sx={{ p: 1 }}>
          {navigationItems.map((item) => (
            <ListItemButton
              key={item.path}
              disabled={item.disabled}
              selected={isActive(item.path)}
              onClick={() => !item.disabled && navigate(item.path)}
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
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
