import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import type { DeliveryDetail } from '../../api/clientDeliveryDetails';

interface Props {
  detail: DeliveryDetail;
}

export const DeliveryAddressesCard = ({ detail }: Props) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (t) => `1px solid ${t.palette.divider}`,
    }}
  >
    <CardHeader
      title="Adresses"
      sx={{
        '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 },
      }}
    />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'success.light',
            color: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <PlaceOutlinedIcon />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Point de collecte
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {detail.from.address}
          </Typography>

          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonOutlineIcon fontSize="small" />
              <Typography variant="body2">{detail.from.contactName}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIphoneOutlinedIcon fontSize="small" />
              <Typography variant="body2">{detail.from.phone}</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'success.main',
              }}
            >
              <AccessTimeOutlinedIcon fontSize="small" />
              <Typography variant="body2">
                Collecté le {detail.pickupTimeLabel}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'error.light',
            color: 'error.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <PlaceOutlinedIcon />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Point de livraison
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {detail.to.address}
          </Typography>

          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonOutlineIcon fontSize="small" />
              <Typography variant="body2">{detail.to.contactName}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIphoneOutlinedIcon fontSize="small" />
              <Typography variant="body2">{detail.to.phone}</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'warning.main',
              }}
            >
              <AccessTimeOutlinedIcon fontSize="small" />
              <Typography variant="body2">
                Estimation : {detail.estimatedDeliveryLabel}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
);
