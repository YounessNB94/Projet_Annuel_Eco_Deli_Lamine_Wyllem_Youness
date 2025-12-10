import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

import { AdminStatCard } from "../components/AdminStatCard";
import { AdminSectionCard } from "../components/AdminSectionCard";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "../components/AdminDataTable";
import {
  AdminStatusChip,
  type AdminStatus,
} from "../components/AdminStatusChip";
import {
  AdminActivityList,
  type AdminActivityItem,
} from "../components/AdminActivityList";
import {
  AdminFilterToolbar,
  type AdminFilterOption,
} from "../components/AdminFilterToolbar";

const courierMetrics = [
  {
    label: "Dossiers en attente",
    value: 12,
    helper: "dont 4 urgences",
    icon: <ShieldOutlinedIcon fontSize="small" />,
  },
  {
    label: "Validés cette semaine",
    value: 38,
    helper: "+8 vs semaine dernière",
  },
  { label: "Dossiers refusés", value: 5, helper: "2 pour documents expirés" },
  {
    label: "Temps moyen validation",
    value: "3j 4h",
    helper: "-12% vs objectif",
  },
];

interface CourierRow {
  id: string;
  name: string;
  company: string;
  zone: string;
  level: "Bronze" | "Argent" | "Or";
  status: AdminStatus;
  documents: {
    verified: number;
    total: number;
  };
  lastUpdate: string;
  submittedAt: string;
}

const courierRows: CourierRow[] = [
  {
    id: "CR-541",
    name: "Nadia Benali",
    company: "NB Logistics",
    zone: "Paris Ouest",
    level: "Argent",
    status: "pending",
    documents: { verified: 3, total: 5 },
    lastUpdate: "Il y a 15 min",
    submittedAt: "09:12",
  },
  {
    id: "CR-536",
    name: "Yohan Pereira",
    company: "YP Services",
    zone: "Lyon Centre",
    level: "Bronze",
    status: "review",
    documents: { verified: 4, total: 6 },
    lastUpdate: "Il y a 42 min",
    submittedAt: "08:31",
  },
  {
    id: "CR-512",
    name: "Sofiane Haddad",
    company: "SH Delivery",
    zone: "Marseille Sud",
    level: "Argent",
    status: "approved",
    documents: { verified: 6, total: 6 },
    lastUpdate: "Hier 18:04",
    submittedAt: "17/11",
  },
  {
    id: "CR-498",
    name: "Carla Renard",
    company: "Renard Courses",
    zone: "Bordeaux",
    level: "Or",
    status: "approved",
    documents: { verified: 7, total: 7 },
    lastUpdate: "Hier 11:18",
    submittedAt: "02/11",
  },
  {
    id: "CR-522",
    name: "Oumar N'Diaye",
    company: "ON Express",
    zone: "Lille Métropole",
    level: "Bronze",
    status: "rejected",
    documents: { verified: 2, total: 5 },
    lastUpdate: "Il y a 3 h",
    submittedAt: "08/11",
  },
];

type StatusFilter = "all" | AdminStatus;

const statusFilters: AdminFilterOption<StatusFilter>[] = [
  { label: "Tous", value: "all" },
  { label: "En attente", value: "pending" },
  { label: "En revue", value: "review" },
  { label: "Validés", value: "approved" },
  { label: "Refusés", value: "rejected" },
];

const validationActivity: AdminActivityItem[] = [
  {
    id: "valid-1",
    title: "Contrôle d’identité CR-541",
    description: "Document recto verso en attente de validation manuelle.",
    timestamp: "Il y a 10 min",
  },
  {
    id: "valid-2",
    title: "Permis expirant CR-522",
    description: "Expiration dans 18 jours, relance envoyée.",
    timestamp: "Il y a 1 h",
  },
  {
    id: "valid-3",
    title: "Attestation RC pro CR-536",
    description: "Signature numérique validée automatiquement.",
    timestamp: "Ce matin",
  },
];

const getInitials = (value: string) =>
  value
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .toUpperCase();

const buildCourierColumns = (
  onOpenDetail: (courier: CourierRow) => void
): AdminTableColumn<CourierRow>[] => [
  {
    key: "identity",
    label: "Livreur",
    render: (courier) => (
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: "primary.light", color: "primary.dark" }}>
          {getInitials(courier.name)}
        </Avatar>
        <Box>
          <Typography variant="body1" fontWeight={600}>
            {courier.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {courier.company} • {courier.zone}
          </Typography>
        </Box>
      </Stack>
    ),
  },
  {
    key: "level",
    label: "Niveau",
    hideOnMobile: true,
    render: (courier) => (
      <Chip size="small" variant="outlined" label={courier.level} />
    ),
  },
  {
    key: "documents",
    label: "Documents",
    hideOnMobile: true,
    render: (courier) => {
      const completion =
        (courier.documents.verified / courier.documents.total) * 100;
      return (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {courier.documents.verified}/{courier.documents.total} validés
          </Typography>
          <LinearProgress
            variant="determinate"
            value={completion}
            sx={{ mt: 0.5, borderRadius: 999 }}
          />
        </Box>
      );
    },
  },
  {
    key: "status",
    label: "Statut",
    render: (courier) => <AdminStatusChip status={courier.status} />,
  },
  {
    key: "lastUpdate",
    label: "Dernière activité",
    align: "right",
    render: (courier) => (
      <Stack spacing={0.3} alignItems="flex-end">
        <Typography variant="body2" fontWeight={600}>
          {courier.lastUpdate}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Dossier {courier.id}
        </Typography>
      </Stack>
    ),
  },
  {
    key: "actions",
    label: "",
    align: "right",
    render: (courier) => (
      <Button size="small" variant="text" onClick={() => onOpenDetail(courier)}>
        Voir dossier
      </Button>
    ),
  },
];

export const AdminCouriersPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const courierColumns = useMemo(
    () =>
      buildCourierColumns((courier) =>
        navigate(`/admin/livreurs/${courier.id}`)
      ),
    [navigate]
  );

  const filteredCouriers = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return courierRows.filter((courier) => {
      const matchesStatus =
        statusFilter === "all" || courier.status === statusFilter;
      const matchesSearch =
        normalized.length === 0 ||
        courier.name.toLowerCase().includes(normalized) ||
        courier.company.toLowerCase().includes(normalized) ||
        courier.id.toLowerCase().includes(normalized);
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, searchTerm]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Livreurs & conformité
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Suivi temps réel des dossiers coursiers et du pipeline de
            validation.
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "repeat(auto-fit, minmax(220px, 1fr))" },
        }}
      >
        {courierMetrics.map((metric) => (
          <AdminStatCard key={metric.label} {...metric} />
        ))}
      </Box>

      <AdminSectionCard
        title="Pipeline de validation"
        subtitle={`${filteredCouriers.length} dossiers correspondent à vos filtres`}
      >
        <Stack spacing={2}>
          <AdminFilterToolbar
            filters={statusFilters}
            value={statusFilter}
            onChange={setStatusFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Rechercher un livreur ou dossier"
          />

          <AdminDataTable
            columns={courierColumns}
            rows={filteredCouriers}
            getRowKey={(courier) => courier.id}
          />
        </Stack>
      </AdminSectionCard>

      <AdminSectionCard
        title="Actions récentes"
        subtitle="Dernières validations manuelles"
      >
        <AdminActivityList items={validationActivity} />
      </AdminSectionCard>
    </Box>
  );
};
