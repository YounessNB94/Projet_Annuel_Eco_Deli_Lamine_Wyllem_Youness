import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';

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

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
      <Box sx={{ width: 280, flexShrink: 0 }}>
        <List
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: 1,
          }}
        >
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={400} sx={{fontSize: '1.2rem'}}>
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
