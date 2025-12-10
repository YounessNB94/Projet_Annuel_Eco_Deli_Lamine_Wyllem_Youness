import { TextField } from "@mui/material";
import { ProviderSectionCard } from "../ProviderSectionCard";
import type {
  ProviderApplyFieldChangeHandler,
  ProviderApplyFormValues,
} from "../../types/providerApply";

interface ProviderApplyAvailabilitySectionProps {
  values: ProviderApplyFormValues;
  handleChange: ProviderApplyFieldChangeHandler;
}

export const ProviderApplyAvailabilitySection = ({
  values,
  handleChange,
}: ProviderApplyAvailabilitySectionProps) => (
  <ProviderSectionCard
    title="Disponibilités"
    subtitle="Précisez vos créneaux et contraintes"
  >
    <TextField
      label="Créneaux / contraintes"
      value={values.availabilityNotes}
      onChange={handleChange("availabilityNotes")}
      placeholder="Exemple : disponible du lundi au vendredi • préférences matinées"
      multiline
      minRows={4}
      fullWidth
    />
  </ProviderSectionCard>
);
