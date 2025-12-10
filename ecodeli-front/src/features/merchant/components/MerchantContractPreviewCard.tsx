import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';

interface MerchantContractPreviewCardProps {
  companyName: string;
  siret: string;
  address: string;
  contractNumber?: string | null;
  merchantApproved: boolean;
  adminApproved: boolean;
}

const getFallback = (value: string, placeholder: string) =>
  value ? value : placeholder;

export const MerchantContractPreviewCard = ({
  companyName,
  siret,
  address,
  contractNumber,
  merchantApproved,
  adminApproved,
}: MerchantContractPreviewCardProps) => {
  const hasDetails = Boolean(companyName || siret || address);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        minWidth: 0,
      }}
    >
      <CardHeader
        avatar={<VisibilityOutlinedIcon color="primary" />}
        title="Aperçu du contrat"
        subheader="Visualisez les informations clés avant téléchargement"
        sx={{
          '& .MuiCardHeader-title': { fontWeight: 600 },
          '& .MuiCardHeader-subheader': { fontSize: 13 },
        }}
      />
      <CardContent>
        {!hasDetails ? (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.disabled' }}>
            <ArticleOutlinedIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2">
              Complétez le formulaire pour prévisualiser votre contrat EcoDeli.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Numéro de contrat
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {contractNumber ?? 'En attente de génération'}
              </Typography>
            </Box>

            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Coordonnées
              </Typography>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {getFallback(companyName, 'Nom d\'entreprise en attente')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SIRET : {getFallback(siret, 'XXXX XXXX XXXX')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getFallback(address, 'Adresse de l\'entreprise')}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                icon={merchantApproved ? <CheckCircleOutlineIcon /> : <PendingActionsOutlinedIcon />}
                label={merchantApproved ? 'Commerçant signé' : 'Signature commerçant en attente'}
                color={merchantApproved ? 'success' : 'warning'}
              />
              <Chip
                icon={adminApproved ? <CheckCircleOutlineIcon /> : <PendingActionsOutlinedIcon />}
                label={adminApproved ? 'Admin validé' : 'Validation admin en attente'}
                color={adminApproved ? 'success' : 'warning'}
              />
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Extrait
              </Typography>
              <Typography variant="body2" color="text.secondary">
                "Ce contrat confirme votre adhésion à la marketplace EcoDeli et encadre vos obligations de livraison, vos moyens de paiement ainsi que la gestion des litiges."
              </Typography>
            </Stack>

            <Box sx={{ pt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Signature
              </Typography>
              <Typography variant="subtitle2" fontStyle="italic">
                {merchantApproved ? companyName || 'Commerçant' : 'Signature à compléter'}
              </Typography>
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
