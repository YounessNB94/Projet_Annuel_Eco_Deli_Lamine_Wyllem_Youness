import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import type { DeliveryDriver } from '../../api/clientDeliveryDetails';

interface Props {
  driver: DeliveryDriver;
}

export const DeliveryDriverCard = ({ driver }: Props) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (t) => `1px solid ${t.palette.divider}`,
    }}
  >
    <CardHeader
      title="Livreur"
      sx={{
        '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 },
      }}
    />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
          {driver.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {driver.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ★ {driver.rating} • {driver.totalDeliveries} livraisons
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIphoneOutlinedIcon fontSize="small" />
          <Typography variant="body2">{driver.phone}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailOutlinedIcon fontSize="small" />
          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
            {driver.email}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalShippingOutlinedIcon fontSize="small" />
          <Typography variant="body2">{driver.vehicle}</Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);
