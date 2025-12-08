import { Box, Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';

interface PaymentSummaryCardProps {
  deliveryTitle: string;
  amount: number;
  serviceFee: number;
  total: number;
}

export const PaymentSummaryCard = ({ deliveryTitle, amount, serviceFee, total }: PaymentSummaryCardProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
    }}
  >
    <CardHeader
      title="Récapitulatif"
      sx={{ '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 } }}
    />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography variant="caption" color="text.secondary">
          Livraison
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5 }}>
          {deliveryTitle}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Prix de la livraison
          </Typography>
          <Typography variant="body2">{amount.toFixed(2)} €</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Frais de service
          </Typography>
          <Typography variant="body2">{serviceFee.toFixed(2)} €</Typography>
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" fontWeight={600}>
            Total à payer
          </Typography>
          <Typography variant="h6" color="success.main">
            {total.toFixed(2)} €
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);
