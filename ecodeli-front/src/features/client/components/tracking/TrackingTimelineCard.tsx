import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import { Badge } from '@mui/material';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import type { DeliveryTimelineItem } from '../../api/clientDeliveryDetails';
import type { DeliveryStatus } from '../../api/clientDeliveries';

interface TrackingTimelineCardProps {
  items: DeliveryTimelineItem[];
}

const statusIconMap: Record<DeliveryStatus, JSX.Element> = {
  ACCEPTED: <AssignmentTurnedInOutlinedIcon fontSize="small" />,
  PICKED_UP: <Inventory2OutlinedIcon fontSize="small" />,
  IN_TRANSIT: <NavigationOutlinedIcon fontSize="small" />,
  DELIVERED: <CheckCircleOutlineIcon fontSize="small" />,
};

export const TrackingTimelineCard = ({ items }: TrackingTimelineCardProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
    }}
  >
    <CardHeader
      title="Historique des déplacements"
      subheader="Tous les événements de cette livraison"
      sx={{ '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 } }}
    />
    <CardContent>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const iconColor = item.completed
            ? item.current
              ? 'info.main'
              : 'success.main'
            : 'grey.300';

          return (
            <Box key={item.status} sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    bgcolor: iconColor,
                    color: item.completed ? 'common.white' : 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: item.current ? (theme) => theme.shadows[4] : 'none',
                    animation: item.current ? 'pulse 2s infinite' : 'none',
                  }}
                >
                  {statusIconMap[item.status]}
                </Box>
                {!isLast && (
                  <Box
                    sx={{
                      width: 2,
                      flexGrow: 1,
                      bgcolor: item.completed ? 'success.main' : 'grey.200',
                      mt: 1,
                    }}
                  />
                )}
              </Box>

              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={item.completed ? 600 : 500}
                      color={item.completed ? 'text.primary' : 'text.secondary'}
                    >
                      {item.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {item.dateLabel}
                    </Typography>
                  </Box>
                  {item.current && (
                    <Badge
                      color="info"
                      badgeContent="Position actuelle"
                      sx={{ '& .MuiBadge-badge': { position: 'relative', transform: 'none', px: 1.5, py: 0.5 } }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </CardContent>
  </Card>
);
