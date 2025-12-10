import {
  Box,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { ClientPayment } from '../../api/clientPayments';
import { ClientPaymentStatusChip } from './ClientPaymentStatusChip';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

interface ClientPaymentTableProps {
  payments: ClientPayment[];
  onSelectPayment: (paymentId: string) => void;
}

export const ClientPaymentTable = ({ payments, onSelectPayment }: ClientPaymentTableProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
    }}
  >
    <CardContent sx={{ p: 0 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID paiement</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell>Livraison</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Echeance</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                    {payment.id}
                  </Typography>
                </TableCell>
                <TableCell>{payment.reference}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {payment.deliveryTitle}
                  </Typography>
                </TableCell>
                <TableCell>{payment.amount.toFixed(2)} EUR</TableCell>
                <TableCell>{new Date(payment.dueDate).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>
                  <ClientPaymentStatusChip status={payment.status} />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                            size="small"
                            aria-label="Voir le détail"
                            onClick={() => onSelectPayment(payment.id)}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                    <Typography variant="body1" fontWeight={600}>
                      Aucun paiement a afficher
                    </Typography>
                    <Typography variant="body2">Tous vos paiements sont a jour.</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);
