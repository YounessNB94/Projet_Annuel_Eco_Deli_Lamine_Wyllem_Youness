import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import type {
  AnnouncementFormValues,
  AnnouncementType,
} from '../types/announcementForm';
import Title from '@mui/icons-material/Title';

interface Props {
  values: AnnouncementFormValues;
}

const typeLabelMap: Record<AnnouncementType, string> = {
  DOCUMENT: 'Document',
  SMALL: 'Petite livraison',
  MEDIUM: 'Livraison moyenne',
  LARGE: 'Grande livraison',
  PALLET: 'Palette',
};

const formatPickupDate = (values: AnnouncementFormValues) => {
  if (!values.pickupDate) return '';
  const base = new Date(values.pickupDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  if (values.pickupTimeStart && values.pickupTimeEnd) {
    return `${base} • ${values.pickupTimeStart} - ${values.pickupTimeEnd}`;
  }
  return base;
};

export const AnnouncementPreviewCard = ({ values }: Props) => {
  const hasContent =
    values.type ||
    values.fromAddress ||
    values.toAddress ||
    values.pickupDate ||
    values.budget ||
    values.description;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: (t) => `1px solid ${t.palette.divider}`,
        position: 'sticky',
        top: 96,
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisibilityOutlinedIcon fontSize="small" />
            <Title>Aperçu</Title>
          </Box>
        }
        subheader="Voici comment votre annonce apparaîtra"
        sx={{
          '& .MuiCardHeader-subheader': {
            fontSize: 14,
            color: 'text.secondary',
          },
          pb: 1.5,
        }}
      />
      <CardContent sx={{ pt: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {!hasContent && (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>
            <DescriptionOutlinedIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2">
              Remplissez le formulaire pour voir l&apos;aperçu
            </Typography>
          </Box>
        )}

        {values.type && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Type
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={typeLabelMap[values.type as AnnouncementType]}
                color="success"
                size="small"
              />
            </Box>
          </Box>
        )}

        {(values.fromAddress || values.toAddress) && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Trajet
            </Typography>
            <Box sx={{ mt: 0.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {values.fromAddress && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <PlaceOutlinedIcon
                    fontSize="small"
                    sx={{ color: 'success.main', mt: '2px' }}
                  />
                  <Typography variant="body2">{values.fromAddress}</Typography>
                </Box>
              )}
              {values.toAddress && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <PlaceOutlinedIcon
                    fontSize="small"
                    sx={{ color: 'error.main', mt: '2px' }}
                  />
                  <Typography variant="body2">{values.toAddress}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {values.pickupDate && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Collecte
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <CalendarTodayOutlinedIcon fontSize="small" />
              <Typography variant="body2">{formatPickupDate(values)}</Typography>
            </Box>
          </Box>
        )}

        {values.budget && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Budget
            </Typography>
            <Typography variant="h5" color="success.main">
              {Number(values.budget).toFixed(2)} €
            </Typography>
          </Box>
        )}

        {values.description && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {values.description}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
