import { Card, CardContent, Stack, Typography, Divider } from '@mui/material';

interface ContractInfoItem {
  label: string;
  value: string;
}

interface ContractInfoListProps {
  title: string;
  items: ContractInfoItem[];
}

export const ContractInfoList = ({ title, items }: ContractInfoListProps) => (
  <Card variant="outlined" sx={{ borderRadius: 3 }}>
    <CardContent>
    
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Stack spacing={2} divider={<Divider flexItem />}> 
        {items.map((item) => (
          <Stack key={item.label} spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {item.label}
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {item.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </CardContent>
  </Card>
);
