import { useMemo, useState } from "react";
import type { SyntheticEvent } from "react";
import { Alert, Box, Button, Stack } from "@mui/material";
import {
  PROVIDER_APPLY_INITIAL_VALUES,
  PROVIDER_CITY_OPTIONS,
  PROVIDER_DOCUMENT_FIELDS,
  PROVIDER_LEGAL_STATUSES,
  PROVIDER_SERVICE_CATEGORIES,
  PROVIDER_TRANSPORT_MODES,
} from "../constants/providerApply";
import type {
  ProviderApplyDocumentChangeHandler,
  ProviderApplyFieldChangeHandler,
  ProviderApplyFormValues,
  ProviderApplyNumericChangeHandler,
} from "../types/providerApply";
import { ProviderApplyHeader } from "../components/apply/ProviderApplyHeader";
import { ProviderApplyPersonalSection } from "../components/apply/ProviderApplyPersonalSection";
import { ProviderApplyLegalSection } from "../components/apply/ProviderApplyLegalSection";
import { ProviderApplyExpertiseSection } from "../components/apply/ProviderApplyExpertiseSection";
import { ProviderApplyAvailabilitySection } from "../components/apply/ProviderApplyAvailabilitySection";
import { ProviderApplyDocumentsSection } from "../components/apply/ProviderApplyDocumentsSection";
import { ProviderApplyValidationSection } from "../components/apply/ProviderApplyValidationSection";

const REQUIRED_FIELDS: Array<keyof ProviderApplyFormValues> = [
  "fullName",
  "email",
  "phone",
  "address",
  "city",
  "postalCode",
  "companyName",
  "companyCity",
  "siret",
  "legalStatus",
  "serviceCategory",
  "transportMode",
  "experienceYears",
  "serviceArea",
];

export const ProviderApplyPage = () => {
  const [values, setValues] = useState(PROVIDER_APPLY_INITIAL_VALUES);
  const [documents, setDocuments] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<"idle" | "success">("idle");

  const areDocumentsComplete = useMemo(
    () => PROVIDER_DOCUMENT_FIELDS.every((doc) => Boolean(documents[doc.key])),
    [documents]
  );

  const isFormValid = useMemo(
    () =>
      REQUIRED_FIELDS.every((field) => Boolean(values[field])) &&
      values.consent &&
      areDocumentsComplete,
    [values, areDocumentsComplete]
  );

  const handleChange: ProviderApplyFieldChangeHandler = (field) => (event) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const nextValue =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;

    setValues((prev) => ({
      ...prev,
      [field]: nextValue,
    }));
  };

  const handleNumericChange: ProviderApplyNumericChangeHandler =
    (field, options) => (event) => {
      const rawValue = event.target.value;
      const sanitized = options?.allowDecimal
        ? rawValue.replace(/[^0-9.,]/g, "").replace(",", ".")
        : rawValue.replace(/[^0-9]/g, "");

      setValues((prev) => ({
        ...prev,
        [field]: sanitized,
      }));
    };

  const handleDocumentChange: ProviderApplyDocumentChangeHandler =
    (key) => (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      setDocuments((prev) => ({
        ...prev,
        [key]: file.name,
      }));
    };

  const handleCitySelectChange =
    (field: "city" | "companyCity") =>
    (_: SyntheticEvent<Element, Event>, newValue: string | null) => {
      setValues((prev) => ({
        ...prev,
        [field]: newValue ?? "",
      }));
    };

  const handleCityInputChange =
    (field: "city" | "companyCity") =>
    (_: SyntheticEvent<Element, Event>, newValue: string) => {
      setValues((prev) => ({
        ...prev,
        [field]: newValue,
      }));
    };

  const handleSubmit = () => {
    if (!isFormValid) {
      return;
    }

    setSubmitted("success");
    setValues(PROVIDER_APPLY_INITIAL_VALUES);
    setDocuments({});
    window.scrollTo({ top: 0, behavior: "smooth" });
    // TODO: intégrer la soumission vers l’API provider onboarding
  };

  return (
    <Box sx={{ width: "100%", px: { xs: 2, md: 4 }, py: { xs: 4, md: 6 } }}>
      <Stack
        spacing={4}
        maxWidth="1200px"
        sx={{ width: "100%", mx: "auto", minHeight: "calc(100vh - 140px)" }}
      >
        <Stack spacing={4} sx={{ flexGrow: 1 }}>
          <ProviderApplyHeader />

          {submitted === "success" && (
            <Alert severity="success" variant="outlined">
              Merci ! Votre dossier a bien été envoyé. Notre équipe reviendra vers vous sous 72 heures ouvrées.
            </Alert>
          )}

          <Stack spacing={3}>
            <ProviderApplyPersonalSection
              values={values}
              handleChange={handleChange}
              handleNumericChange={handleNumericChange}
              cityOptions={PROVIDER_CITY_OPTIONS}
              onCityChange={handleCitySelectChange("city")}
              onCityInputChange={handleCityInputChange("city")}
            />

            <ProviderApplyLegalSection
              values={values}
              handleChange={handleChange}
              handleNumericChange={handleNumericChange}
              legalStatuses={PROVIDER_LEGAL_STATUSES}
              cityOptions={PROVIDER_CITY_OPTIONS}
              onCompanyCityChange={handleCitySelectChange("companyCity")}
              onCompanyCityInputChange={handleCityInputChange("companyCity")}
            />

            <ProviderApplyExpertiseSection
              values={values}
              handleChange={handleChange}
              handleNumericChange={handleNumericChange}
              serviceCategories={PROVIDER_SERVICE_CATEGORIES}
              transportModes={PROVIDER_TRANSPORT_MODES}
            />

            <ProviderApplyAvailabilitySection values={values} handleChange={handleChange} />

            <ProviderApplyDocumentsSection
              documentFields={PROVIDER_DOCUMENT_FIELDS}
              documents={documents}
              onDocumentChange={handleDocumentChange}
              areDocumentsComplete={areDocumentsComplete}
            />

            <ProviderApplyValidationSection values={values} handleChange={handleChange} />
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: { xs: 2, md: 4 } }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!isFormValid}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Envoyer ma candidature
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
