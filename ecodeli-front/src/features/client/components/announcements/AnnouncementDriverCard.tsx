import { Avatar, Box, Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import type { AnnouncementDriverSummary } from '../../api/clientAnnouncementDetails';

interface AnnouncementDriverCardProps {
  driver: AnnouncementDriverSummary;
  onViewDelivery?: () => void;
}

export const AnnouncementDriverCard = ({ driver, onViewDelivery }: AnnouncementDriverCardProps) => (
  <Card
    elevation={0}
    sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}
  >
    <CardHeader
      title="Livreur assigné"
      sx={{ '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 } }}
    />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
          {driver.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {driver.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ★ {driver.rating} • {driver.deliveries} livraisons
          </Typography>
          {driver.phone && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {driver.phone}
            </Typography>
          )}
          {driver.email && (
            <Typography variant="body2" color="text.secondary">
              {driver.email}
            </Typography>
          )}
        </Box>
      </Box>
      {onViewDelivery && (
        <Button variant="contained" color="info" onClick={onViewDelivery} sx={{ textTransform: 'none' }}>
          Voir la livraison
        </Button>
      )}
    </CardContent>
  </Card>
);
