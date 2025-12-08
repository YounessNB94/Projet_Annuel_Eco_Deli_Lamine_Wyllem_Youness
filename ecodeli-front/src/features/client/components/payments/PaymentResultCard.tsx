import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { Box, Card, CardContent, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type PaymentResultStatus = 'success' | 'failed';

interface PaymentResultCardProps {
  status: PaymentResultStatus;
  title: string;
  description: string;
  children?: ReactNode;
}

const variantMap = {
  success: {
    border: '#A5D6A7',
    gradient: 'linear-gradient(135deg, #ffffff, #E8F5E9)',
    iconBg: 'success.main',
    icon: <CheckCircleOutlinedIcon sx={{ fontSize: 40 }} />,
    titleColor: 'success.main',
  },
  failed: {
    border: '#EF9A9A',
    gradient: 'linear-gradient(135deg, #ffffff, #FFEBEE)',
    iconBg: 'error.main',
    icon: <HighlightOffOutlinedIcon sx={{ fontSize: 40 }} />,
    titleColor: 'error.main',
  },
};

export const PaymentResultCard = ({ status, title, description, children }: PaymentResultCardProps) => {
  const variant = variantMap[status];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${variant.border}`,
        backgroundImage: variant.gradient,
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: variant.iconBg,
            color: 'common.white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          {variant.icon}
        </Box>
        <Typography variant="h5" color={variant.titleColor} fontWeight={700} sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {description}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
};
