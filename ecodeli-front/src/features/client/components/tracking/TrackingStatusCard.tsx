import RefreshIcon from '@mui/icons-material/Refresh';
import RoomIcon from '@mui/icons-material/Room';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, Button, Card, CardContent, CardHeader, Chip, Typography } from '@mui/material';
import type { DeliveryStatus } from '../../api/clientDeliveries';

interface TrackingStatusCardProps {
  status: DeliveryStatus;
  statusLabel: string;
  currentLocation: string;
  estimatedArrival: string;
  lastUpdate: string;
  onRefresh: () => void;
  refreshing: boolean;
}

const statusColorMap: Record<DeliveryStatus, 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'> = {
  ACCEPTED: 'default',
  PICKED_UP: 'warning',
  IN_TRANSIT: 'info',
  DELIVERED: 'success',
};

export const TrackingStatusCard = ({
  status,
  statusLabel,
  currentLocation,
  estimatedArrival,
  lastUpdate,
  onRefresh,
  refreshing,
}: TrackingStatusCardProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
    }}
  >
    <CardHeader
      title="Statut actuel"
      action={
        <Button
          size="small"
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          disabled={refreshing}
          sx={{
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
            '& .MuiSvgIcon-root': refreshing
              ? { animation: 'spin 1s linear infinite' }
              : undefined,
          }}
        >
          Actualiser
        </Button>
      }
    />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Chip
        label={statusLabel}
        color={statusColorMap[status]}
        sx={{ alignSelf: 'flex-start', fontWeight: 600, px: 2, py: 1, borderRadius: 2 }}
      />

      <Box>
        <Typography variant="caption" color="text.secondary">
          Position actuelle
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mt: 0.5 }}>
          <RoomIcon color="info" fontSize="small" />
          <Typography variant="body2">{currentLocation}</Typography>
        </Box>
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary">
          Arrivée estimée
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mt: 0.5 }}>
          <AccessTimeIcon color="success" fontSize="small" />
          <Typography variant="body2" color="success.main">
            {estimatedArrival}
          </Typography>
        </Box>
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary">
          Dernière mise à jour
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {lastUpdate}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
