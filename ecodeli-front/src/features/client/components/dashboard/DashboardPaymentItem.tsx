import type { MouseEventHandler } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';

interface DashboardPaymentItemProps {
  title: string;
  dueDate: string;
  amount: string;
  onPay?: MouseEventHandler<HTMLButtonElement>;
}

export const DashboardPaymentItem = ({
  title,
  dueDate,
  amount,
  onPay,
}: DashboardPaymentItemProps) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={2}
    sx={{
      p: 2.5,
      borderRadius: 2,
      border: '1px solid #F57C00',
      bgcolor: '#FFF3E0',
      alignItems: { xs: 'flex-start', sm: 'center' },
      justifyContent: 'space-between',
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: '#F57C00',
          color: 'common.white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CreditCardOutlinedIcon />
      </Box>
      <Box>
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          À payer avant le {dueDate}
        </Typography>
      </Box>
    </Stack>

    <Stack direction="row" spacing={2} alignItems="center">
      <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#F57C00' }}>
        {amount}
      </Typography>
      <Button
        variant="contained"
        color="warning"
        onClick={onPay}
        sx={{ bgcolor: '#F57C00', '&:hover': { bgcolor: '#E65100' } }}
      >
        Payer maintenant
      </Button>
    </Stack>
  </Stack>
);
