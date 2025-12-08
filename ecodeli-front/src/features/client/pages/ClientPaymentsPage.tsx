import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Grid,
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
import { useNavigate } from 'react-router-dom';
import { PaymentRequiredBanner } from '../components/payments/PaymentRequiredBanner';
import { PaymentSummaryCard } from '../components/payments/PaymentSummaryCard';
import { PaymentSecurityCard } from '../components/payments/PaymentSecurityCard';
import { PaymentResultCard } from '../components/payments/PaymentResultCard';
import { downloadPaymentInvoice } from '../utils/downloadPaymentInvoice';

type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed';

const paymentData = {
  deliveryId: 'DLV-001',
  title: 'Livraison Paris → Lyon',
  amount: 25,
  serviceFee: 0,
  total: 25,
  dueDate: '8 Dec 2025',
};

interface CardFormState {
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardholder: string;
}

const statusMeta: Record<PaymentStatus, { label: string; color: ChipProps['color'] }> = {
  pending: { label: 'À payer', color: 'warning' },
  processing: { label: 'Traitement', color: 'info' },
  success: { label: 'Réussi', color: 'success' },
  failed: { label: 'Échec', color: 'error' },
};

export const ClientPaymentsPage = () => {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [paymentMethod, setPaymentMethod] = useState<'card'>('card');
  const [cardForm, setCardForm] = useState<CardFormState>({
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardholder: 'Jean Dupont',
  });
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);

  const handleCardFieldChange = (field: keyof CardFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCardForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handlePayment = () => {
    if (paymentStatus === 'processing') return;
    setPaymentStatus('processing');
    setTimeout(() => {
      const succeeded = Math.random() >= 0.3;
      if (succeeded) {
        setPaymentStatus('success');
        setTransactionId(`TRX-${Date.now().toString().slice(-8)}`);
        setPaymentDate(new Date());
      } else {
        setPaymentStatus('failed');
        setTransactionId(null);
        setPaymentDate(null);
      }
    }, 1800);
  };

  const handleRetry = () => {
    setPaymentStatus('pending');
  };

  const handleDownloadInvoice = () => {
    const invoiceTransactionId = transactionId ?? `TRX-${Date.now().toString().slice(-8)}`;
    downloadPaymentInvoice({
      deliveryId: paymentData.deliveryId,
      deliveryTitle: paymentData.title,
      amount: paymentData.amount,
      serviceFee: paymentData.serviceFee,
      total: paymentData.total,
      transactionId: invoiceTransactionId,
      paymentDate: paymentDate ?? new Date(),
      cardholder: cardForm.cardholder || 'Client EcoDeli',
    });
  };

  const handleBack = () => navigate('/client/livraisons');
  const handleReturnDashboard = () => navigate('/client/dashboard');

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
          Livraison #{paymentData.deliveryId}
        </Typography>
      </Box>
      <Chip label={statusMeta[paymentStatus].label} color={statusMeta[paymentStatus].color} />
    </Box>
  );

  if (paymentStatus === 'success') {
    return (
      <Box>
        {header}
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <PaymentResultCard
            status="success"
            title="Paiement réussi !"
            description={`Votre paiement de ${paymentData.total.toFixed(2)} € a été traité avec succès.`}
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
                  <Typography variant="body2">{paymentData.title}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Montant total</Typography>
                  <Typography variant="body1" color="success.main" fontWeight={700}>
                    {paymentData.total.toFixed(2)} €
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
    () => (paymentStatus === 'processing' ? 'Traitement en cours...' : `Payer ${paymentData.total.toFixed(2)} €`),
    [paymentStatus]
  );

  return (
    <Box>
      {header}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <PaymentRequiredBanner dueDate={paymentData.dueDate} />

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
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box sx={{ position: { lg: 'sticky' }, top: { lg: 96 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <PaymentSummaryCard
              deliveryTitle={paymentData.title}
              amount={paymentData.amount}
              serviceFee={paymentData.serviceFee}
              total={paymentData.total}
            />
            <PaymentSecurityCard />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
