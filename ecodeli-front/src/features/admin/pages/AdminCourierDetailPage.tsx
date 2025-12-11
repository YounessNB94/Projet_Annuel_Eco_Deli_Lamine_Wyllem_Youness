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
import { AdminDocumentList } from "../components/AdminDocumentList";
import { AdminActivityList } from "../components/AdminActivityList";
import { downloadCourierDocument } from "../utils/downloadCourierDocument";
import {
  DEFAULT_ADMIN_COURIER_ID,
  type AdminCourierDocumentRecord,
  type AdminCourierProfile,
} from "../api/adminCourierDetail";
import {
  useAdminCourierActivity,
  useAdminCourierDocuments,
  useAdminCourierProfile,
} from "../hooks/useAdminCourierDetail";

const createPlaceholderCourierProfile = (identifier: string): AdminCourierProfile => ({
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

type CourierDocumentDefinition = AdminCourierDocumentRecord;

export const AdminCourierDetailPage = () => {
  const navigate = useNavigate();
  const { courierId } = useParams();
  const resolvedCourierId = courierId ?? DEFAULT_ADMIN_COURIER_ID;
  const { data: courierProfile } = useAdminCourierProfile(courierId);
  const { data: courierDocumentDefinitions = [] } = useAdminCourierDocuments(courierId);
  const { data: activities = [] } = useAdminCourierActivity(courierId);
  const [reviewComment, setReviewComment] = useState("");
  const [currentStatus, setCurrentStatus] = useState<AdminStatus>("pending");
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<
    | { type: "approve" | "reject"; message: string }
    | null
  >(null);

  const courier = useMemo(() => {
    return courierProfile ?? createPlaceholderCourierProfile(resolvedCourierId);
  }, [courierProfile, resolvedCourierId]);

  useEffect(() => {
    setCurrentStatus(courier.status);
    setActionFeedback(null);
    setReviewComment("");
  }, [courier]);

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
