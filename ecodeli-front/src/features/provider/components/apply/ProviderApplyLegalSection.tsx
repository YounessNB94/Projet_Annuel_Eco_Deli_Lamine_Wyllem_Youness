import type { SyntheticEvent } from "react";
import { Autocomplete, Box, MenuItem, TextField } from "@mui/material";
import { ProviderSectionCard } from "../ProviderSectionCard";
import type {
  ProviderApplyFieldChangeHandler,
  ProviderApplyFormValues,
  ProviderApplyNumericChangeHandler,
} from "../../types/providerApply";

interface ProviderApplyLegalSectionProps {
  values: ProviderApplyFormValues;
  handleChange: ProviderApplyFieldChangeHandler;
  handleNumericChange: ProviderApplyNumericChangeHandler;
  legalStatuses: string[];
  cityOptions: string[];
  onCompanyCityChange: (event: SyntheticEvent<Element, Event>, value: string | null) => void;
  onCompanyCityInputChange: (event: SyntheticEvent<Element, Event>, value: string) => void;
}

export const ProviderApplyLegalSection = ({
  values,
  handleChange,
  handleNumericChange,
  legalStatuses,
  cityOptions,
  onCompanyCityChange,
  onCompanyCityInputChange,
}: ProviderApplyLegalSectionProps) => (
  <ProviderSectionCard
    title="Structure juridique"
    subtitle="Indiquez votre entité légale et les informations administratives"
  >
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        gap: 2,
      }}
    >
      <TextField
        label="Nom de l’entreprise"
        value={values.companyName}
        onChange={handleChange("companyName")}
        required
        fullWidth
      />
      <TextField
        label="Statut juridique"
        select
        value={values.legalStatus}
        onChange={handleChange("legalStatus")}
        required
        fullWidth
      >
        {legalStatuses.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="SIRET"
        value={values.siret}
        onChange={handleNumericChange("siret")}
        placeholder="000 000 000 00000"
        required
        fullWidth
        inputMode="numeric"
      />
      <Autocomplete
        freeSolo
        options={cityOptions}
        value={values.companyCity}
        onChange={onCompanyCityChange}
        onInputChange={onCompanyCityInputChange}
        renderInput={(params) => <TextField {...params} label="Ville" required fullWidth />}
      />
      <TextField
        label="Zone de service (villes, départements)"
        value={values.serviceArea}
        onChange={handleChange("serviceArea")}
        required
        fullWidth
      />
    </Box>
  </ProviderSectionCard>
);
