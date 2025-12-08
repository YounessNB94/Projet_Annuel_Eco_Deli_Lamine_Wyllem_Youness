import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';

interface AnnouncementBudgetCardProps {
  amount: number;
  note?: string;
}

export const AnnouncementBudgetCard = ({ amount, note = 'Prix convenu' }: AnnouncementBudgetCardProps) => (
  <Card
    elevation={0}
    sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}
  >
    <CardHeader
      title="Budget"
      sx={{ '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 } }}
    />
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            bgcolor: 'success.light',
            color: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AttachMoneyIcon />
        </Box>
        <Box>
          <Typography variant="h4" color="success.main">
            {amount.toFixed(2)} €
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {note}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);
