import { Box, MenuItem, TextField } from "@mui/material";
import { ProviderSectionCard } from "../ProviderSectionCard";
import type {
  ProviderApplyFieldChangeHandler,
  ProviderApplyFormValues,
  ProviderApplyNumericChangeHandler,
} from "../../types/providerApply";

interface ProviderApplyExpertiseSectionProps {
  values: ProviderApplyFormValues;
  handleChange: ProviderApplyFieldChangeHandler;
  handleNumericChange: ProviderApplyNumericChangeHandler;
  serviceCategories: string[];
  transportModes: string[];
}

export const ProviderApplyExpertiseSection = ({
  values,
  handleChange,
  handleNumericChange,
  serviceCategories,
  transportModes,
}: ProviderApplyExpertiseSectionProps) => (
  <ProviderSectionCard
    title="Expertise et matériel"
    subtitle="Aidez-nous à comprendre votre offre et vos capacités"
  >
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        gap: 2,
      }}
    >
      <TextField
        label="Catégorie principale"
        select
        value={values.serviceCategory}
        onChange={handleChange("serviceCategory")}
        required
        fullWidth
      >
        {serviceCategories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Mode de transport"
        select
        value={values.transportMode}
        onChange={handleChange("transportMode")}
        required
        fullWidth
      >
        {transportModes.map((mode) => (
          <MenuItem key={mode} value={mode}>
            {mode}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Années d’expérience"
        value={values.experienceYears}
        onChange={handleNumericChange("experienceYears")}
        required
        fullWidth
        inputMode="numeric"
      />
      <TextField
        label="Capacité hebdomadaire (nb d’interventions)"
        value={values.weeklyCapacity}
        onChange={handleNumericChange("weeklyCapacity")}
        fullWidth
        inputMode="numeric"
      />
      <TextField
        label="Taux horaire moyen (€)"
        value={values.hourlyRate}
        onChange={handleNumericChange("hourlyRate", { allowDecimal: true })}
        fullWidth
        inputMode="decimal"
      />
      <TextField
        label="Equipements et matériels"
        value={values.equipment}
        onChange={handleChange("equipment")}
        multiline
        minRows={2}
        fullWidth
        sx={{ gridColumn: { xs: "span 1", md: "span 2" } }}
      />
      <TextField
        label="Services proposés"
        value={values.services}
        onChange={handleChange("services")}
        multiline
        minRows={3}
        fullWidth
        sx={{ gridColumn: { xs: "span 1", md: "span 2" } }}
      />
    </Box>
  </ProviderSectionCard>
);
