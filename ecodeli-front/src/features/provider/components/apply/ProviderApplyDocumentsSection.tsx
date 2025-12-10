import { Box, Button, Stack, Typography } from "@mui/material";
import { ProviderSectionCard } from "../ProviderSectionCard";
import type {
  ProviderApplyDocumentChangeHandler,
  ProviderDocumentField,
} from "../../types/providerApply";

interface ProviderApplyDocumentsSectionProps {
  documentFields: ProviderDocumentField[];
  documents: Record<string, string>;
  onDocumentChange: ProviderApplyDocumentChangeHandler;
  areDocumentsComplete: boolean;
}

export const ProviderApplyDocumentsSection = ({
  documentFields,
  documents,
  onDocumentChange,
  areDocumentsComplete,
}: ProviderApplyDocumentsSectionProps) => (
  <ProviderSectionCard
    title="Documents justificatifs"
    subtitle="Chargez les pièces nécessaires à la validation"
  >
    <Stack spacing={2}>
      {documentFields.map((doc) => (
        <Box
          key={doc.key}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "minmax(280px, 1fr) auto auto",
            },
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {doc.label}
          </Typography>
          <Button
            component="label"
            variant="outlined"
            size="small"
            sx={{ justifySelf: { sm: "start" }, minWidth: 220 }}
          >
            Télécharger un fichier
            <input type="file" hidden onChange={onDocumentChange(doc.key)} />
          </Button>
          {documents[doc.key] && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ justifySelf: { sm: "start" } }}
            >
              {documents[doc.key]}
            </Typography>
          )}
        </Box>
      ))}
    </Stack>
    <Typography
      variant="caption"
      sx={{ color: areDocumentsComplete ? "text.secondary" : "error.main", mt: 1 }}
    >
      Tous les justificatifs listés sont obligatoires pour valider votre candidature.
    </Typography>
  </ProviderSectionCard>
);
