import { Chip, InputAdornment, Stack, TextField, type TextFieldProps } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { ReactNode } from 'react';

export interface AdminFilterOption<T extends string> {
  label: string;
  value: T;
}

interface AdminFilterToolbarProps<T extends string> {
  filters: AdminFilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: ReactNode;
  extraFilters?: ReactNode;
  searchInputProps?: Partial<TextFieldProps>;
}

export const AdminFilterToolbar = <T extends string>({
  filters,
  value,
  onChange,
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Rechercher',
  actions,
  extraFilters,
  searchInputProps,
}: AdminFilterToolbarProps<T>) => (
  <Stack spacing={2} direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', lg: 'center' }}>
    <Stack spacing={1} flex={1}>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {filters.map((filter) => (
          <Chip
            key={filter.value}
            label={filter.label}
            onClick={() => onChange(filter.value)}
            variant={value === filter.value ? 'filled' : 'outlined'}
            color={value === filter.value ? 'primary' : 'default'}
            sx={{ borderRadius: 999 }}
          />
        ))}
      </Stack>
      {extraFilters ?? null}
    </Stack>

    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
      {onSearchChange ? (
        <TextField
          size="small"
          value={searchTerm ?? ''}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 280, md: 320 } }}
          {...searchInputProps}
        />
      ) : null}
      {actions}
    </Stack>
  </Stack>
);
