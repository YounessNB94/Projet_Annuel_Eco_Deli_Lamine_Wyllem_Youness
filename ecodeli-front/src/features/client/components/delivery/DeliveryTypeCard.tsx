import { Card, CardContent, CardHeader, Chip } from '@mui/material';

interface Props {
  typeLabel: string;
}

export const DeliveryTypeCard = ({ typeLabel }: Props) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (t) => `1px solid ${t.palette.divider}`,
    }}
  >
    <CardHeader
      title="Type de livraison"
      sx={{
        '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 },
      }}
    />
    <CardContent>
      <Chip label={typeLabel} color="success" />
    </CardContent>
  </Card>
);
