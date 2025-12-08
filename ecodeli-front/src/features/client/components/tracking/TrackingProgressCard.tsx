import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, Card, CardContent, LinearProgress, Typography } from '@mui/material';

interface TrackingProgressCardProps {
  progress: number;
  fromLabel: string;
  toLabel: string;
}

export const TrackingProgressCard = ({ progress, fromLabel, toLabel }: TrackingProgressCardProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
    }}
  >
    <CardContent sx={{ pt: 3, pb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AccessTimeIcon color="action" />
          <Typography variant="subtitle1" fontWeight={600}>
            Progression
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="success.main" fontWeight={600}>
          {progress}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 12,
          borderRadius: 6,
          bgcolor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            borderRadius: 6,
            background: 'linear-gradient(90deg, #2E7D32 0%, #66BB6A 100%)',
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 2,
          color: 'text.secondary',
          fontSize: 14,
        }}
      >
        <Typography variant="body2">{fromLabel}</Typography>
        <Typography variant="body2">{toLabel}</Typography>
      </Box>
    </CardContent>
  </Card>
);
