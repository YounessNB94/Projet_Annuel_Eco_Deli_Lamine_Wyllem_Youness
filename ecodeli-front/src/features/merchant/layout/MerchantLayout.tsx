import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

const navigationItems = [
  {
    label: 'Contrat',
    path: '/merchant/contrat',
    icon: <DescriptionOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Creer une annonce',
    path: '/merchant/annonces/nouvelle',
    icon: <AddCircleOutlineIcon fontSize="small" />,
  },
  {
    label: 'Mes annonces',
    path: '/merchant/annonces',
    icon: <ListAltOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Notifications',
    path: '/merchant/notifications',
    icon: <NotificationsNoneOutlinedIcon fontSize="small" />,
  },
];

export const MerchantLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Box sx={{ display: 'flex', flexGrow: 1, width: '100%' }}>
      <Box
        sx={{
          width: 280,
          bgcolor: 'background.paper',
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <List sx={{ p: 1 }}>
          {navigationItems.map((item) => (
              <ListItemButton
                key={item.path}
                selected={isActive(item.path)}
                disabled={item.disabled}
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
