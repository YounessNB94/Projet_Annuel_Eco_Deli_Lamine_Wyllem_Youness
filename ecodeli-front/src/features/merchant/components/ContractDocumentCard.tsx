import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { Card, CardActions, CardContent, Chip, Stack, Typography, Button } from '@mui/material';
import type { MerchantContractDocument } from '../api/merchantContract';

const documentTypeLabel: Record<MerchantContractDocument['type'], string> = {
  CONTRACT: 'Contrat',
  ANNEX: 'Annexe',
  POLICY: 'Politique',
};

interface ContractDocumentCardProps {
  document: MerchantContractDocument;
  onDownload?: (document: MerchantContractDocument) => void | Promise<void>;
}

export const ContractDocumentCard = ({ document, onDownload }: ContractDocumentCardProps) => {
  const handleDownload = () => {
    if (onDownload) {
      void onDownload(document);
      return;
    }
    window.open(document.pdfUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <PictureAsPdfOutlinedIcon color="error" />
              <Typography variant="subtitle1" fontWeight={600}>
                {document.label}
              </Typography>
            </Stack>
            <Chip label={documentTypeLabel[document.type]} size="small" />
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Derniere mise a jour • {document.updatedAt}
          </Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="contained"
          startIcon={<CloudDownloadOutlinedIcon />}
          fullWidth
          onClick={handleDownload}
        >
          Telecharger le PDF
        </Button>
      </CardActions>
    </Card>
  );
};
