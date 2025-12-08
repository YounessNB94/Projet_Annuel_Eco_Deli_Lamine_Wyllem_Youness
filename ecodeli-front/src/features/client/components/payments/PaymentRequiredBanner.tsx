import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import { Box, Card, CardContent, Chip, Typography } from '@mui/material';

interface PaymentRequiredBannerProps {
  dueDate: string;
}

export const PaymentRequiredBanner = ({ dueDate }: PaymentRequiredBannerProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.warning.light}`,
      background: 'linear-gradient(135deg, #ffffff, #fff3e0)',
    }}
  >
    <CardContent sx={{ display: 'flex', gap: 2.5 }}>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: 'warning.main',
          color: 'common.white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <CreditCardOutlinedIcon />
      </Box>
      <Box>
        <Typography variant="subtitle1" color="warning.dark" fontWeight={700}>
          Paiement requis
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Votre paiement est nécessaire pour confirmer cette livraison.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            À payer avant le
          </Typography>
          <Chip
            size="small"
            color="warning"
            label={dueDate}
            sx={{ color: 'common.white', fontWeight: 600 }}
          />
        </Box>
      </Box>
    </CardContent>
  </Card>
);
