import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Tooltip
} from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import TwoWheelerOutlinedIcon from '@mui/icons-material/TwoWheelerOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';

interface CourierApplyFormState {
  intent: 'yes' | 'no';
  IBAN: string;
  email: string;
  vehicleType: 'car' | 'motorcycle' | 'truck' | 'van';
  motivation: string;
}

const vehicleOptions = [
  { value: 'car', label: 'Voiture', icon: <DirectionsCarFilledOutlinedIcon fontSize="small" /> },
  { value: 'motorcycle', label: 'Moto', icon: <TwoWheelerOutlinedIcon fontSize="small" /> },
  { value: 'truck', label: 'Camion', icon: <LocalShippingOutlinedIcon fontSize="small" /> },
  { value: 'van', label: 'Camionnette', icon: <AirportShuttleOutlinedIcon fontSize="small" /> },
];

export const CourierApplyPage = () => {
  const [formState, setFormState] = useState<CourierApplyFormState>({
    intent: 'yes',
    IBAN: '',
    email: '',
    vehicleType: 'car',
    motivation: '',
  });
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.type !== 'application/pdf') {
      setIdentityFile(null);
      setFileError('Merci de téléverser un fichier PDF (identité scannée).');
      return;
    }
    setIdentityFile(file);
    setFileError(null);
  };

  const handleChange = (field: keyof CourierApplyFormState) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
        <Tooltip title="Retour à l'espace client" placement="left-start">
          <IconButton
            component={RouterLink}
            to="/client/dashboard"
            sx={{ bgcolor: 'background.paper' }}
          >
            <ArrowBackIcon />
          </IconButton>
          </Tooltip>
          <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
        
            <Typography variant="h3" component="h1" fontWeight={700}>
              Devenir livreur partenaire
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Répondez à quelques questions rapides, téléversez votre pièce d'identité (format PDF uniquement) et notre équipe validera votre dossier sous 48h.
            </Typography>
          </Stack>
        </Box>

        {submitted && (
          <Alert severity="success" icon={<CheckCircleOutlineIcon fontSize="small" />}>
            Merci ! Nous avons bien reçu votre demande. Un conseiller EcoDeli vous contactera prochainement.
          </Alert>
        )}

        <Card component="form" onSubmit={handleSubmit}>
          <CardHeader
            title="Informations requises"
            subheader="Ces données restent strictement confidentielles et servent uniquement à vérifier votre identité."
          />
          <Divider />
          <CardContent>
            <Stack spacing={3}>
              <FormControl>
                <FormLabel>Souhaitez-vous devenir livreur EcoDeli ?</FormLabel>
                <RadioGroup row value={formState.intent} onChange={handleChange('intent')}>
                  <FormControlLabel value="yes" control={<Radio />} label="Oui, en route !" />
                  <FormControlLabel value="no" control={<Radio />} label="Non" />
                </RadioGroup>
              </FormControl>

              <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                <TextField
                  required
                  label="IBAN"
                  placeholder="FR76 3000 4000 1234 5678 9012 345"
                  value={formState.IBAN}
                  onChange={handleChange('IBAN')}
                  fullWidth
                />
                
              </Stack>

              <FormControl required>
                <FormLabel>Type de véhicule</FormLabel>
                <RadioGroup
                  row
                  value={formState.vehicleType}
                  onChange={handleChange('vehicleType')}
                  aria-required
                  sx={{ gap: 2, flexWrap: 'wrap' }}
                >
                  {vehicleOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={
                        <Stack direction="row" spacing={1} alignItems="center">
                          {option.icon}
                          <Typography variant="body2" fontWeight={600}>
                            {option.label}
                          </Typography>
                        </Stack>
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <TextField
                label="Motivation / disponibilités"
                placeholder="Indiquez-nous votre expérience, zone de livraison, etc."
                multiline
                minRows={4}
                value={formState.motivation}
                onChange={handleChange('motivation')}
              />

              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Pièce d'identité (PDF)
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Nous acceptons uniquement les formats PDF. Taille maximale recommandée : 5 Mo.
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileOutlinedIcon />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  {identityFile ? 'Changer de document' : 'Téléverser un document'}
                  <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
                </Button>
                {identityFile && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Fichier sélectionné : {identityFile.name}
                  </Typography>
                )}
                {fileError && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {fileError}
                  </Typography>
                )}
              </Box>
            </Stack>
          </CardContent>
          <Divider />
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="success" size="large" disabled={!identityFile}>
              Envoyer ma candidature
            </Button>
          </Box>
        </Card>
      </Stack>
    </Container>
  );
};
