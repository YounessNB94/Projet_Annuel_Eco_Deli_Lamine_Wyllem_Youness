import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import {
  FormSectionCard,
  TimeWindowFields,
} from "../../../shared/components/form";
import {
  MERCHANT_HOME_DELIVERY_TYPE,
  type MerchantHomeDeliveryFormErrors,
  type MerchantHomeDeliveryFormValues,
} from "../types/homeDeliveryAnnouncement";
import { MerchantHomeDeliverySummaryCard } from "../components/MerchantHomeDeliverySummaryCard";
import { useMerchantCreateHomeDeliveryAnnouncement } from "../hooks/useMerchantCreateHomeDeliveryAnnouncement";

const INITIAL_VALUES: MerchantHomeDeliveryFormValues = {
  serviceType: MERCHANT_HOME_DELIVERY_TYPE,
  serviceLevel: "STANDARD",
  campaignName: "",
  reference: "",
  pickupAddress: "",
  pickupCity: "",
  pickupPostalCode: "",
  pickupDate: "",
  pickupTimeStart: "",
  pickupTimeEnd: "",
  deliveryDate: "",
  deliveryTimeStart: "",
  deliveryTimeEnd: "",
  deliveryCity: "",
  deliveryRadiusKm: "",
  packagesCount: "",
  averageWeight: "",
  budget: "",
  instructions: "",
  notificationMessage: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  allowPartialDeliveries: false,
  requiresSignature: true,
  temperatureControlled: false,
};

const numericFields = [
  "deliveryRadiusKm",
  "packagesCount",
  "averageWeight",
  "budget",
] as const;

export const MerchantCreateHomeDeliveryAnnouncementPage = () => {
  const navigate = useNavigate();
  const [values, setValues] =
    useState<MerchantHomeDeliveryFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<MerchantHomeDeliveryFormErrors>({});
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { mutateAsync, isPending } =
    useMerchantCreateHomeDeliveryAnnouncement();

  const handleChange = (
    field: keyof MerchantHomeDeliveryFormValues,
    value: string
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleToggle = (
    field:
      | "allowPartialDeliveries"
      | "requiresSignature"
      | "temperatureControlled",
    value: boolean
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors: MerchantHomeDeliveryFormErrors = {};

    const requiredFields: Array<keyof MerchantHomeDeliveryFormValues> = [
      "campaignName",
      "pickupAddress",
      "pickupCity",
      "pickupPostalCode",
      "pickupDate",
      "pickupTimeStart",
      "pickupTimeEnd",
      "deliveryDate",
      "deliveryTimeStart",
      "deliveryTimeEnd",
      "deliveryCity",
      "deliveryRadiusKm",
      "packagesCount",
      "budget",
      "contactName",
      "contactPhone",
      "contactEmail",
    ];

    requiredFields.forEach((field) => {
      if (!values[field]) {
        nextErrors[field] = "Champ requis";
      }
    });

    numericFields.forEach((field) => {
      if (values[field] && Number(values[field]) <= 0) {
        nextErrors[field] = "La valeur doit être supérieure à 0";
      }
    });

    if (values.notificationMessage.length > 160) {
      nextErrors.notificationMessage = "160 caractères maximum";
    }

    if (values.instructions.length > 600) {
      nextErrors.instructions = "600 caractères maximum";
    }

    if (
      values.contactEmail &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(values.contactEmail)
    ) {
      nextErrors.contactEmail = "Email invalide";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
    setFeedback(null);
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const result = await mutateAsync({ status, values });
      setFeedback({
        type: "success",
        message:
          status === "PUBLISHED"
            ? `Annonce publiée sous la référence ${result.reference}.`
            : `Brouillon enregistré sous la référence ${result.reference}.`,
      });
      setValues(INITIAL_VALUES);
      setErrors({});
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Impossible d'enregistrer votre annonce pour le moment.",
      });
    }
  };

  const handleBack = () => navigate("/merchant/annonces");

  return (
    <Box >
      <Box sx={{ display: "flex",flexDirection: "row", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ bgcolor: "background.paper" }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Nouvelle annonce livraison domicile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configurez votre campagne MERCHANT_HOME_DELIVERY et partagez toutes
            les informations aux livreurs.
          </Typography>
        </Box>
      </Box>

      {feedback && (
        <Alert
          severity={feedback.type}
          sx={{ mb: 3 }}
          onClose={() => setFeedback(null)}
        >
          {feedback.message}
        </Alert>
      )}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        <Box sx={{ flex: { xs: '1 1 auto', lg: '0 0 65%' } }}>
          <Stack spacing={3}>
            <FormSectionCard
              title="Paramètres de la campagne"
              subtitle="Décrivez votre annonce et le niveau de service attendu"
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nom de la campagne *"
                    value={values.campaignName}
                    error={!!errors.campaignName}
                    helperText={errors.campaignName}
                    onChange={(event) =>
                      handleChange("campaignName", event.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Référence interne"
                    value={values.reference}
                    onChange={(event) =>
                      handleChange("reference", event.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Niveau de service"
                    value={values.serviceLevel}
                    onChange={(event) =>
                      handleChange("serviceLevel", event.target.value)
                    }
                    helperText="Express garantit un traitement prioritaire"
                  >
                    <MenuItem value="STANDARD">Standard</MenuItem>
                    <MenuItem value="EXPRESS">Express</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Budget global (€) *"
                    value={values.budget}
                    type="number"
                    inputProps={{ min: 0, step: 0.01 }}
                    error={!!errors.budget}
                    helperText={errors.budget}
                    onChange={(event) =>
                      handleChange("budget", event.target.value)
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EuroOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </FormSectionCard>

            <FormSectionCard
              title="Collecte entrepôt"
              subtitle="Localisation et fenêtre horaire de départ"
            >
              <Stack spacing={2.5}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Adresse d'enlèvement *"
                      placeholder="Ex: 25 Rue Victor Hugo, 75008 Paris"
                      value={values.pickupAddress}
                      error={!!errors.pickupAddress}
                      helperText={errors.pickupAddress}
                      onChange={(event) =>
                        handleChange("pickupAddress", event.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Ville *"
                      value={values.pickupCity}
                      error={!!errors.pickupCity}
                      helperText={errors.pickupCity}
                      onChange={(event) =>
                        handleChange("pickupCity", event.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Code postal *"
                      value={values.pickupPostalCode}
                      error={!!errors.pickupPostalCode}
                      helperText={errors.pickupPostalCode}
                      onChange={(event) =>
                        handleChange("pickupPostalCode", event.target.value)
                      }
                    />
                  </Grid>
                </Grid>

                <TimeWindowFields
                  label="Fenêtre de collecte"
                  required
                  dateField="pickupDate"
                  startField="pickupTimeStart"
                  endField="pickupTimeEnd"
                  values={values}
                  errors={errors}
                  onChange={handleChange}
                  helperText="Indiquez la meilleure plage pour retraiter vos colis."
                />
              </Stack>
            </FormSectionCard>

            <FormSectionCard
              title="Livraison domicile"
              subtitle="Zone couverte et créneaux pour vos clients"
            >
              <Stack spacing={2.5}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Ville desservie *"
                      value={values.deliveryCity}
                      error={!!errors.deliveryCity}
                      helperText={errors.deliveryCity}
                      onChange={(event) =>
                        handleChange("deliveryCity", event.target.value)
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalShippingOutlinedIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Rayon max (km) *"
                      value={values.deliveryRadiusKm}
                      type="number"
                      inputProps={{ min: 1, step: 1 }}
                      error={!!errors.deliveryRadiusKm}
                      helperText={errors.deliveryRadiusKm}
                      onChange={(event) =>
                        handleChange("deliveryRadiusKm", event.target.value)
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">km</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <TimeWindowFields
                  label="Fenêtre de livraison"
                  required
                  dateField="deliveryDate"
                  startField="deliveryTimeStart"
                  endField="deliveryTimeEnd"
                  values={values}
                  errors={errors}
                  onChange={handleChange}
                  helperText="Ce créneau sera partagé aux destinataires."
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.allowPartialDeliveries}
                        onChange={(event) =>
                          handleToggle(
                            "allowPartialDeliveries",
                            event.target.checked
                          )
                        }
                      />
                    }
                    label="Autoriser les livraisons partielles"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.requiresSignature}
                        onChange={(event) =>
                          handleToggle(
                            "requiresSignature",
                            event.target.checked
                          )
                        }
                      />
                    }
                    label="Signature client requise"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.temperatureControlled}
                        onChange={(event) =>
                          handleToggle(
                            "temperatureControlled",
                            event.target.checked
                          )
                        }
                      />
                    }
                    label="Produits frais / température contrôlée"
                  />
                </Stack>
              </Stack>
            </FormSectionCard>

            <FormSectionCard
              title="Volume & instructions"
              subtitle="Quantités prévisionnelles et message aux coursiers"
            >
              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Nombre de colis *"
                      value={values.packagesCount}
                      type="number"
                      inputProps={{ min: 1, step: 1 }}
                      error={!!errors.packagesCount}
                      helperText={errors.packagesCount}
                      onChange={(event) =>
                        handleChange("packagesCount", event.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Poids moyen (kg)"
                      value={values.averageWeight}
                      type="number"
                      inputProps={{ min: 0, step: 0.5 }}
                      error={!!errors.averageWeight}
                      helperText={errors.averageWeight}
                      onChange={(event) =>
                        handleChange("averageWeight", event.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Type service"
                      value={values.serviceType}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Instructions aux coursiers"
                  value={values.instructions}
                  error={!!errors.instructions}
                  helperText={
                    errors.instructions ||
                    `${values.instructions.length}/600 caractères`
                  }
                  onChange={(event) =>
                    handleChange(
                      "instructions",
                      event.target.value.slice(0, 600)
                    )
                  }
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Message de notification clients"
                  value={values.notificationMessage}
                  error={!!errors.notificationMessage}
                  helperText={
                    errors.notificationMessage ||
                    `${values.notificationMessage.length}/160 caractères`
                  }
                  onChange={(event) =>
                    handleChange(
                      "notificationMessage",
                      event.target.value.slice(0, 160)
                    )
                  }
                />
              </Stack>
            </FormSectionCard>

            <FormSectionCard
              title="Contact opérationnel"
              subtitle="Personne à contacter le jour J"
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Nom complet *"
                    value={values.contactName}
                    error={!!errors.contactName}
                    helperText={errors.contactName}
                    onChange={(event) =>
                      handleChange("contactName", event.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Téléphone *"
                    value={values.contactPhone}
                    error={!!errors.contactPhone}
                    helperText={errors.contactPhone}
                    onChange={(event) =>
                      handleChange("contactPhone", event.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Email *"
                    value={values.contactEmail}
                    error={!!errors.contactEmail}
                    helperText={errors.contactEmail}
                    onChange={(event) =>
                      handleChange("contactEmail", event.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </FormSectionCard>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                pt: 1,
              }}
            >
              <Button
                variant="outlined"
                fullWidth
                disabled={isPending}
                onClick={() => handleSubmit("DRAFT")}
              >
                Enregistrer comme brouillon
              </Button>
              <Button
                variant="contained"
                color="success"
                fullWidth
                disabled={isPending}
                onClick={() => handleSubmit("PUBLISHED")}
              >
                Publier l'annonce
              </Button>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ flex: { xs: '1 1 auto', lg: '0 0 35%' } }}>
          <MerchantHomeDeliverySummaryCard values={values} />
        </Box>
      </Box>
    </Box>
  );
};
