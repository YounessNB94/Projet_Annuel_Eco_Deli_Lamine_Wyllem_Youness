import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import PhoneEnabledOutlinedIcon from '@mui/icons-material/PhoneEnabledOutlined';
import type { MerchantHomeDeliveryFormValues } from '../types/homeDeliveryAnnouncement';

interface MerchantHomeDeliverySummaryCardProps {
  values: MerchantHomeDeliveryFormValues;
}

const formatWindow = (date?: string, start?: string, end?: string) => {
  if (!date) return 'Fenêtre à confirmer';
  if (start && end) {
    return `${date} • ${start} - ${end}`;
  }
  return date;
};

export const MerchantHomeDeliverySummaryCard = ({
  values,
}: MerchantHomeDeliverySummaryCardProps) => {
  const hasBasics =
    values.campaignName ||
    values.deliveryCity ||
    values.deliveryRadiusKm ||
    values.packagesCount;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        position: 'sticky',
        top: 96,
      }}
    >
      <CardHeader
        title="Résumé opérationnel"
        subheader="Visualisez la portée de votre campagne"
        sx={{
          '& .MuiCardHeader-subheader': { fontSize: 14, color: 'text.secondary' },
          pb: 1.5,
        }}
      />
      <CardContent sx={{ pt: 1.5 }}>
        {!hasBasics ? (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>
            <Inventory2OutlinedIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2">
              Renseignez votre campagne pour visualiser le résumé.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2.5}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Type de service
              </Typography>
              <Chip
                label={values.serviceLevel === 'EXPRESS' ? 'Express domicile' : 'Standard domicile'}
                color={values.serviceLevel === 'EXPRESS' ? 'error' : 'success'}
                size="small"
              />
              <Typography variant="subtitle1" fontWeight={600}>
                {values.campaignName || 'Campagne sans nom'}
              </Typography>
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Collecte & distribution
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <AccessTimeOutlinedIcon fontSize="small" />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Collecte
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatWindow(
                        values.pickupDate,
                        values.pickupTimeStart,
                        values.pickupTimeEnd,
                      )}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <LocalShippingOutlinedIcon fontSize="small" />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Livraison domicile
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatWindow(
                        values.deliveryDate,
                        values.deliveryTimeStart,
                        values.deliveryTimeEnd,
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Zone de desserte
              </Typography>
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <HomeWorkOutlinedIcon fontSize="small" />
                  <Typography variant="body2">
                    {values.deliveryCity || 'Ville à préciser'}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Rayon: {values.deliveryRadiusKm ? `${values.deliveryRadiusKm} km` : 'à définir'}
                </Typography>
              </Stack>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Volume estimé
              </Typography>
              <Stack direction="row" spacing={2}>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {values.packagesCount || '0'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Colis
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {values.averageWeight || '0'} kg
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Poids moyen
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Options opérationnelles
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={values.requiresSignature ? 'Signature requise' : 'Sans signature'}
                  color={values.requiresSignature ? 'primary' : 'default'}
                  size="small"
                />
                <Chip
                  label={values.allowPartialDeliveries ? 'Livraisons partielles' : 'Livraison complète'}
                  color={values.allowPartialDeliveries ? 'secondary' : 'default'}
                  size="small"
                />
                <Chip
                  label={values.temperatureControlled ? 'Froid/TPM' : 'Température ambiante'}
                  color={values.temperatureControlled ? 'info' : 'default'}
                  size="small"
                />
              </Stack>
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Contact opérationnel
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneEnabledOutlinedIcon fontSize="small" />
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {values.contactName || 'Contact à désigner'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {values.contactPhone || 'Téléphone à préciser'}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
