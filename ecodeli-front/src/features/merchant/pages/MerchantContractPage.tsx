import { Box, Button, Alert, Skeleton, Stack, Typography } from "@mui/material";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import { useMerchantContract } from "../hooks/useMerchantContract";
import { ContractStatusCard } from "../components/ContractStatusCard";
import { ContractDocumentCard } from "../components/ContractDocumentCard";
import { ContractInfoList } from "../components/ContractInfoList";
import type { MerchantContractDocument } from "../api/merchantContract";
import { downloadMerchantContractPdf } from "../utils/downloadMerchantContractPdf";

export const MerchantContractPage = () => {
  const { data, isLoading, isError, refetch } = useMerchantContract();

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={280} height={48} />
        <Skeleton variant="rounded" height={200} sx={{ mt: 3 }} />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => refetch()}>Reessayer</Button>}
      >
        Impossible de charger les informations du contrat.
      </Alert>
    );
  }

  const primaryDocument = data.documents[0];

  const handleDocumentDownload = async (document: MerchantContractDocument) => {
    try {
      await downloadMerchantContractPdf({ contract: data, document });
    } catch (error) {
      console.error("Impossible de generer le PDF du contrat", error);
    }
  };

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
            Contrat commerçant
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Suivez l'etat de votre contrat et accedez a la version signee en un
            clic.
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          width={{ xs: "100%", md: "auto" }}
        >
          {primaryDocument ? (
            <Button
              variant="contained"
              startIcon={<PictureAsPdfOutlinedIcon />}
              onClick={() => {
                void handleDocumentDownload(primaryDocument);
              }}
            >
              Telecharger le contrat
            </Button>
          ) : null}
        </Stack>
      </Stack>

      <ContractStatusCard contract={data} />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Documents du contrat
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mb: 0,
            }}
          >
            {data.documents.map((document) => (
              <ContractDocumentCard
                key={document.id}
                document={document}
                onDownload={(doc) => {
                  void handleDocumentDownload(doc);
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ width: { xs: "100%", lg: 320 }, flexShrink: 0 }}>
          <ContractInfoList
            title="Support commercant"
            items={[
              { label: "Entreprise", value: data.companyName },
              { label: "Identifiant contrat", value: data.id },
              { label: "Email support", value: data.supportEmail },
              { label: "Telephone", value: data.supportPhone },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
};
