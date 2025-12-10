import type { SyntheticEvent } from "react";
import { Autocomplete, Box, TextField } from "@mui/material";
import { ProviderSectionCard } from "../ProviderSectionCard";
import type {
  ProviderApplyFieldChangeHandler,
  ProviderApplyFormValues,
  ProviderApplyNumericChangeHandler,
} from "../../types/providerApply";

interface ProviderApplyPersonalSectionProps {
  values: ProviderApplyFormValues;
  handleChange: ProviderApplyFieldChangeHandler;
  handleNumericChange: ProviderApplyNumericChangeHandler;
  cityOptions: string[];
  onCityChange: (event: SyntheticEvent<Element, Event>, value: string | null) => void;
  onCityInputChange: (event: SyntheticEvent<Element, Event>, value: string) => void;
}

export const ProviderApplyPersonalSection = ({
  values,
  handleChange,
  handleNumericChange,
  cityOptions,
  onCityChange,
  onCityInputChange,
}: ProviderApplyPersonalSectionProps) => (
  <ProviderSectionCard
    title="Informations personnelles"
    subtitle="Données utilisées pour créer votre profil EcoDeli"
  >
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        gap: 2,
      }}
    >
      <TextField
        label="Nom et prénom"
        value={values.fullName}
        onChange={handleChange("fullName")}
        required
        fullWidth
      />
      <TextField
        label="Email professionnel"
        type="email"
        value={values.email}
        onChange={handleChange("email")}
        required
        fullWidth
      />
      <TextField
        label="Téléphone"
        value={values.phone}
        onChange={handleNumericChange("phone")}
        required
        fullWidth
        inputMode="numeric"
      />
      <TextField
        label="Date de naissance"
        type="date"
        value={values.birthDate}
        onChange={handleChange("birthDate")}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <TextField
        label="Adresse"
        value={values.address}
        onChange={handleChange("address")}
        required
        fullWidth
      />
      <Autocomplete
        freeSolo
        options={cityOptions}
        value={values.city}
        onChange={onCityChange}
        onInputChange={onCityInputChange}
        renderInput={(params) => <TextField {...params} label="Ville" required fullWidth />}
      />
      <TextField
        label="Code postal"
        value={values.postalCode}
        onChange={handleNumericChange("postalCode")}
        required
        fullWidth
        inputMode="numeric"
      />
    </Box>
  </ProviderSectionCard>
);
