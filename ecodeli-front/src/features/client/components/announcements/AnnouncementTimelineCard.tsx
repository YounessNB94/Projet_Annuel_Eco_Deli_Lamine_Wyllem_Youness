import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import type { AnnouncementTimelineItem } from '../../api/clientAnnouncementDetails';

interface AnnouncementTimelineCardProps {
  title?: string;
  subtitle?: string;
  items: AnnouncementTimelineItem[];
}

export const AnnouncementTimelineCard = ({
  title = "Suivi de l'annonce",
  subtitle = 'Historique et progression de votre annonce',
  items,
}: AnnouncementTimelineCardProps) => (
  <Card
    elevation={0}
    sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}
  >
    <CardHeader
      title={title}
      subheader={subtitle}
      sx={{ '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 } }}
    />
    <CardContent>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const completed = item.completed;
          return (
            <Box key={item.status} sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: completed ? 'success.main' : 'grey.200',
                    color: completed ? 'common.white' : 'grey.500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {completed ? (
                    <CheckCircleOutlineIcon fontSize="small" />
                  ) : (
                    <RadioButtonUncheckedIcon fontSize="small" />
                  )}
                </Box>
                {!isLast && (
                  <Box
                    sx={{
                      width: 2,
                      flexGrow: 1,
                      bgcolor: completed ? 'success.main' : 'grey.300',
                      mt: 0.5,
                    }}
                  />
                )}
              </Box>
              <Box sx={{ pb: isLast ? 0 : 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={completed ? 600 : 500}
                  color={completed ? 'text.primary' : 'text.secondary'}
                >
                  {item.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.dateLabel}
                </Typography>
                {item.driver && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Livreur: {item.driver}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </CardContent>
  </Card>
);
