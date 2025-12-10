import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import type { ProviderInvoice } from '../types';
import { ProviderSectionCard } from '../components/ProviderSectionCard';
import { ProviderStatusChip } from '../components/ProviderStatusChip';
import { ProviderEmptyState } from '../components/ProviderEmptyState';
import { downloadProviderInvoice } from '../utils/downloadProviderInvoice';

const invoices: ProviderInvoice[] = [
  { id: 'INV-2025-09', period: 'Novembre 2025', amount: 2450, issuedAt: '01 déc. 2025', status: 'PAID' },
  { id: 'INV-2025-08', period: 'Octobre 2025', amount: 2310, issuedAt: '01 nov. 2025', status: 'PAID' },
  { id: 'INV-2025-07', period: 'Septembre 2025', amount: 2180, issuedAt: '01 oct. 2025', status: 'PAID' },
  { id: 'INV-2025-10', period: 'Décembre 2025', amount: 2600, issuedAt: 'À venir', status: 'PROCESSING' },
];

const pendingPayouts: ProviderInvoice[] = [];

const handleDownloadInvoice = async (invoice: ProviderInvoice) => {
  await downloadProviderInvoice({
    ...invoice,
    providerName: 'EcoDeli Partner',
    iban: 'FR76 1020 7001 0900 1234 5678 901',
    payoutReference: invoice.status === 'PAID' ? `VIR-${invoice.id}` : undefined,
  });
};

export const ProviderInvoicesPage = () => (
  <Stack spacing={3}>
    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
      <div>
        <Typography variant="h5" fontWeight={700}>
          Facturation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visualisez vos factures mensuelles et l’état des virements.
        </Typography>
      </div>
      <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
        <TrendingUpOutlinedIcon fontSize="small" color="success" />
        Revenu moyen glissant 3 mois : 2 380 €
      </Typography>
    </Stack>

    <ProviderSectionCard title="Factures" subtitle="Historique sur les 12 derniers mois">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Période</TableCell>
              <TableCell>Émise le</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id} hover>
                <TableCell>
                  <Stack>
                    <Typography fontWeight={600}>{invoice.period}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      #{invoice.id}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{invoice.issuedAt}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{invoice.amount.toFixed(0)} €</TableCell>
                <TableCell>
                  <ProviderStatusChip status={invoice.status} />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => void handleDownloadInvoice(invoice)}>
                    <DownloadOutlinedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ProviderSectionCard>

    <ProviderSectionCard title="Virements à venir" subtitle="Factures prêtes à être payées">
      {pendingPayouts.length === 0 ? (
        <ProviderEmptyState
          title="Aucun virement en attente"
          description="Vos factures ont toutes été réglées. Les prochains gains seront affichés ici."
        />
      ) : (
        <Typography variant="body2">Des virements sont en cours.</Typography>
      )}
    </ProviderSectionCard>
  </Stack>
);
