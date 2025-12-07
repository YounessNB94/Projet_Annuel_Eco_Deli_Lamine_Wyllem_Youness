import { Navigate, Route, Routes } from 'react-router-dom';
import { Typography } from '@mui/material';
import { RootLayout } from './layouts/RootLayout';

const ClientHomePage = () => (
  <Typography variant="h4" component="h1">
    Espace client EcoDeli
  </Typography>
);

const NotFoundPage = () => (
  <Typography variant="h6" component="h1">
    404 - Page non trouvée
  </Typography>
);

export const AppRoutes = () => (
  <RootLayout>
    <Routes>
      <Route path="/" element={<Navigate to="/client" replace />} />
      <Route path="/client/*" element={<ClientHomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </RootLayout>
);
