import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import EuroOutlinedIcon from '@mui/icons-material/EuroOutlined';
import type { MerchantAnnouncement } from '../api/merchantAnnouncements';
import { MerchantAnnouncementStatusChip } from './MerchantAnnouncementStatusChip';

interface MerchantAnnouncementCardProps {
  announcement: MerchantAnnouncement;
  onView?: (announcement: MerchantAnnouncement) => void;
}

const formatWindow = (date: string, start: string, end: string) =>
  `${new Date(date).toLocaleDateString('fr-FR')} • ${start} - ${end}`;

export const MerchantAnnouncementCard = ({
  announcement,
  onView,
  onDuplicate,
}: MerchantAnnouncementCardProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              {announcement.reference}
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {announcement.campaignName}
            </Typography>
          </Box>
          <MerchantAnnouncementStatusChip status={announcement.status} />
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <CalendarMonthOutlinedIcon fontSize="small" color="action" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Collecte
            </Typography>
            <Typography variant="body2">
              {formatWindow(
                announcement.pickupWindow.date,
                announcement.pickupWindow.start,
                announcement.pickupWindow.end,
              )}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <LocalShippingOutlinedIcon fontSize="small" color="action" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Livraison
            </Typography>
            <Typography variant="body2">
              {announcement.deliveryCity} — {announcement.deliveryRadiusKm} km
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatWindow(
                announcement.deliveryWindow.date,
                announcement.deliveryWindow.start,
                announcement.deliveryWindow.end,
              )}
            </Typography>
          </Box>
        </Stack>

        <Divider />

        <Stack direction="row" spacing={3}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Inventory2OutlinedIcon fontSize="small" color="action" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Volume
              </Typography>
              <Typography variant="body2">
                {announcement.packagesCount} colis • {announcement.averageWeight} kg
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <EuroOutlinedIcon fontSize="small" color="action" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Budget
              </Typography>
              <Typography variant="body2">{announcement.budget.toLocaleString('fr-FR')} €</Typography>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </CardContent>

    
  </Card>
);
