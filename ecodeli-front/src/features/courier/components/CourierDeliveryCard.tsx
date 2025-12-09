import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import type { CourierDelivery, CourierDeliveryStatus } from '../api/courierDeliveries';

const statusConfig: Record<
  CourierDeliveryStatus,
  { label: string; color: 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' }
> = {
  ACCEPTED: { label: 'Mission acceptee', color: 'default' },
  PICKED_UP: { label: 'Colis collecte', color: 'info' },
  IN_TRANSIT: { label: 'En transit', color: 'warning' },
  DELIVERED: { label: 'Livree', color: 'success' },
};

interface Props {
  delivery: CourierDelivery;
  onViewBrief: (deliveryId: string) => void;
  onSimulateProgress: (deliveryId: string) => void;
  isUpdating?: boolean;
}

export const CourierDeliveryCard = ({ delivery, onViewBrief, onSimulateProgress, isUpdating }: Props) => {
  const status = statusConfig[delivery.status];

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Assignee le {delivery.assignmentDate}
          </Typography>
          <Chip size="small" label={status.label} color={status.color} />
        </Stack>

        <Typography variant="h6" component="h3" sx={{ mb: 0.5 }}>
          {delivery.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Client {delivery.clientName}
        </Typography>

        <Stack spacing={1.5} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Collecte
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {delivery.pickupAddress}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeOutlinedIcon fontSize="small" color="action" />
              <Typography variant="body2">{delivery.pickupWindow}</Typography>
            </Stack>
          </Box>
          <Divider flexItem />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Livraison
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {delivery.dropoffAddress}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeOutlinedIcon fontSize="small" color="action" />
              <Typography variant="body2">{delivery.dropoffWindow}</Typography>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <Chip
            size="small"
            icon={<RouteOutlinedIcon fontSize="small" />}
            label={`${delivery.distanceKm} km`}
          />
          <Chip
            size="small"
            icon={<DirectionsCarFilledOutlinedIcon fontSize="small" />}
            label={delivery.vehicleType}
          />
          <Chip
            size="small"
            color="success"
            icon={<PaidOutlinedIcon fontSize="small" />}
            label={`${delivery.earnings.toFixed(0)} EUR`}
          />
        </Stack>

        {delivery.notes && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Note: {delivery.notes}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button variant="outlined" onClick={() => onViewBrief(delivery.id)}>
          Voir la fiche
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSimulateProgress(delivery.id)}
          disabled={delivery.status === 'DELIVERED' || Boolean(isUpdating)}
        >
          {isUpdating ? 'Mise a jour...' : 'Mettre a jour'}
        </Button>
      </CardActions>
    </Card>
  );
};
