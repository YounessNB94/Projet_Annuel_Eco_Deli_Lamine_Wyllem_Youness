import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Radio,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { ChipProps } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { PaymentRequiredBanner } from '../components/payments/PaymentRequiredBanner';
import { PaymentSummaryCard } from '../components/payments/PaymentSummaryCard';
import { PaymentSecurityCard } from '../components/payments/PaymentSecurityCard';
import { PaymentResultCard } from '../components/payments/PaymentResultCard';
import { downloadPaymentInvoice } from '../utils/downloadPaymentInvoice';
import { useClientPaymentDetail } from '../hooks/useClientPaymentDetail';
import type { ClientPaymentStatus } from '../api/clientPayments';

interface CardFormState {
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardholder: string;
}

type PaymentStatus = ClientPaymentStatus;

const statusMeta: Record<PaymentStatus, { label: string; color: ChipProps['color'] }> = {
  due: { label: 'A payer', color: 'warning' },
  processing: { label: 'Traitement', color: 'info' },
  paid: { label: 'Payee', color: 'success' },
  failed: { label: 'Echec', color: 'error' },
};

export const ClientPaymentsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { paymentId } = useParams<{ paymentId: string }>();
  const { data: paymentDetail, isLoading } = useClientPaymentDetail(paymentId);

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('due');
  const [paymentMethod, setPaymentMethod] = useState<'card'>('card');
  const [cardForm, setCardForm] = useState<CardFormState>({
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardholder: 'Jean Dupont',
  });
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!paymentDetail) {
      return;
    }
    setPaymentStatus(paymentDetail.status);
    if (paymentDetail.status === 'paid') {
      setTransactionId((prev) => prev ?? `TRX-${paymentDetail.id.slice(-6)}`);
      setPaymentDate((prev) => prev ?? new Date(paymentDetail.dueDate));
    }
  }, [paymentDetail]);

  const handleCardFieldChange = (field: keyof CardFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCardForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handlePayment = () => {
    if (!paymentDetail || paymentStatus === 'processing' || paymentStatus === 'paid') {
      return;
    }
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('paid');
      const nextTransactionId = `TRX-${Date.now().toString().slice(-8)}`;
      setTransactionId(nextTransactionId);
      setPaymentDate(new Date());

      queryClient.setQueryData(['client', 'payments', paymentId], (prev: unknown) => {
        if (prev && typeof prev === 'object') {
          return { ...(prev as Record<string, unknown>), status: 'paid' };
        }
        return prev;
      });

      queryClient.setQueryData(['client', 'payments'], (prev: unknown) => {
        if (Array.isArray(prev)) {
          return prev.map((payment) =>
            payment && typeof payment === 'object' && 'id' in payment && payment.id === paymentId
              ? { ...payment, status: 'paid' }
              : payment,
          );
        }
        return prev;
      });
    }, 1800);
  };

  const handleRetry = () => {
    setPaymentStatus('due');
    setTransactionId(null);
    setPaymentDate(null);
  };

  const handleDownloadInvoice = () => {
    if (!paymentDetail) {
      return;
    }
    const invoiceTransactionId = transactionId ?? `TRX-${Date.now().toString().slice(-8)}`;
    downloadPaymentInvoice({
      deliveryId: paymentDetail.id,
      deliveryTitle: paymentDetail.deliveryTitle,
      amount: paymentDetail.amount,
      serviceFee: paymentDetail.serviceFee,
      total: paymentDetail.total,
      transactionId: invoiceTransactionId,
      paymentDate: paymentDate ?? new Date(),
      cardholder: cardForm.cardholder || 'Client EcoDeli',
    });
  };

  const handleBack = () => navigate('/client/paiements');
  const handleReturnDashboard = () => navigate('/client/dashboard');

  if (!paymentId) {
    return <Navigate to="/client/paiements" replace />;
  }

  if (isLoading) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Chargement du paiement...
        </Typography>
      </Box>
    );
  }

  if (!paymentDetail) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" gutterBottom>
          Paiement introuvable
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Le paiement demande n'existe pas ou n'est plus disponible.
        </Typography>
        <Button variant="contained" onClick={handleBack}>
          Retour a mes paiements
        </Button>
      </Box>
    );
  }

  const header = (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 2,
        mb: 3,
      }}
    >
      <IconButton onClick={handleBack} sx={{ bgcolor: 'background.paper' }}>
        <ArrowBackIcon />
      </IconButton>
      <Box sx={{ flex: 1, minWidth: 220 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Paiement
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Livraison {paymentDetail.deliveryTitle}
        </Typography>
      </Box>
      <Chip label={statusMeta[paymentStatus].label} color={statusMeta[paymentStatus].color} />
    </Box>
  );

  if (paymentStatus === 'paid') {
    return (
      <Box>
        {header}
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <PaymentResultCard
            status="success"
            title="Paiement réussi !"
            description={`Votre paiement de ${paymentDetail.total.toFixed(2)} € a été traite avec succes.`}
          >
            <Box
              sx={{
                bgcolor: 'common.white',
                borderRadius: 2,
                p: 3,
                textAlign: 'left',
                mb: 3,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Détails du paiement
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Numéro de transaction
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {transactionId ?? 'TRX-XXXXXX'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Date et heure
                  </Typography>
                  <Typography variant="body2">
                    {(paymentDate ?? new Date()).toLocaleString('fr-FR')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Livraison
                  </Typography>
                  <Typography variant="body2">{paymentDetail.deliveryTitle}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Montant total</Typography>
                  <Typography variant="body1" color="success.main" fontWeight={700}>
                    {paymentDetail.total.toFixed(2)} €
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button variant="outlined" startIcon={<DownloadOutlinedIcon />} onClick={handleDownloadInvoice}>
                Télécharger la facture
              </Button>
              <Button variant="contained" color="success" onClick={handleReturnDashboard}>
                Retour au tableau de bord
              </Button>
            </Stack>
          </PaymentResultCard>
        </Box>
      </Box>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <Box>
        {header}
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <PaymentResultCard
            status="failed"
            title="Paiement échoué"
            description="Nous n'avons pas pu traiter votre paiement. Veuillez vérifier vos informations ou réessayer."
          >
            <Box
              sx={{
                bgcolor: 'common.white',
                borderRadius: 2,
                p: 3,
                textAlign: 'left',
                mb: 3,
              }}
            >
              <Typography variant="subtitle1" color="error.main" sx={{ mb: 1 }}>
                Raison probable
              </Typography>
              <Typography variant="body2" color="text.secondary">
                La transaction a été refusée par l'établissement bancaire. Essayez une autre carte ou contactez votre banque.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button variant="outlined" onClick={handleBack}>
                Annuler
              </Button>
              <Button variant="contained" color="success" onClick={handleRetry}>
                Réessayer
              </Button>
            </Stack>
          </PaymentResultCard>
        </Box>
      </Box>
    );
  }

  const primaryActionLabel = useMemo(
    () =>
      paymentStatus === 'processing'
        ? 'Traitement en cours...'
        : paymentStatus === 'paid'
          ? 'Paiement effectue'
          : `Payer ${paymentDetail.total.toFixed(2)} €`,
    [paymentStatus, paymentDetail.total]
  );

  return (
    <Box>
      {header}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' },
          alignItems: 'start',
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <PaymentRequiredBanner dueDate={new Date(paymentDetail.dueDate).toLocaleDateString('fr-FR')} />

            <Card
              elevation={0}
              sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}
            >
              <CardHeader
                title="Méthode de paiement"
                subheader="Choisissez comment vous souhaitez payer"
                sx={{ '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 } }}
              />
              <CardContent>
                <Box
                  sx={{
                    borderRadius: 2,
                    border: (theme) =>
                      `1px solid ${paymentMethod === 'card' ? theme.palette.success.main : theme.palette.divider}`,
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Radio checked value="card" onChange={() => setPaymentMethod('card')} />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CreditCardOutlinedIcon fontSize="small" color="action" />
                      <Typography variant="body1" fontWeight={600}>
                        Carte bancaire
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Visa, Mastercard, American Express
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}
            >
              <CardHeader
                title="Informations de carte"
                subheader="Paiement sécurisé avec Stripe"
                sx={{ '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 } }}
              />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Numéro de carte *"
                  placeholder="1234 5678 9012 3456"
                  value={cardForm.cardNumber}
                  onChange={handleCardFieldChange('cardNumber')}
                  inputProps={{ maxLength: 19, inputMode: 'numeric' }}
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    label="Date d'expiration *"
                    placeholder="MM/AA"
                    value={cardForm.expiry}
                    onChange={handleCardFieldChange('expiry')}
                    inputProps={{ maxLength: 5, inputMode: 'numeric' }}
                  />
                  <TextField
                    label="CVC *"
                    placeholder="123"
                    value={cardForm.cvc}
                    onChange={handleCardFieldChange('cvc')}
                    inputProps={{ maxLength: 3, inputMode: 'numeric' }}
                  />
                </Box>
                <TextField
                  label="Nom du titulaire *"
                  placeholder="Jean Dupont"
                  value={cardForm.cardholder}
                  onChange={handleCardFieldChange('cardholder')}
                />
                <Box
                  sx={{
                    mt: 1,
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: '#E3F2FD',
                    display: 'flex',
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: '#0277BD',
                      color: 'common.white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ShieldOutlinedIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="#0277BD">
                      Paiement sécurisé
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Vos informations sont chiffrées via Stripe. Nous ne stockons jamais vos données bancaires.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={
                paymentStatus === 'processing' ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <LockOutlinedIcon />
                )
              }
              onClick={handlePayment}
              disabled={paymentStatus === 'processing'}
              sx={{ height: 56, fontSize: 16, fontWeight: 600 }}
            >
              {primaryActionLabel}
            </Button>
          </Box>
        </Box>

        <Box>
          <Box sx={{ position: { lg: 'sticky' }, top: { lg: 96 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <PaymentSummaryCard
              deliveryTitle={paymentDetail.deliveryTitle}
              amount={paymentDetail.amount}
              serviceFee={paymentDetail.serviceFee}
              total={paymentDetail.total}
            />
            <PaymentSecurityCard />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
