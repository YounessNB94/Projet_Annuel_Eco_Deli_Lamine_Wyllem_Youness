import NavigationIcon from '@mui/icons-material/Navigation';
import PackageIcon from '@mui/icons-material/AllInboxOutlined';
import ShareIcon from '@mui/icons-material/ShareOutlined';
import { Button, Card, CardContent, CardHeader, Stack } from '@mui/material';

interface TrackingQuickActionsCardProps {
  onViewDetails: () => void;
  onSharePosition: () => void;
}

export const TrackingQuickActionsCard = ({
  onViewDetails,
  onSharePosition,
}: TrackingQuickActionsCardProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
    }}
  >
    <CardHeader title="Actions rapides" />
    <CardContent>
      <Stack spacing={1.5}>
        <Button variant="outlined" startIcon={<PackageIcon />} onClick={onViewDetails}>
          Détails de la livraison
        </Button>
        <Button variant="outlined" startIcon={<NavigationIcon />} onClick={onSharePosition}>
          Partager la position
        </Button>
        <Button variant="outlined" startIcon={<ShareIcon />} onClick={onSharePosition}>
          Obtenir un lien
        </Button>
      </Stack>
    </CardContent>
  </Card>
);
