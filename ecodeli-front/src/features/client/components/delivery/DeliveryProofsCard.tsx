import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import type { DeliveryDetail } from '../../api/clientDeliveryDetails';

interface Props {
  detail: DeliveryDetail;
}

const ProofBox = ({
  title,
  icon,
  hasProof,
}: {
  title: string;
  icon: React.ReactNode;
  hasProof: boolean;
}) => (
  <Box
    sx={{
      borderRadius: 2,
      border: (t) => `1px solid ${t.palette.divider}`,
      p: 2,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
      {icon}
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
    </Box>
    <Box
      sx={{
        borderRadius: 2,
        bgcolor: hasProof ? 'grey.100' : 'grey.50',
        minHeight: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: hasProof ? 'text.secondary' : 'text.disabled',
      }}
    >
      {hasProof ? (
        <>
          <ImageOutlinedIcon sx={{ mr: 1 }} />
          <Typography variant="body2">Photo disponible (mock)</Typography>
        </>
      ) : (
        <Typography variant="body2">En attente</Typography>
      )}
    </Box>
  </Box>
);

export const DeliveryProofsCard = ({ detail }: Props) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (t) => `1px solid ${t.palette.divider}`,
    }}
  >
    <CardHeader
      title="Preuves de livraison"
      subheader="Photos et documents de suivi"
      sx={{
        '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 },
      }}
    />
    <CardContent>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        <ProofBox
          title="Preuve de collecte"
          icon={
            <Inventory2OutlinedIcon
              sx={{ color: 'success.main' }}
              fontSize="small"
            />
          }
          hasProof={detail.proofs.pickup}
        />
        <ProofBox
          title="Preuve de livraison"
          icon={
            <CheckCircleOutlineIcon
              sx={{ color: 'success.main' }}
              fontSize="small"
            />
          }
          hasProof={detail.proofs.delivery}
        />
      </Box>
    </CardContent>
  </Card>
);
