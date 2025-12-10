import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';

import type {
  AnnouncementFormErrors,
  AnnouncementFormValues,
  AnnouncementType,
} from '../types/announcementForm';
import { FormSectionCard, TimeWindowFields } from '../../../shared/components/form';
import { AnnouncementPreviewCard } from './AnnouncementPreviewCard';

export type AnnouncementFormSubmitAction = 'draft' | 'publish' | 'save';

interface ClientAnnouncementFormProps {
  mode: 'create' | 'edit';
  variant?: 'page' | 'dialog';
  initialValues?: AnnouncementFormValues;
  onSubmit: (values: AnnouncementFormValues, action: AnnouncementFormSubmitAction) => void;
  onCancel?: () => void;
}

const DEFAULT_VALUES: AnnouncementFormValues = {
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

const TYPE_OPTIONS: Array<{ value: AnnouncementType; label: string }> = [
  { value: 'DOCUMENT', label: 'Document' },
  { value: 'SMALL', label: 'Petite livraison (< 5kg)' },
  { value: 'MEDIUM', label: 'Livraison moyenne (5-20kg)' },
  { value: 'LARGE', label: 'Grande livraison (> 20kg)' },
  { value: 'PALLET', label: 'Palette' },
];

const useAnnouncementFormState = (initial: AnnouncementFormValues | undefined) => {
  const [values, setValues] = useState<AnnouncementFormValues>(initial ?? DEFAULT_VALUES);
  const [errors, setErrors] = useState<AnnouncementFormErrors>({});

  useEffect(() => {
    if (initial) {
      setValues(initial);
      setErrors({});
    } else {
      setValues(DEFAULT_VALUES);
      setErrors({});
    }
  }, [initial]);

  const handleChange = (field: keyof AnnouncementFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const nextErrors: AnnouncementFormErrors = {};

    if (!values.type) nextErrors.type = "Le type d'annonce est requis";
    if (!values.fromAddress) nextErrors.fromAddress = "L'adresse de depart est requise";
    if (!values.toAddress) nextErrors.toAddress = "L'adresse d'arrivee est requise";
    if (!values.pickupDate) nextErrors.pickupDate = 'La date de collecte est requise';
    if (!values.pickupTimeStart) nextErrors.pickupTimeStart = "L'heure de debut est requise";
    if (!values.pickupTimeEnd) nextErrors.pickupTimeEnd = "L'heure de fin est requise";

    if (!values.budget) {
      nextErrors.budget = 'Le budget est requis';
    } else if (Number(values.budget) <= 0) {
      nextErrors.budget = 'Le budget doit etre superieur a 0';
    }

    if (values.description.length > 500) {
      nextErrors.description = 'La description ne peut pas depasser 500 caracteres';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  return { values, errors, handleChange, validate };
};

export const ClientAnnouncementForm = ({
  mode,
  variant = 'page',
  initialValues,
  onSubmit,
  onCancel,
}: ClientAnnouncementFormProps) => {
  const { values, errors, handleChange, validate } = useAnnouncementFormState(initialValues);
  const showPreview = variant === 'page';

  const descriptionLength = (values.description ?? '').length;
  const descriptionHelper = useMemo(() => {
    if (errors.description) {
      return errors.description;
    }
    return `${descriptionLength}/500 caracteres`;
  }, [errors.description, descriptionLength]);

  const submit = (action: AnnouncementFormSubmitAction) => {
    if (action === 'draft') {
      onSubmit(values, action);
      return;
    }

    if (!validate()) {
      return;
    }

    onSubmit(values, action);
  };

  const actions = mode === 'create'
    ? (
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
          onClick={() => submit('draft')}
        >
          Enregistrer comme brouillon
        </Button>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={() => submit('publish')}
        >
          Publier l'annonce
        </Button>
      </Box>
    ) : (
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
          onClick={() => onCancel?.()}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={() => submit('save')}
        >
          Enregistrer les modifications
        </Button>
      </Box>
    );

  const formContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <FormSectionCard
        title="Type de livraison"
        subtitle="Selectionnez le type de livraison souhaite"
      >
        <TextField
          select
          fullWidth
          label="Type d'annonce *"
          value={values.type}
          error={!!errors.type}
          helperText={errors.type || 'Le type de livraison aide les livreurs a estimer la capacite necessaire'}
          onChange={(event) => handleChange('type', event.target.value as AnnouncementType | '')}
        >
          {TYPE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </FormSectionCard>

      <FormSectionCard
        title="Adresses"
        subtitle="Definissez les points de collecte et de livraison"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Adresse de depart *"
            placeholder="Ex: 123 Rue de la Paix, 75001 Paris"
            value={values.fromAddress}
            error={!!errors.fromAddress}
            helperText={errors.fromAddress}
            onChange={(event) => handleChange('fromAddress', event.target.value)}
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
            label="Adresse d'arrivee *"
            placeholder="Ex: 456 Avenue des Champs, 69001 Lyon"
            value={values.toAddress}
            error={!!errors.toAddress}
            helperText={errors.toAddress}
            onChange={(event) => handleChange('toAddress', event.target.value)}
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
        title="Fenetres horaires"
        subtitle="Definissez les creneaux de collecte et de livraison"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <TimeWindowFields<AnnouncementFormValues>
            label="Collecte"
            required
            dateField="pickupDate"
            startField="pickupTimeStart"
            endField="pickupTimeEnd"
            values={values}
            errors={errors}
            onChange={handleChange}
          />
          <TimeWindowFields<AnnouncementFormValues>
            label="Livraison (optionnel)"
            dateField="deliveryDate"
            startField="deliveryTimeStart"
            endField="deliveryTimeEnd"
            values={values}
            errors={errors}
            onChange={handleChange}
            helperText="Si non specifiee, la livraison sera effectuee dans les meilleurs delais."
          />
        </Box>
      </FormSectionCard>

      <FormSectionCard
        title="Budget et description"
        subtitle="Definissez votre budget et ajoutez des details"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Budget (EUR) *"
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            value={values.budget}
            error={!!errors.budget}
            helperText={
              errors.budget || 'Proposez un budget competitif pour attirer plus de livreurs'
            }
            onChange={(event) => handleChange('budget', event.target.value)}
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
            helperText={descriptionHelper}
            onChange={(event) => handleChange('description', (event.target.value ?? '').slice(0, 500))}
          />
        </Box>
      </FormSectionCard>

      {actions}
    </Box>
  );

  if (variant === 'dialog') {
    return formContent;
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: '1fr', lg: showPreview ? '2fr 1fr' : '1fr' },
      }}
    >
      <Box>{formContent}</Box>
      {showPreview && (
        <Box>
          <AnnouncementPreviewCard values={values} />
        </Box>
      )}
    </Box>
  );
};

ClientAnnouncementForm.displayName = 'ClientAnnouncementForm';

export const createEmptyAnnouncementFormValues = () => ({ ...DEFAULT_VALUES });
