import { Box, TextField, Typography } from '@mui/material';
import type {
  AnnouncementFormErrors,
  AnnouncementFormValues,
} from '../types/announcementForm';

interface TimeWindowFieldsProps {
  label: string;
  required?: boolean;
  dateField: keyof AnnouncementFormValues;
  startField: keyof AnnouncementFormValues;
  endField: keyof AnnouncementFormValues;
  values: AnnouncementFormValues;
  errors: AnnouncementFormErrors;
  onChange: (field: keyof AnnouncementFormValues, value: string) => void;
  helperText?: string;
}

export const TimeWindowFields = ({
  label,
  required,
  dateField,
  startField,
  endField,
  values,
  errors,
  onChange,
  helperText,
}: TimeWindowFieldsProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Typography variant="subtitle1" fontWeight={600}>
      {label} {required && '*'}
    </Typography>

    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 2,
      }}
    >
      <TextField
        type="date"
        label="Date"
        InputLabelProps={{ shrink: true }}
        value={values[dateField]}
        error={!!errors[dateField]}
        helperText={errors[dateField]}
        onChange={(event) => onChange(dateField, event.target.value)}
      />
      <TextField
        type="time"
        label="Début"
        InputLabelProps={{ shrink: true }}
        value={values[startField]}
        error={!!errors[startField]}
        helperText={errors[startField]}
        onChange={(event) => onChange(startField, event.target.value)}
      />
      <TextField
        type="time"
        label="Fin"
        InputLabelProps={{ shrink: true }}
        value={values[endField]}
        error={!!errors[endField]}
        helperText={errors[endField]}
        onChange={(event) => onChange(endField, event.target.value)}
      />
    </Box>

    {helperText && (
      <Typography variant="caption" color="text.secondary">
        {helperText}
      </Typography>
    )}
  </Box>
);
