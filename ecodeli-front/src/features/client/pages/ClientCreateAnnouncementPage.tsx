import { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import { useNavigate } from 'react-router-dom';


import type {
  AnnouncementFormErrors,
  AnnouncementFormValues,
  AnnouncementType,
} from '../types/announcementForm';
import { FormSectionCard } from '../components/FormSectionCard';
import { TimeWindowFields } from '../components/TimeWindowFields';
import { AnnouncementPreviewCard } from '../components/AnnouncementPreviewCard';

const INITIAL_VALUES: AnnouncementFormValues = {
  type: '',
  fromAddress: '',
  toAddress: '',
  pickupDate: '',
  pickupTimeStart: '',
  pickupTimeEnd: '',
  deliveryDate: '',
  deliveryTimeStart: '',
  deliveryTimeEnd: '',
  budget: '',
  description: '',
};

export const ClientCreateAnnouncementPage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<AnnouncementFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<AnnouncementFormErrors>({});

  const handleChange = (field: keyof AnnouncementFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validate = (): boolean => {
    const nextErrors: AnnouncementFormErrors = {};

    if (!values.type) nextErrors.type = "Le type d'annonce est requis";
    if (!values.fromAddress)
      nextErrors.fromAddress = "L'adresse de départ est requise";
    if (!values.toAddress)
      nextErrors.toAddress = "L'adresse d'arrivée est requise";
    if (!values.pickupDate)
      nextErrors.pickupDate = 'La date de collecte est requise';
    if (!values.pickupTimeStart)
      nextErrors.pickupTimeStart = "L'heure de début est requise";
    if (!values.pickupTimeEnd)
      nextErrors.pickupTimeEnd = "L'heure de fin est requise";

    if (!values.budget) {
      nextErrors.budget = 'Le budget est requis';
    } else if (Number(values.budget) <= 0) {
      nextErrors.budget = 'Le budget doit être supérieur à 0';
    }

    if (values.description.length > 500) {
      nextErrors.description = 'La description ne peut pas dépasser 500 caractères';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (isDraft: boolean) => {
    if (!isDraft && !validate()) return;

    // TODO: appel API POST /announcements
    console.log('Submitting announcement', { ...values, isDraft });

    navigate('/client/annonces');
  };

  const handleBack = () => navigate('/client/annonces');

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ bgcolor: 'background.paper' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Créer une annonce 
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Remplissez les informations de votre livraison
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormSectionCard
              title="Type de livraison"
              subtitle="Sélectionnez le type de livraison souhaité"
            >
              <TextField
                select
                fullWidth
                label="Type d'annonce *"
                value={values.type}
                error={!!errors.type}
                helperText={errors.type || 'Le type de livraison aide les livreurs à estimer la capacité nécessaire'}
                onChange={(event) =>
                  handleChange(
                    'type',
                    event.target.value as AnnouncementType | ''
                  )
                }
              >
                <MenuItem value="DOCUMENT">Document</MenuItem>
                <MenuItem value="SMALL">Petite livraison (&lt; 5kg)</MenuItem>
                <MenuItem value="MEDIUM">Livraison moyenne (5-20kg)</MenuItem>
                <MenuItem value="LARGE">Grande livraison (&gt; 20kg)</MenuItem>
                <MenuItem value="PALLET">Palette</MenuItem>
              </TextField>
            </FormSectionCard>

            <FormSectionCard
              title="Adresses"
              subtitle="Définissez les points de collecte et de livraison"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Adresse de départ *"
                  placeholder="Ex: 123 Rue de la Paix, 75001 Paris"
                  value={values.fromAddress}
                  error={!!errors.fromAddress}
                  helperText={errors.fromAddress}
                  onChange={(event) =>
                    handleChange('fromAddress', event.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PlaceOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Adresse d'arrivée *"
                  placeholder="Ex: 456 Avenue des Champs, 69001 Lyon"
                  value={values.toAddress}
                  error={!!errors.toAddress}
                  helperText={errors.toAddress}
                  onChange={(event) =>
                    handleChange('toAddress', event.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PlaceOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </FormSectionCard>

            <FormSectionCard
              title="Fenêtres horaires"
              subtitle="Définissez les créneaux de collecte et de livraison"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <TimeWindowFields
                  label="Collecte"
                  required
                  dateField="pickupDate"
                  startField="pickupTimeStart"
                  endField="pickupTimeEnd"
                  values={values}
                  errors={errors}
                  onChange={handleChange}
                />
                <TimeWindowFields
                  label="Livraison (optionnel)"
                  dateField="deliveryDate"
                  startField="deliveryTimeStart"
                  endField="deliveryTimeEnd"
                  values={values}
                  errors={errors}
                  onChange={handleChange}
                  helperText="Si non spécifié, la livraison sera effectuée dans les meilleurs délais."
                />
              </Box>
            </FormSectionCard>

            <FormSectionCard
              title="Budget et description"
              subtitle="Définissez votre budget et ajoutez des détails"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Budget (€) *"
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  value={values.budget}
                  error={!!errors.budget}
                  helperText={
                    errors.budget ||
                    'Proposez un budget compétitif pour attirer plus de livreurs'
                  }
                  onChange={(event) =>
                    handleChange('budget', event.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Description (optionnel)"
                  value={values.description}
                  error={!!errors.description}
                  helperText={
                    errors.description ||
                    `${values.description.length}/500 caractères`
                  }
                  onChange={(event) =>
                    handleChange('description', event.target.value.slice(0, 500))
                  }
                />
              </Box>
            </FormSectionCard>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mt: 1,
              }}
            >
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleSubmit(true)}
              >
                Enregistrer comme brouillon
              </Button>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={() => handleSubmit(false)}
              >
                Publier l&apos;annonce
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <AnnouncementPreviewCard values={values} />
        </Grid>
      </Grid>
    </Box>
  );
};
