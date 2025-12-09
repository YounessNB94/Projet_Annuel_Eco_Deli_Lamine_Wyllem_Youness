import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DirectionsBikeOutlinedIcon from "@mui/icons-material/DirectionsBikeOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import type { CourierAvailableAnnouncement } from "../api/courierAnnouncements";

interface Props {
  announcement: CourierAvailableAnnouncement;
  onTakeOver: (announcementId: string) => void;
  disabled?: boolean;
}

export const AvailableAnnouncementCard = ({
  announcement,
  onTakeOver,
  disabled,
}: Props) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: 3,
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <DirectionsBikeOutlinedIcon fontSize="small" color="success" />
        <Typography variant="overline" color="text.secondary">
          {announcement.type}
        </Typography>
      </Stack>

      <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
        {announcement.title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {announcement.origin} → {announcement.destination}
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip
          size="small"
          icon={<RouteOutlinedIcon fontSize="small" />}
          label={`${announcement.distanceKm} km`}
        />
        <Chip
          size="small"
          color="success"
          label={`${announcement.budget.toFixed(0)} EUR`}
        />
        <Tooltip title={`${announcement.carbonSavingKg} kg CO2 economises`}>
          <Chip
            size="small"
            icon={<BoltOutlinedIcon fontSize="small" />}
            label="Mission verte"
          />
        </Tooltip>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1.5} sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <AccessTimeOutlinedIcon fontSize="small" color="action" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Fenetre de collecte
            </Typography>
            <Typography variant="body2">{announcement.pickupWindow}</Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <AccessTimeOutlinedIcon fontSize="small" color="action" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Fenetre de livraison
            </Typography>
            <Typography variant="body2">
              {announcement.deliveryWindow}
            </Typography>
          </Box>
        </Box>
      </Stack>

      {announcement.equipment && announcement.equipment.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {announcement.equipment.map((item) => (
            <Chip key={item} size="small" variant="outlined" label={item} />
          ))}
        </Stack>
      )}
    </CardContent>

    <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Client: {announcement.clientName} | note{" "}
          {announcement.clientRating.toFixed(1)}
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onTakeOver(announcement.id)}
        disabled={disabled}
      >
        Prendre en charge
      </Button>
    </CardActions>
  </Card>
);
