import { Navigate, Route, Routes } from 'react-router-dom';
import { Typography } from '@mui/material';
import { RootLayout } from './layouts/RootLayout';
import { ClientLayout } from '../features/client/layout/ClientLayout';
import { ClientDashboardPage } from '../features/client/pages/ClientDashboardPage';
import { ClientAnnouncementsPage } from '../features/client/pages/ClientAnnouncementsPage';
import { ClientDeliveriesPage } from '../features/client/pages/ClientDeliveriesPage';
import { ClientPaymentsPage } from '../features/client/pages/ClientPaymentsPage';
import { ClientCreateAnnouncementPage } from '../features/client/pages/ClientCreateAnnouncementPage';


const NotFoundPage = () => (
  <Typography variant="h6" component="h1">
    404 - Page non trouvée
  </Typography>
);

export const AppRoutes = () => (
  <RootLayout>
    <Routes>
      <Route path="/" element={<Navigate to="/client/annonces" replace />} />
      <Route path="/client" element={<Navigate to="/client/annonces" replace />} />

      <Route path="/client/*" element={<ClientLayout />}>
        <Route index element={<Navigate to="annonces" replace />} />
        <Route path="dashboard" element={<ClientDashboardPage />} />
        <Route path="annonces" element={<ClientAnnouncementsPage />} />
        <Route path="annonces/nouvelle" element={<ClientCreateAnnouncementPage />} />
        <Route path="livraisons" element={<ClientDeliveriesPage />} />
        <Route path="paiements" element={<ClientPaymentsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </RootLayout>
);
