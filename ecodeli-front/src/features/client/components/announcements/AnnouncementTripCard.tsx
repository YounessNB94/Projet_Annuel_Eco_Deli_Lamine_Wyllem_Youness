import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTimeOutlined';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import { Box, Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';

interface TripPointProps {
  title: string;
  address: string;
  date: string;
  time: string;
  color: 'success' | 'error';
}

const TripPoint = ({ title, address, date, time, color }: TripPointProps) => (
  <Box sx={{ display: 'flex', gap: 2 }}>
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        bgcolor: `${color}.light`,
        color: `${color}.main`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <PlaceIcon />
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {address}
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, mt: 1.5, color: 'text.secondary' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CalendarTodayIcon fontSize="small" />
          <Typography variant="body2">{date}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccessTimeIcon fontSize="small" />
          <Typography variant="body2">{time}</Typography>
        </Box>
      </Box>
    </Box>
  </Box>
);

interface AnnouncementTripCardProps {
  fromAddress: string;
  pickupDate: string;
  pickupTime: string;
  toAddress: string;
  deliveryDate?: string;
  deliveryTime?: string;
}

export const AnnouncementTripCard = ({
  fromAddress,
  pickupDate,
  pickupTime,
  toAddress,
  deliveryDate,
  deliveryTime,
}: AnnouncementTripCardProps) => (
  <Card
    elevation={0}
    sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}
  >
    <CardHeader
      title="Détails du trajet"
      sx={{ '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 } }}
    />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TripPoint
        title="Point de collecte"
        address={fromAddress}
        date={pickupDate}
        time={pickupTime}
        color="success"
      />
      <Divider />
      <TripPoint
        title="Point de livraison"
        address={toAddress}
        date={deliveryDate ?? 'À planifier'}
        time={deliveryTime ?? 'À définir'}
        color="error"
      />
    </CardContent>
  </Card>
);
