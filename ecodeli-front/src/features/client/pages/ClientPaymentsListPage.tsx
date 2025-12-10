import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { Box, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientPaymentTable } from '../components/payments/ClientPaymentTable';
import { useClientPayments } from '../hooks/useClientPayments';
import type { ClientPaymentStatus } from '../api/clientPayments';

const highlightCards: Array<{
  icon: typeof PaymentOutlinedIcon;
  title: string;
  status: Extract<ClientPaymentStatus, 'due' | 'processing' | 'paid'>;
  color: string;
}> = [
  {
    icon: PaymentOutlinedIcon,
    title: 'Paiements en attente',
    status: 'due',
    color: 'warning.main',
  },
  {
    icon: TrendingUpOutlinedIcon,
    title: 'Paiements en cours',
    status: 'processing',
    color: 'info.main',
  },
  {
    icon: ReceiptLongOutlinedIcon,
    title: 'Paiements effectues',
    status: 'paid',
    color: 'success.main',
  },
];

export const ClientPaymentsListPage = () => {
  const navigate = useNavigate();
  const { data: payments, isLoading } = useClientPayments();

  const statusCounts = useMemo(() => {
    if (!payments) {
      return {} as Record<ClientPaymentStatus, number>;
    }
    return payments.reduce<Record<ClientPaymentStatus, number>>((acc, payment) => {
      acc[payment.status] = (acc[payment.status] ?? 0) + 1;
      return acc;
    }, {} as Record<ClientPaymentStatus, number>);
  }, [payments]);

  const handleSelectPayment = (paymentId: string) => navigate(`/client/paiements/${paymentId}`);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="overline" color="text.secondary">
          Mes paiements
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mt: 1 }}
        >
          <Typography variant="h4" component="h1" fontWeight={700}>
            Historique des paiements
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consultez vos factures et finalisez les paiements en attente.
          </Typography>
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {highlightCards.map(({ icon: Icon, title, status, color }) => (
          <Card key={title} elevation={0} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: color,
                  color: 'common.white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {title}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {statusCounts[status] ?? 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box>
        <Typography variant="h6" fontWeight={700}>
          Paiements
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Retrouvez toutes vos transactions, leurs statuts et vos factures.
        </Typography>

        {isLoading ? (
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              py: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress size={24} />
          </Card>
        ) : (
          <ClientPaymentTable payments={payments ?? []} onSelectPayment={handleSelectPayment} />
        )}
      </Box>
    </Box>
  );
};
