import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Box, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import FolderSpecialOutlinedIcon from '@mui/icons-material/FolderSpecialOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { ProviderSidebar } from '../components/ProviderSidebar';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const sidebarItems = [
  {
    label: 'Tableau de bord',
    path: '/provider/dashboard',
    icon: <SpaceDashboardOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Missions',
    path: '/provider/assignments',
    icon: <AssignmentTurnedInOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Disponibilités',
    path: '/provider/availability',
    icon: <EventAvailableOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Documents',
    path: '/provider/documents',
    icon: <FolderSpecialOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Factures',
    path: '/provider/invoices',
    icon: <ReceiptLongOutlinedIcon fontSize="small" />,
  },
  {
    label: 'Notifications',
    path: '/provider/notifications',
    icon: <NotificationsNoneOutlinedIcon fontSize="small" />,
  },
];

export const ProviderLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
        <ProviderSidebar items={sidebarItems} onNavigate={() => setSidebarOpen(false)} />
      </Drawer>

      {isMobile ? null : <ProviderSidebar items={sidebarItems} />}

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
          aria-label="Ouvrir le menu prestataire"
          sx={{ display: { xs: 'inline-flex', md: 'none' }, mb: 2 }}
        >
          <MenuOutlinedIcon />
        </IconButton>
        <Stack spacing={0.5} mb={4}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Espace prestataire
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Suivez vos missions, disponibilités et revenus en temps réel.
          </Typography>
        </Stack>
        <Outlet />
      </Box>
    </Box>
  );
};
