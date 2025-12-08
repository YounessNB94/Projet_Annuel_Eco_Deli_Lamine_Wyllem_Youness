import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { Box, Card, CardContent, Typography } from '@mui/material';

const securityItems = [
  { title: 'Paiement sécurisé', description: 'Protection SSL 256-bit', icon: ShieldOutlinedIcon },
  { title: 'Données protégées', description: 'Conformité PCI-DSS', icon: LockOutlinedIcon },
];

export const PaymentSecurityCard = () => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      bgcolor: 'grey.50',
    }}
  >
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {securityItems.map(({ title, description, icon: Icon }) => (
        <Box key={title} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'success.light',
              color: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="body1" fontWeight={600}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {description}
            </Typography>
          </Box>
        </Box>
      ))}
    </CardContent>
  </Card>
);
