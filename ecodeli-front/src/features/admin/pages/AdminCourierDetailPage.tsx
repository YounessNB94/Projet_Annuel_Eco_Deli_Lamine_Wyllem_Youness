import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, Chip, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

import { AdminSectionCard } from "../components/AdminSectionCard";
import {
  AdminStatusChip,
  type AdminStatus,
} from "../components/AdminStatusChip";
import { AdminInfoList } from "../components/AdminInfoList";
import {
  AdminDocumentList,
  type AdminDocumentItem,
} from "../components/AdminDocumentList";
import {
  AdminActivityList,
  type AdminActivityItem,
} from "../components/AdminActivityList";
import { downloadCourierDocument } from "../utils/downloadCourierDocument";

interface CourierDocumentDefinition extends Omit<AdminDocumentItem, "actions"> {
  fileName: string;
}

interface CourierProfile {
  id: string;
  name: string;
  company: string;
  zone: string;
  level: "Bronze" | "Argent" | "Or";
  status: AdminStatus;
  deliveries: number;
  rating: string;
  averageSla: string;
  contactEmail: string;
  contactPhone: string;
}

const courierProfiles: Record<string, CourierProfile> = {
  "CR-541": {
    id: "CR-541",
    name: "Nadia Benali",
    company: "NB Logistics",
    zone: "Paris Ouest",
    level: "Argent",
    status: "pending",
    deliveries: 482,
    rating: "4,8/5",
    averageSla: "92 min",
    contactEmail: "nadia.benali@nb-log.fr",
    contactPhone: "+33 6 52 21 09 43",
  },
  "CR-536": {
    id: "CR-536",
    name: "Yohan Pereira",
    company: "YP Services",
    zone: "Lyon Centre",
    level: "Bronze",
    status: "review",
    deliveries: 205,
    rating: "4,2/5",
    averageSla: "104 min",
    contactEmail: "contact@yp-services.fr",
    contactPhone: "+33 7 61 04 88 30",
  },
  "CR-542": {
    id: "CR-542",
    name: "Yohan Pereira",
    company: "YP Services",
    zone: "Lyon Centre",
    level: "Bronze",
    status: "pending",
    deliveries: 214,
    rating: "4,1/5",
    averageSla: "101 min",
    contactEmail: "contact@yp-services.fr",
    contactPhone: "+33 7 61 04 88 30",
  },
  "CR-543": {
    id: "CR-543",
    name: "Sofiane Haddad",
    company: "SH Delivery",
    zone: "Paris Nord",
    level: "Argent",
    status: "pending",
    deliveries: 168,
    rating: "4,5/5",
    averageSla: "96 min",
    contactEmail: "contact@sh-delivery.fr",
    contactPhone: "+33 6 45 78 21 99",
  },
  "CR-512": {
    id: "CR-512",
    name: "Sofiane Haddad",
    company: "SH Delivery",
    zone: "Marseille Sud",
    level: "Argent",
    status: "approved",
    deliveries: 612,
    rating: "4,7/5",
    averageSla: "88 min",
    contactEmail: "support@sh-delivery.fr",
    contactPhone: "+33 6 45 78 21 99",
  },
  "CR-498": {
    id: "CR-498",
    name: "Carla Renard",
    company: "Renard Courses",
    zone: "Bordeaux",
    level: "Or",
    status: "approved",
    deliveries: 740,
    rating: "4,9/5",
    averageSla: "81 min",
    contactEmail: "carla@renard-courses.fr",
    contactPhone: "+33 6 98 52 10 03",
  },
  "CR-522": {
    id: "CR-522",
    name: "Oumar N'Diaye",
    company: "ON Express",
    zone: "Lille Métropole",
    level: "Bronze",
    status: "rejected",
    deliveries: 132,
    rating: "3,9/5",
    averageSla: "118 min",
    contactEmail: "operations@on-express.fr",
    contactPhone: "+33 7 82 13 44 27",
  },
};

const createPlaceholderCourierProfile = (identifier: string): CourierProfile => ({
  id: identifier,
  name: `Livreur ${identifier}`,
  company: "Entreprise non renseignée",
  zone: "Zone non renseignée",
  level: "Bronze",
  status: "pending",
  deliveries: 0,
  rating: "N/A",
  averageSla: "N/A",
  contactEmail: "contact@ecodeli.fr",
  contactPhone: "+33 1 80 02 12 34",
});

const documentsByCourier: Record<string, CourierDocumentDefinition[]> = {
  "CR-541": [
    {
      id: "doc-1",
      title: "Pièce d’identité",
      description: "Carte nationale - recto/verso",
      meta: "Ajouté le 09/12 à 09:12",
      status: { label: "En revue manuelle", color: "warning" },
      fileName: "CR-541-piece-identite.pdf",
    },
    {
      id: "doc-2",
      title: "Permis B",
      description: "Validité jusqu’au 14/08/2027",
      meta: "Contrôlé le 08/12 à 17:40",
      status: { label: "Vérifié", color: "success", variant: "filled" },
      fileName: "CR-541-permis-b.pdf",
    },
    {
      id: "doc-3",
      title: "Assurance RC Pro",
      description: "Attestation MAIF - couverture nationale",
      meta: "Expiration dans 134 jours",
      status: { label: "À renouveler bientôt", color: "info" },
      fileName: "CR-541-assurance-rc-pro.pdf",
    },
  ],
  "CR-536": [
    {
      id: "doc-4",
      title: "Pièce d’identité",
      description: "Passeport",
      meta: "Ajouté le 06/12 à 15:04",
      status: { label: "En attente", color: "warning" },
      fileName: "CR-536-piece-identite.pdf",
    },
    {
      id: "doc-5",
      title: "Permis B",
      description: "Validité jusqu’au 03/11/2025",
      meta: "Contrôlé automatiquement",
      status: { label: "Vérifié", color: "success", variant: "filled" },
      fileName: "CR-536-permis-b.pdf",
    },
  ],
  "CR-542": [
    {
      id: "doc-6",
      title: "Pièce d’identité",
      description: "Passeport biométrique",
      meta: "Ajouté le 08/12 à 08:52",
      status: { label: "En revue", color: "warning" },
      fileName: "CR-542-piece-identite.pdf",
    },
    {
      id: "doc-7",
      title: "Permis B",
      description: "Valide jusqu’au 03/11/2026",
      meta: "Contrôlé automatiquement",
      status: { label: "Vérifié", color: "success", variant: "filled" },
      fileName: "CR-542-permis-b.pdf",
    },
  ],
  "CR-543": [
    {
      id: "doc-8",
      title: "Pièce d’identité",
      description: "Carte nationale",
      meta: "Ajouté le 08/12 à 08:21",
      status: { label: "En attente", color: "warning" },
      fileName: "CR-543-piece-identite.pdf",
    },
    {
      id: "doc-9",
      title: "Permis B",
      description: "Validité jusqu’au 14/07/2028",
      meta: "À vérifier",
      status: { label: "À contrôler", color: "info" },
      fileName: "CR-543-permis-b.pdf",
    },
  ],
  "CR-512": [
    {
      id: "doc-10",
      title: "Permis B",
      description: "Validité jusqu’au 14/08/2027",
      meta: "Contrôlé le 08/12",
      status: { label: "Vérifié", color: "success", variant: "filled" },
      fileName: "CR-512-permis-b.pdf",
    },
    {
      id: "doc-11",
      title: "Assurance RC Pro",
      description: "Attestation AXA",
      meta: "Expiration dans 184 jours",
      status: { label: "À jour", color: "success", variant: "outlined" },
      fileName: "CR-512-assurance-rc-pro.pdf",
    },
  ],
  "CR-498": [
    {
      id: "doc-12",
      title: "Pièce d’identité",
      description: "CNI",
      meta: "Revu le 05/12",
      status: { label: "Validé", color: "success", variant: "filled" },
      fileName: "CR-498-piece-identite.pdf",
    },
    {
      id: "doc-13",
      title: "Kbis",
      description: "Extrait du 30/11",
      meta: "Certifié",
      status: { label: "Archivé", color: "default", variant: "outlined" },
      fileName: "CR-498-kbis.pdf",
    },
  ],
  "CR-522": [
    {
      id: "doc-14",
      title: "Pièce d’identité",
      description: "Passeport",
      meta: "À vérifier",
      status: { label: "Incomplet", color: "error" },
      fileName: "CR-522-piece-identite.pdf",
    },
    {
      id: "doc-15",
      title: "Permis B",
      description: "Validité jusqu’au 03/05/2025",
      meta: "Document flou",
      status: { label: "Rejeté", color: "error", variant: "filled" },
      fileName: "CR-522-permis-b.pdf",
    },
  ],
};

const activityByCourier: Record<string, AdminActivityItem[]> = {
  "CR-541": [
    {
      id: "activity-1",
      title: "Contrôle identité",
      description: "Sarah P. a demandé une revue manuelle du verso.",
      timestamp: "Il y a 12 min",
    },
    {
      id: "activity-2",
      title: "Permis validé",
      description: "Le permis B a été validé automatiquement (OCR).",
      timestamp: "Hier 18:04",
    },
    {
      id: "activity-3",
      title: "Relance assurance",
      description: "Notification programmée 30 jours avant expiration.",
      timestamp: "Hier 09:20",
    },
  ],
  "CR-536": [
    {
      id: "activity-4",
      title: "Pièce identité importée",
      description: "Document transmis par l’application mobile.",
      timestamp: "Il y a 2 h",
    },
  ],
  "CR-542": [
    {
      id: "activity-5",
      title: "OCR en cours",
      description: "Analyse automatisée du passeport.",
      timestamp: "Il y a 30 min",
    },
  ],
  "CR-543": [
    {
      id: "activity-6",
      title: "Relance documents",
      description: "Demande de justification complémentaire.",
      timestamp: "Il y a 1 h",
    },
  ],
  "CR-512": [
    {
      id: "activity-7",
      title: "Audit qualité",
      description: "Contrôle ponctuel réussi.",
      timestamp: "Hier 18:20",
    },
  ],
  "CR-498": [
    {
      id: "activity-8",
      title: "Renouvellement Kbis",
      description: "Document mis à jour automatiquement.",
      timestamp: "Hier 10:05",
    },
  ],
  "CR-522": [
    {
      id: "activity-9",
      title: "Rejet document",
      description: "Permis illisible, relance envoyée.",
      timestamp: "Il y a 3 h",
    },
  ],
};

const FALLBACK_COURIER_ID = "CR-541";

export const AdminCourierDetailPage = () => {
  const navigate = useNavigate();
  const { courierId } = useParams();
  const [reviewComment, setReviewComment] = useState("");
  const [currentStatus, setCurrentStatus] = useState<AdminStatus>("pending");
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<
    | { type: "approve" | "reject"; message: string }
    | null
  >(null);

  const courier = useMemo(() => {
    const identifier = courierId ?? FALLBACK_COURIER_ID;
    return courierProfiles[identifier] ?? createPlaceholderCourierProfile(identifier);
  }, [courierId]);

  useEffect(() => {
    setCurrentStatus(courier.status);
    setActionFeedback(null);
    setReviewComment("");
  }, [courier]);

  const courierDocumentDefinitions = documentsByCourier[courier.id] ?? [];
  const activities = activityByCourier[courier.id] ?? [];

  const handleDownloadDocument = useCallback(
    (doc: CourierDocumentDefinition) => {
      downloadCourierDocument({
        courierId: courier.id,
        courierName: courier.name,
        documentTitle: doc.title,
        fileName: doc.fileName,
        metadata: [
          { label: "Entreprise", value: courier.company },
          { label: "Zone", value: courier.zone },
          ...(doc.description ? [{ label: "Description", value: doc.description }] : []),
          ...(doc.meta ? [{ label: "Meta", value: doc.meta }] : []),
        ],
      });
    },
    [courier]
  );

  const documents = useMemo(
    () =>
      courierDocumentDefinitions.map((doc) => ({
        ...doc,
        actions: (
          <Button
            size="small"
            startIcon={<DownloadOutlinedIcon />}
            onClick={() => handleDownloadDocument(doc)}
          >
            Télécharger
          </Button>
        ),
      })),
    [courierDocumentDefinitions, handleDownloadDocument]
  );

  const runBackofficeAction = async (params: {
    nextStatus: AdminStatus;
    type: "approve" | "reject";
    message: string;
  }) => {
    const commentSnapshot = reviewComment;
    setIsProcessing(true);
    setActionFeedback(null);
    await new Promise((resolve) => setTimeout(resolve, 600));

    setCurrentStatus(params.nextStatus);
    setActionFeedback({ type: params.type, message: params.message });
    setIsProcessing(false);
    setReviewComment("");

    console.info("Admin decision", {
      decision: params.type,
      courierId: courier.id,
      comment: commentSnapshot,
    });
  };

  const handleApprove = async (mode: "fast" | "final") => {
    const message =
      mode === "fast"
        ? "Dossier approuvé via validation rapide."
        : "Dossier approuvé avec le commentaire transmis.";
    await runBackofficeAction({
      nextStatus: "approved",
      type: "approve",
      message,
    });
  };

  const handleReject = async () => {
    const comment = reviewComment.trim();
    const message = comment.length
      ? `Dossier refusé. Commentaire: ${comment}`
      : "Dossier refusé sans commentaire.";
    await runBackofficeAction({
      nextStatus: "rejected",
      type: "reject",
      message,
    });
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
      >
        <Stack spacing={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="text"
            color="inherit"
            onClick={() => navigate(-1)}
          >
            Retour aux dossiers
          </Button>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Box>
              <Typography variant="h4" component="h1" fontWeight={700}>
                {courier.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {courier.company} • {courier.zone}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <AdminStatusChip status={currentStatus} />
              <Chip label={`Niveau ${courier.level}`} variant="outlined" />
              <Chip
                label={`${courier.deliveries} livraisons`}
                icon={<ShieldOutlinedIcon fontSize="small" />}
                variant="outlined"
              />
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleOutlineIcon />}
            disabled={isProcessing}
            onClick={() => handleApprove("fast")}
          >
            Validation rapide
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", xl: "2fr 1fr" },
        }}
      >
        <Stack spacing={3}>
          <AdminSectionCard
            title="Documents requis"
            subtitle="Contrôlez et annotez les fichiers transmis"
          >
            <AdminDocumentList items={documents} />
          </AdminSectionCard>

          <AdminSectionCard
            title="Historique de validation"
            subtitle="Dernières actions et alertes"
          >
            <AdminActivityList items={activities} />
          </AdminSectionCard>
        </Stack>

        <Stack spacing={3}>
          <AdminSectionCard
            title="Action backoffice"
            subtitle="Décision finale"
          >
            <Stack spacing={2}>
              <TextField
                label="Commentaire interne"
                placeholder="Expliquez votre décision (visible par les managers backoffice)."
                multiline
                minRows={4}
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
              />
              {actionFeedback && (
                <Alert
                  severity={actionFeedback.type === "approve" ? "success" : "error"}
                >
                  {actionFeedback.message}
                </Alert>
              )}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<HighlightOffOutlinedIcon />}
                  disabled={isProcessing}
                  onClick={handleReject}
                >
                  Refuser le dossier
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleOutlineIcon />}
                  disabled={isProcessing}
                  onClick={() => handleApprove("final")}
                >
                  Approuver
                </Button>
              </Stack>
            </Stack>
          </AdminSectionCard>

          <AdminSectionCard title="Information coursier">
            <AdminInfoList
              columns={1}
              items={[
                { label: "Identifiant dossier", value: courier.id },
                { label: "Email", value: courier.contactEmail },
                { label: "Téléphone", value: courier.contactPhone },
                { label: "Niveau", value: courier.level },
                {
                  label: "Temps moyen de livraison",
                  value: courier.averageSla,
                },
                { label: "Satisfaction clients", value: courier.rating },
              ]}
            />
          </AdminSectionCard>
        </Stack>
      </Box>
    </Stack>
  );
};
