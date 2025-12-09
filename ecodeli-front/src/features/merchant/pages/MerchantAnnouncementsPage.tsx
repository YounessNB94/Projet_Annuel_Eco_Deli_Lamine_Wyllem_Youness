import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Skeleton,
  Snackbar,
  Tab,
  Tabs,
  Typography,
  Stack,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import type { MerchantAnnouncementStatus } from "../api/merchantAnnouncements";
import { useMerchantAnnouncements } from "../hooks/useMerchantAnnouncements";
import { MerchantAnnouncementsOverview } from "../components/MerchantAnnouncementsOverview";
import { MerchantAnnouncementsEmptyState } from "../components/MerchantAnnouncementsEmptyState";
import { MerchantAnnouncementCard } from "../components/MerchantAnnouncementCard";

const statusFilters: Array<{
  label: string;
  value: "ALL" | MerchantAnnouncementStatus;
}> = [
  { label: "Toutes", value: "ALL" },
  { label: "Publiées", value: "PUBLISHED" },
  { label: "Brouillons", value: "DRAFT" },
];

export const MerchantAnnouncementsPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useMerchantAnnouncements();
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | MerchantAnnouncementStatus
  >("ALL");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const announcements = data ?? [];
  const filteredAnnouncements = useMemo(() => {
    if (statusFilter === "ALL") return announcements;
    return announcements.filter(
      (announcement) => announcement.status === statusFilter
    );
  }, [announcements, statusFilter]);

  const handleCreate = () => navigate("/merchant/annonces/nouvelle");

  const handleDuplicate = (campaignName: string) => {
    setSnackbarMessage(`Duplication de ${campaignName} bientôt disponible.`);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}>
        <Box>
            
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Mes annonces
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visualisez et pilotez vos campagnes MERCHANT_HOME_DELIVERY.
          </Typography>
        </Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          width={{ xs: "100%", md: "auto" }}
        >
          <Button
            variant="outlined"
            startIcon={<RefreshOutlinedIcon />}
            onClick={() => refetch()}
          >
            Rafraîchir
          </Button>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleCreate}
          >
            Nouvelle annonce
          </Button>
        </Stack>
      </Stack>

      {isError && (
        <Alert
          severity="error"
          action={<Button onClick={() => refetch()}>Réessayer</Button>}
        >
          Impossible de charger vos annonces pour le moment.
        </Alert>
      )}

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "",
            gap: 2,
           
          }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={160} />
          ))}
        </Box>
      ) : announcements.length ? (
        <>
          <MerchantAnnouncementsOverview announcements={announcements} />

          <Tabs
            value={statusFilter}
            onChange={(_, value) => setStatusFilter(value)}
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            {statusFilters.map((filter) => (
              <Tab
                key={filter.value}
                label={filter.label}
                value={filter.value}
              />
            ))}
          </Tabs>

          {!filteredAnnouncements.length ? (
            <Alert severity="info">
              Aucune annonce{" "}
              {statusFilter === "ALL"
                ? ""
                : statusFilter === "PUBLISHED"
                ? "publiée"
                : "en brouillon"}{" "}
              pour ce filtre.
            </Alert>
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
              }}
            >
              {filteredAnnouncements.map((announcement) => (
                <MerchantAnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onDuplicate={(item) => handleDuplicate(item.campaignName)}
                />
              ))}
            </Box>
          )}
        </>
      ) : (
        <MerchantAnnouncementsEmptyState onCreate={handleCreate} />
      )}

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage("")}
        message={snackbarMessage}
      />
    </Box>
  );
};
