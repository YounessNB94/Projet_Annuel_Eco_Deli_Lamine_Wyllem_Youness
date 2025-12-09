import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import { Card, CardContent, Chip, Stack, Typography, Box } from '@mui/material';
import type { MerchantContract, MerchantContractStatus } from '../api/merchantContract';

const statusColorMap: Record<MerchantContractStatus, 'default' | 'info' | 'success' | 'warning'> = {
  DRAFT: 'default',
  UNDER_REVIEW: 'warning',
  ACTIVE: 'success',
  SUSPENDED: 'warning',
};

const statusIconMap: Record<MerchantContractStatus, JSX.Element> = {
  DRAFT: <DescriptionOutlinedIcon color="action" fontSize="large" />,
  UNDER_REVIEW: <GppMaybeOutlinedIcon color="warning" fontSize="large" />,
  ACTIVE: <VerifiedOutlinedIcon color="success" fontSize="large" />,
  SUSPENDED: <PauseCircleOutlineIcon color="warning" fontSize="large" />,
};

interface ContractStatusCardProps {
  contract: MerchantContract;
}

export const ContractStatusCard = ({ contract }: ContractStatusCardProps) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: 3,
      borderWidth: 1.5,
    }}
  >
    <CardContent>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 3,
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {statusIconMap[contract.status]}
        </Box>

        <Stack spacing={1} flexGrow={1}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="h5" fontWeight={600}>
              {contract.statusLabel}
            </Typography>
            <Chip label={contract.status} color={statusColorMap[contract.status]} size="small" />
          </Stack>

          <Typography variant="body1" color="text.secondary">
            {contract.statusDescription}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Derniere mise a jour • {contract.lastUpdate}
          </Typography>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);
