import { useMemo, useState, type ReactElement } from "react";
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
import { useAdminCouriersData } from "../hooks/useAdminCouriers";
import type {
  AdminCourierActivityRecord,
  AdminCourierMetric,
  AdminCourierMetricIconKey,
  AdminCourierRow,
} from "../api/adminCouriers";

type StatusFilter = "all" | AdminStatus;

const statusFilters: AdminFilterOption<StatusFilter>[] = [
  { label: "Tous", value: "all" },
  { label: "En attente", value: "pending" },
  { label: "En revue", value: "review" },
  { label: "Validés", value: "approved" },
  { label: "Refusés", value: "rejected" },
];

const metricIconFactory: Record<AdminCourierMetricIconKey, () => ReactElement> = {
  shield: () => <ShieldOutlinedIcon fontSize="small" />,
};

const mapMetricToCard = (metric: AdminCourierMetric) => ({
  ...metric,
  icon: metric.icon ? metricIconFactory[metric.icon]() : undefined,
});

const mapActivityRecord = (activity: AdminCourierActivityRecord): AdminActivityItem => ({
  ...activity,
});

const getInitials = (value: string) =>
  value
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .toUpperCase();

const buildCourierColumns = (
  onOpenDetail: (courier: AdminCourierRow) => void
): AdminTableColumn<AdminCourierRow>[] => [
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
  const { data } = useAdminCouriersData();
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

  const metrics = useMemo(() => (data?.metrics ?? []).map(mapMetricToCard), [data]);
  const courierRows = useMemo<AdminCourierRow[]>(() => data?.couriers ?? [], [data]);
  const validationActivity = useMemo<AdminActivityItem[]>(
    () => (data?.validationActivity ?? []).map(mapActivityRecord),
    [data],
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
            {metrics.map((metric) => (
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
