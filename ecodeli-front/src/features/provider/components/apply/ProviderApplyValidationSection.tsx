import { Checkbox, FormControlLabel } from "@mui/material";
import { ProviderSectionCard } from "../ProviderSectionCard";
import type {
  ProviderApplyFieldChangeHandler,
  ProviderApplyFormValues,
} from "../../types/providerApply";

interface ProviderApplyValidationSectionProps {
  values: ProviderApplyFormValues;
  handleChange: ProviderApplyFieldChangeHandler;
}

export const ProviderApplyValidationSection = ({
  values,
  handleChange,
}: ProviderApplyValidationSectionProps) => (
  <ProviderSectionCard
    title="Validation"
    subtitle="Confirmez la véracité de vos informations"
  >
    <FormControlLabel
      required
      control={<Checkbox checked={values.consent} onChange={handleChange("consent")} />}
      label="Je certifie l’exactitude des informations fournies et j’autorise EcoDeli à vérifier mes documents."
    />
  </ProviderSectionCard>
);
