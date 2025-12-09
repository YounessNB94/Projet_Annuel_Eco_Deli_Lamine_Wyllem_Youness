import { Box, Button, Stack, Typography } from '@mui/material';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';

interface MerchantAnnouncementsEmptyStateProps {
  onCreate: () => void;
}

export const MerchantAnnouncementsEmptyState = ({ onCreate }: MerchantAnnouncementsEmptyStateProps) => (
  <Box
    sx={{
      borderRadius: 3,
      border: (theme) => `1px dashed ${theme.palette.divider}`,
      p: 6,
      textAlign: 'center',
      bgcolor: 'background.paper',
    }}
  >
    <Stack spacing={2} alignItems="center">
      <CampaignOutlinedIcon color="success" sx={{ fontSize: 48 }} />
      <Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Aucune annonce pour le moment
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Créez votre première campagne pour déclencher la livraison domicile sur votre zone.
        </Typography>
      </Box>
      <Button variant="contained" color="success" onClick={onCreate}>
        Créer une annonce
      </Button>
    </Stack>
  </Box>
);
