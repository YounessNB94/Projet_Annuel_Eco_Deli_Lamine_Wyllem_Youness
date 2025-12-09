import { Navigate, Route, Routes } from 'react-router-dom';
import { Typography } from '@mui/material';
import { RootLayout } from './layouts/RootLayout';
import { ClientLayout } from '../features/client/layout/ClientLayout';
import { ClientDashboardPage } from '../features/client/pages/ClientDashboardPage';
import { ClientAnnouncementsPage } from '../features/client/pages/ClientAnnouncementsPage';
import { ClientDeliveriesPage } from '../features/client/pages/ClientDeliveriesPage';
import { ClientPaymentsPage } from '../features/client/pages/ClientPaymentsPage';
import { ClientCreateAnnouncementPage } from '../features/client/pages/ClientCreateAnnouncementPage';
import { ClientDeliveryDetailPage } from '../features/client/pages/ClientDeliveryDetailPage';
import { ClientDeliveryTrackingPage } from '../features/client/pages/ClientDeliveryTrackingPage';
import { ClientAnnouncementDetailPage } from '../features/client/pages/ClientAnnouncementDetailPage';
import { CourierLayout } from '../features/courier/layout/CourierLayout';
import { CourierAvailableAnnouncementsPage } from '../features/courier/pages/CourierAvailableAnnouncementsPage';
import { CourierDeliveriesPage } from '../features/courier/pages/CourierDeliveriesPage';
import { CourierDeliveryDetailPage } from '../features/courier/pages/CourierDeliveryDetailPage';
import { MerchantLayout } from '../features/merchant/layout/MerchantLayout';
import { MerchantContractPage } from '../features/merchant/pages/MerchantContractPage';
import { MerchantCreateHomeDeliveryAnnouncementPage } from '../features/merchant/pages/MerchantCreateHomeDeliveryAnnouncementPage';
import { MerchantAnnouncementsPage } from '../features/merchant/pages/MerchantAnnouncementsPage';


const NotFoundPage = () => (
  <Typography variant="h6" component="h1">
    404 - Page non trouvée
  </Typography>
);

const ComingSoonPage = ({ label }: { label: string }) => (
  <Typography variant="body1" component="p">
    La section {label} arrive bientôt.
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
        <Route path="annonces/:announcementId" element={<ClientAnnouncementDetailPage />} />
        <Route path="livraisons" element={<ClientDeliveriesPage />} />
        <Route path="livraisons/:deliveryId" element={<ClientDeliveryDetailPage />} />
        <Route path="livraisons/:deliveryId/tracking" element={<ClientDeliveryTrackingPage />} />
        <Route path="paiements" element={<ClientPaymentsPage />} />
      </Route>

      <Route path="/courier" element={<Navigate to="/courier/annonces" replace />} />

      <Route path="/courier/*" element={<CourierLayout />}>
        <Route index element={<Navigate to="annonces" replace />} />
        <Route path="annonces" element={<CourierAvailableAnnouncementsPage />} />
        <Route path="livraisons" element={<CourierDeliveriesPage />} />
        <Route path="livraisons/:deliveryId" element={<CourierDeliveryDetailPage />} />
        <Route path="historique" element={<ComingSoonPage label="historique" />} />
      </Route>

      <Route path="/merchant" element={<Navigate to="/merchant/contrat" replace />} />

      <Route path="/merchant/*" element={<MerchantLayout />}>
        <Route index element={<Navigate to="contrat" replace />} />
        <Route path="contrat" element={<MerchantContractPage />} />
        <Route path="annonces" element={<MerchantAnnouncementsPage />} />
        <Route path="annonces/nouvelle" element={<MerchantCreateHomeDeliveryAnnouncementPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </RootLayout>
);
