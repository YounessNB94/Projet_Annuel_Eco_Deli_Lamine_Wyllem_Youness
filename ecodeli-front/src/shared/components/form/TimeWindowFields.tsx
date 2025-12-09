import { Box, TextField, Typography } from '@mui/material';

type StringFieldKeys<TValues extends Record<string, unknown>> = {
  [K in keyof TValues]: TValues[K] extends string ? K : never;
}[keyof TValues];

interface TimeWindowFieldsProps<TValues extends Record<string, unknown>> {
  label: string;
  required?: boolean;
  dateField: StringFieldKeys<TValues>;
  startField: StringFieldKeys<TValues>;
  endField: StringFieldKeys<TValues>;
  values: TValues;
  errors: Partial<Record<keyof TValues, string>>;
  onChange: (field: keyof TValues, value: string) => void;
  helperText?: string;
}

export const TimeWindowFields = <TValues extends Record<string, unknown>>({
  label,
  required,
  dateField,
  startField,
  endField,
  values,
  errors,
  onChange,
  helperText,
}: TimeWindowFieldsProps<TValues>) => {
  const resolveValue = (field: StringFieldKeys<TValues>) =>
    (values[field] as string) || '';

  return (
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
          value={resolveValue(dateField)}
          error={!!errors[dateField]}
          helperText={errors[dateField]}
          onChange={(event) => onChange(dateField, event.target.value)}
        />
        <TextField
          type="time"
          label="Début"
          InputLabelProps={{ shrink: true }}
          value={resolveValue(startField)}
          error={!!errors[startField]}
          helperText={errors[startField]}
          onChange={(event) => onChange(startField, event.target.value)}
        />
        <TextField
          type="time"
          label="Fin"
          InputLabelProps={{ shrink: true }}
          value={resolveValue(endField)}
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
};
