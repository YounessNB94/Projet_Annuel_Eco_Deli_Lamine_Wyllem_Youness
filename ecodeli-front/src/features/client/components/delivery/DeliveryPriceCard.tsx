import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import type { DeliveryPrice } from '../../api/clientDeliveryDetails';

interface Props {
  price: DeliveryPrice;
}

export const DeliveryPriceCard = ({ price }: Props) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (t) => `1px solid ${t.palette.divider}`,
    }}
  >
    <CardHeader
      title="Prix de la livraison"
      sx={{
        '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 },
      }}
    />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: 'success.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'success.main',
          }}
        >
          <AttachMoneyOutlinedIcon />
        </Box>
        <Box>
          <Typography variant="h4" color="success.main">
            {price.total.toFixed(2)} €
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Prix total
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Prix de base
          </Typography>
          <Typography variant="body2">{price.base.toFixed(2)} €</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Frais de service
          </Typography>
          <Typography variant="body2">
            {price.serviceFees.toFixed(2)} €
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" fontWeight={600}>
            Total
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {price.total.toFixed(2)} €
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);
