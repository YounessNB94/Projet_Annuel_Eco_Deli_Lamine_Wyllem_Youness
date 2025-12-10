export interface AdminFlowExportRow {
  id: string;
  type: string;
  title: string;
  merchant: string;
  zone: string;
  window: string;
  status: string;
  volume: string;
  couriers: number;
}

const HEADERS: Array<keyof AdminFlowExportRow> = [
  'id',
  'type',
  'title',
  'merchant',
  'zone',
  'window',
  'status',
  'volume',
  'couriers',
];

const HEADER_LABELS: Record<keyof AdminFlowExportRow, string> = {
  id: 'Identifiant',
  type: 'Type',
  title: 'Titre',
  merchant: 'Commerçant',
  zone: 'Zone',
  window: 'Fenêtre',
  status: 'Statut',
  volume: 'Volume',
  couriers: 'Livreurs',
};

const formatCell = (value: string | number) => {
  const raw = String(value ?? '');
  const escaped = raw.replace(/"/g, '""');
  if (/[";\n]/.test(escaped)) {
    return `"${escaped}"`;
  }
  return escaped;
};

const buildCsvContent = (rows: AdminFlowExportRow[]) => {
  const headerLine = HEADERS.map((header) => HEADER_LABELS[header]).join(';');
  const dataLines = rows.map((row) => HEADERS.map((header) => formatCell(row[header])).join(';'));
  return [headerLine, ...dataLines].join('\n');
};

export const exportAdminFlowsCsv = (rows: AdminFlowExportRow[], fileName = 'export-annonces-livraisons.csv') => {
  if (rows.length === 0) {
    return;
  }

  const content = buildCsvContent(rows);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
