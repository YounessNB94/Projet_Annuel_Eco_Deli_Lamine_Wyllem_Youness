import { useMemo, useState } from "react";
import type { ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import jsPDF from "jspdf";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ecoDeliLogoUrl from "../../../assets/EcoDeli-Logo.svg?url";
import { MerchantContractPreviewCard } from "../components/MerchantContractPreviewCard";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


interface MerchantApplyFormState {
  intent: "yes" | "explore";
  companyName: string;
  siret: string;
  address: string;
}

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  severity: "info" | "success";
}

const initialFormState: MerchantApplyFormState = {
  intent: "yes",
  companyName: "",
  siret: "",
  address: "",
};

let merchantLogoPromise: Promise<string> | null = null;

const loadEcoDeliLogo = () =>
  new Promise<string>((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Document non disponible pour le rendu PDF."));
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas indisponible pour charger le logo EcoDeli."));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () =>
      reject(new Error("Impossible de charger le logo EcoDeli."));
    img.src = ecoDeliLogoUrl;
  });

const getMerchantLogo = () => {
  if (!merchantLogoPromise) {
    merchantLogoPromise = loadEcoDeliLogo();
  }
  return merchantLogoPromise;
};

interface MerchantPdfPayload {
  companyName: string;
  siret: string;
  address: string;
  contractNumber: string;
  merchantApproved: boolean;
  adminApproved: boolean;
}

const formatNow = () =>
  new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

const formatLastUpdate = () =>
  new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(Date.now() - 1000 * 60 * 60 * 12);

const drawMerchantContractPdf = async (payload: MerchantPdfPayload) => {
  const doc = new jsPDF();

  const logoX = 20;
  const logoY = 12;
  const logoSize = 22;
  try {
    const logoDataUrl = await getMerchantLogo();
    doc.addImage(logoDataUrl, "PNG", logoX, logoY, logoSize + 6, logoSize + 6);
  } catch (error) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(47, 127, 51);
    doc.text("EcoDeli", logoX, logoY + logoSize);
    doc.setTextColor(0, 0, 0);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Contrat EcoDeli - Espace Commerçant", 105, logoY + 10, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const infoLines = [
    `Entreprise: ${payload.companyName || "N/A"}`,
    `Identifiant contrat: ${payload.contractNumber}`,
    `Statut: ${
      payload.adminApproved ? "Contrat actif" : "En attente d'approbation"
    }`,
    `Date: ${formatNow()}`,
  ];
  let cursorY = logoY + 26;
  const baselineX = 20;
  infoLines.forEach((line) => {
    doc.text(line, baselineX, cursorY);
    cursorY += 8;
  });

  cursorY += 2;
  doc.setDrawColor(210, 210, 210);
  doc.line(baselineX, cursorY, 190, cursorY);
  cursorY += 14;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Document sélectionné", baselineX, cursorY);
  cursorY += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  const documentDetails: Array<[string, string]> = [
    ["Intitulé", "Contrat principal EcoDeli"],
    ["Type", "Contrat"],
    ["Dernière mise à jour", formatLastUpdate()],
  ];
  documentDetails.forEach(([label, value]) => {
    doc.text(`${label}:`, baselineX, cursorY);
    doc.text(value, baselineX + 50, cursorY);
    cursorY += 8;
  });

  cursorY += 4;
  doc.setFont("helvetica", "italic");
  doc.text(
    "Document généré automatiquement depuis votre espace EcoDeli.",
    baselineX,
    cursorY
  );
  cursorY += 24;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Approbations", baselineX, cursorY);
  cursorY += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(
    `Commerçant: ${payload.merchantApproved ? "Signé" : "En attente"}`,
    baselineX,
    cursorY
  );
  doc.text(
    `Admin EcoDeli: ${payload.adminApproved ? "Validé" : "En attente"}`,
    baselineX + 80,
    cursorY
  );
  cursorY += 24;

  doc.setFont("helvetica", "bold");
  doc.text("Signature commerçant", baselineX, cursorY);
  cursorY += 16;
  doc.setDrawColor(150, 150, 150);
  doc.line(baselineX, cursorY, baselineX + 70, cursorY);
  doc.setFont("courier", "italic");
  doc.text(payload.companyName || "Signature", baselineX + 2, cursorY - 4);

  const sanitizedName = payload.companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-");
  doc.save(`contrat-${payload.contractNumber}-${sanitizedName || "ecom"}.pdf`);
};

export const MerchantApplyPage = () => {
  const [formState, setFormState] =
    useState<MerchantApplyFormState>(initialFormState);
  const [contractReady, setContractReady] = useState(false);
  const [merchantApproved, setMerchantApproved] = useState(false);
  const [adminApproved, setAdminApproved] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [contractNumber, setContractNumber] = useState<string | null>(null);

  const isFormValid = useMemo(() => {
    return Boolean(
      formState.companyName.trim() &&
        formState.siret.trim() &&
        formState.address.trim()
    );
  }, [formState]);

  const pushNotification = (notification: Omit<NotificationItem, "id">) => {
    setNotifications((prev) => [{ id: Date.now(), ...notification }, ...prev]);
  };

  const handleChange =
    (field: keyof MerchantApplyFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleGenerateContract = () => {
    if (!isFormValid) {
      return;
    }
    setContractReady(true);
    setMerchantApproved(false);
    setAdminApproved(false);
    const generatedNumber = `ECO-${Math.floor(
      Math.random() * 10_000
    )}-${new Date().getFullYear()}`;
    setContractNumber(generatedNumber);
    pushNotification({
      severity: "info",
      title: "Contrat généré",
      description: `Le contrat ${generatedNumber} est prêt et attend votre signature.`,
    });
  };

  const handleMerchantApproval = () => {
    setMerchantApproved(true);
    pushNotification({
      severity: "info",
      title: "Approbation commerçant envoyée",
      description:
        "Nous avons notifié l'administrateur EcoDeli pour validation finale.",
    });
  };

  const handleAdminApproval = () => {
    setAdminApproved(true);
    pushNotification({
      severity: "success",
      title: "Contrat approuvé",
      description:
        "L'administrateur EcoDeli a validé votre contrat. Vous pouvez le télécharger.",
    });
  };

  const handleContractDownload = async () => {
    if (!adminApproved || !contractNumber) {
      return;
    }

    await drawMerchantContractPdf({
      companyName: formState.companyName,
      siret: formState.siret,
      address: formState.address,
      contractNumber,
      merchantApproved,
      adminApproved,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Tooltip title="Retour à l'espace client" placement="left-start">
            <IconButton
              component={RouterLink}
              to="/client/dashboard"
              sx={{ bgcolor: "background.paper" }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h3" component="h1" fontWeight={700}>
              Devenir commerçant EcoDeli
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Partagez les informations essentielles de votre entreprise. Nous
              générons un contrat à double approbation pour vous et notre équipe
              admin.
            </Typography>
          </Stack>
        </Box>

        <Card>
          <CardHeader
            title="Souhaitez-vous rejoindre la marketplace ?"
            subheader="Une fois validé, vous pourrez créer des annonces, suivre vos livraisons et accéder aux paiements."
          />
          <Divider />
          <CardContent>
            <Stack spacing={3}>
              <FormControl>
                <FormLabel>
                  Souhaitez-vous devenir commerçant EcoDeli ?
                </FormLabel>
                <RadioGroup
                  row
                  value={formState.intent}
                  onChange={handleChange("intent")}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Oui, je suis prêt"
                  />
                  <FormControlLabel
                    value="explore"
                    control={<Radio />}
                    label="Je veux d'abord explorer"
                  />
                </RadioGroup>
              </FormControl>

              <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
                <TextField
                  required
                  label="Nom de l'entreprise"
                  placeholder="Eco Café Lyon"
                  value={formState.companyName}
                  onChange={handleChange("companyName")}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  required
                  label="Numéro de SIRET"
                  placeholder="123 456 789 00021"
                  value={formState.siret}
                  onChange={handleChange("siret")}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ApartmentOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <TextField
                required
                label="Adresse de l'entreprise"
                placeholder="10 rue des Lilas, 69001 Lyon"
                value={formState.address}
                onChange={handleChange("address")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  onClick={handleGenerateContract}
                  disabled={!isFormValid}
                >
                  Générer mon contrat
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {contractReady && (
          <Card>
            <CardHeader
              title="Contrat EcoDeli"
              subheader={
                contractNumber ? `#${contractNumber}` : "Contrat en préparation"
              }
            />
            <Divider />
            <CardContent>
              <Stack spacing={3}>
                <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
                  <Box
                    sx={{
                      flex: 1,
                      border: (t) => `1px solid ${t.palette.divider}`,
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Approbation commerçant
                    </Typography>
                    <Chip
                      sx={{ mt: 1 }}
                      color={merchantApproved ? "success" : "warning"}
                      label={
                        merchantApproved
                          ? "Approuvé"
                          : "En attente de signature"
                      }
                      icon={
                        merchantApproved ? (
                          <CheckCircleOutlineIcon />
                        ) : (
                          <PendingActionsOutlinedIcon />
                        )
                      }
                    />
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      border: (t) => `1px solid ${t.palette.divider}`,
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Approbation administrateur
                    </Typography>
                    <Chip
                      sx={{ mt: 1 }}
                      color={adminApproved ? "success" : "warning"}
                      label={
                        adminApproved
                          ? "Validé par l'admin"
                          : "En attente de validation"
                      }
                      icon={
                        adminApproved ? (
                          <CheckCircleOutlineIcon />
                        ) : (
                          <PendingActionsOutlinedIcon />
                        )
                      }
                    />
                  </Box>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  En envoyant la demande, vous confirmez que les informations
                  fournies sont exactes. EcoDeli utilise ce contrat pour activer
                  vos droits de publication et de paiement sur la plateforme.
                </Typography>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleMerchantApproval}
                    disabled={merchantApproved}
                  >
                    Approuver en tant que commerçant
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleAdminApproval}
                    disabled={!merchantApproved || adminApproved}
                  >
                    Simuler l'approbation admin
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<PictureAsPdfOutlinedIcon />}
                    onClick={handleContractDownload}
                    disabled={!adminApproved}
                  >
                    Télécharger le contrat signé
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader title="Aperçu du contrat" />
          <CardContent>
            <MerchantContractPreviewCard
              companyName={formState.companyName}
              siret={formState.siret}
              address={formState.address}
              contractNumber={contractNumber}
              merchantApproved={merchantApproved}
              adminApproved={adminApproved}
            />
          </CardContent>
        </Card>

        {notifications.length > 0 && (
          <Card>
            <CardHeader
              title="Notifications"
              subheader="Chaque étape clé apparaît ici pour suivi."
            />
            <Divider />
            <CardContent>
              <List>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    sx={{ alignItems: "flex-start" }}
                  >
                    <ListItemIcon>
                      <NotificationsActiveOutlinedIcon
                        color={
                          notification.severity === "success"
                            ? "success"
                            : "action"
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={600}>
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {notification.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {!contractReady && (
          <Alert severity="info" icon={<NotificationsActiveOutlinedIcon />}>
            Remplissez le formulaire pour générer automatiquement un contrat.
            Vous pourrez le signer puis laisser un administrateur EcoDeli le
            valider.
          </Alert>
        )}
      </Stack>
    </Container>
  );
};
