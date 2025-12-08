import NavigationIcon from '@mui/icons-material/Navigation';
import { Box, Card, CardContent, Typography } from '@mui/material';

export const TrackingInfoCard = () => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      bgcolor: 'info.light',
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            aspectRatio: '1 / 1',
            flexShrink: 0,
            borderRadius: '50%',
            bgcolor: 'info.main',
            color: 'common.white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <NavigationIcon />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            Tracking GPS
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            La position est actualisée automatiquement toutes les 30 secondes.
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);
