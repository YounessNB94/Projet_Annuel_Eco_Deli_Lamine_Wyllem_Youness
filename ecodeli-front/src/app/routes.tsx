import { Navigate, Route, Routes } from 'react-router-dom';
import { Typography } from '@mui/material';
import { RootLayout } from './layouts/RootLayout';
import { ClientLayout } from '../features/client/layout/ClientLayout';
import { ClientDashboardPage } from '../features/client/pages/ClientDashboardPage';
import { ClientAnnouncementsPage } from '../features/client/pages/ClientAnnouncementsPage';
import { ClientDeliveriesPage } from '../features/client/pages/ClientDeliveriesPage';
import { ClientPaymentsPage } from '../features/client/pages/ClientPaymentsPage';
import { ClientPaymentsListPage } from '../features/client/pages/ClientPaymentsListPage';
import { ClientNotificationsPage } from '../features/client/pages/ClientNotificationsPage';
import { ClientCreateAnnouncementPage } from '../features/client/pages/ClientCreateAnnouncementPage';
import { ClientDeliveryDetailPage } from '../features/client/pages/ClientDeliveryDetailPage';
import { ClientDeliveryTrackingPage } from '../features/client/pages/ClientDeliveryTrackingPage';
import { ClientAnnouncementDetailPage } from '../features/client/pages/ClientAnnouncementDetailPage';
import { CourierLayout } from '../features/courier/layout/CourierLayout';
import { CourierAvailableAnnouncementsPage } from '../features/courier/pages/CourierAvailableAnnouncementsPage';
import { CourierDeliveriesPage } from '../features/courier/pages/CourierDeliveriesPage';
import { CourierDeliveryDetailPage } from '../features/courier/pages/CourierDeliveryDetailPage';
import { CourierApplyPage } from '../features/courier/pages/CourierApplyPage';
import { CourierNotificationsPage } from '../features/courier/pages/CourierNotificationsPage';
import { MerchantLayout } from '../features/merchant/layout/MerchantLayout';
import { MerchantContractPage } from '../features/merchant/pages/MerchantContractPage';
import { MerchantCreateHomeDeliveryAnnouncementPage } from '../features/merchant/pages/MerchantCreateHomeDeliveryAnnouncementPage';
import { MerchantAnnouncementsPage } from '../features/merchant/pages/MerchantAnnouncementsPage';
import { MerchantApplyPage } from '../features/merchant/pages/MerchantApplyPage';
import { MerchantNotificationsPage } from '../features/merchant/pages/MerchantNotificationsPage';
import { ProviderLayout } from '../features/provider/layout/ProviderLayout';
import { ProviderDashboardPage } from '../features/provider/pages/ProviderDashboardPage';
import { ProviderAssignmentsPage } from '../features/provider/pages/ProviderAssignmentsPage';
import { ProviderAssignmentDetailPage } from '../features/provider/pages/ProviderAssignmentDetailPage';
import { ProviderAvailabilityPage } from '../features/provider/pages/ProviderAvailabilityPage';
import { ProviderDocumentsPage } from '../features/provider/pages/ProviderDocumentsPage';
import { ProviderInvoicesPage } from '../features/provider/pages/ProviderInvoicesPage';
import { ProviderNotificationsPage } from '../features/provider/pages/ProviderNotificationsPage';
import { ProviderApplyPage } from '../features/provider/pages/ProviderApplyPage';
import { AdminLayout } from '../features/admin/layout/AdminLayout';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { AdminCouriersPage } from '../features/admin/pages/AdminCouriersPage';
import { AdminCourierDetailPage } from '../features/admin/pages/AdminCourierDetailPage';
import { AdminAnnouncementsDeliveriesPage } from '../features/admin/pages/AdminAnnouncementsDeliveriesPage';
import { AdminInvoicesPage } from '../features/admin/pages/AdminInvoicesPage';
import { AdminNotificationsPage } from '../features/admin/pages/AdminNotificationsPage';


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
      <Route path="/" element={<Navigate to="/client/dashboard" replace />} />
      <Route path="/client" element={<Navigate to="/client/dashboard" replace />} />

      <Route path="/client/*" element={<ClientLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ClientDashboardPage />} />
        <Route path="annonces" element={<ClientAnnouncementsPage />} />
        <Route path="annonces/nouvelle" element={<ClientCreateAnnouncementPage />} />
        <Route path="annonces/:announcementId" element={<ClientAnnouncementDetailPage />} />
        <Route path="livraisons" element={<ClientDeliveriesPage />} />
        <Route path="livraisons/:deliveryId" element={<ClientDeliveryDetailPage />} />
        <Route path="livraisons/:deliveryId/tracking" element={<ClientDeliveryTrackingPage />} />
        <Route path="notifications" element={<ClientNotificationsPage />} />
        <Route path="paiements" element={<ClientPaymentsListPage />} />
        <Route path="paiements/:paymentId" element={<ClientPaymentsPage />} />
      </Route>

      <Route path="/courier" element={<Navigate to="/courier/annonces" replace />} />
      <Route path="/courier/devenir-livreur" element={<CourierApplyPage />} />

      <Route path="/courier/*" element={<CourierLayout />}>
        <Route index element={<Navigate to="annonces" replace />} />
        <Route path="annonces" element={<CourierAvailableAnnouncementsPage />} />
        <Route path="livraisons" element={<CourierDeliveriesPage />} />
        <Route path="livraisons/:deliveryId" element={<CourierDeliveryDetailPage />} />
        <Route path="notifications" element={<CourierNotificationsPage />} />
        <Route path="historique" element={<ComingSoonPage label="historique" />} />
      </Route>

      <Route path="/merchant" element={<Navigate to="/merchant/contrat" replace />} />
      <Route path="/merchant/devenir-commercant" element={<MerchantApplyPage />} />

      <Route path="/merchant/*" element={<MerchantLayout />}>
        <Route index element={<Navigate to="contrat" replace />} />
        <Route path="contrat" element={<MerchantContractPage />} />
        <Route path="annonces" element={<MerchantAnnouncementsPage />} />
        <Route path="annonces/nouvelle" element={<MerchantCreateHomeDeliveryAnnouncementPage />} />
        <Route path="notifications" element={<MerchantNotificationsPage />} />
      </Route>

      <Route path="/provider" element={<Navigate to="/provider/dashboard" replace />} />
      <Route path="/provider/devenir-prestataire" element={<ProviderApplyPage />} />

      <Route path="/provider/*" element={<ProviderLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ProviderDashboardPage />} />
        <Route path="assignments" element={<ProviderAssignmentsPage />} />
        <Route path="assignments/:assignmentId" element={<ProviderAssignmentDetailPage />} />
        <Route path="availability" element={<ProviderAvailabilityPage />} />
        <Route path="documents" element={<ProviderDocumentsPage />} />
        <Route path="invoices" element={<ProviderInvoicesPage />} />
        <Route path="notifications" element={<ProviderNotificationsPage />} />
      </Route>

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      <Route path="/admin/*" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="livreurs" element={<AdminCouriersPage />} />
        <Route path="livreurs/:courierId" element={<AdminCourierDetailPage />} />
        <Route path="annonces" element={<AdminAnnouncementsDeliveriesPage />} />
        <Route path="factures" element={<AdminInvoicesPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </RootLayout>
);
