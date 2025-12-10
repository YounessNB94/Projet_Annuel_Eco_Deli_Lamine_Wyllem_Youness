import jsPDF from 'jspdf';

import { adminStatusConfig, type AdminStatus } from '../components/AdminStatusChip';
import { drawEcoDeliLogo } from '../../shared/utils/ecoDeliLogo';

type InvoiceEntity = 'merchant' | 'courier';

export interface AdminInvoicePdfPayload {
  id: string;
  entity: InvoiceEntity;
  counterpart: string;
  period: string;
  amount: string;
  status: AdminStatus;
  issuedAt: string;
  dueAt: string;
}

const entityLabels: Record<InvoiceEntity, string> = {
  merchant: 'Commercant',
  courier: 'Livreur',
};

const defaultFont = 'helvetica';

const getStatusLabel = (status: AdminStatus) => adminStatusConfig[status]?.label ?? status;

const addMetadata = (doc: jsPDF, title: string) => {
  doc.setProperties({
    title,
    subject: 'Facture generee depuis le backoffice EcoDeli',
    author: 'EcoDeli',
  });
};

const drawHeader = (doc: jsPDF, payload: AdminInvoicePdfPayload, topY: number) => {
  doc.setFontSize(18);
  doc.setFont(defaultFont, 'bold');
  doc.text('EcoDeli - Facture', 105, topY, { align: 'center' });

  const infoLines = [
    `Reference: ${payload.id}`,
    `Periode: ${payload.period}`,
    `Categorie: ${entityLabels[payload.entity]}`,
  ];

  doc.setFontSize(12);
  doc.setFont(defaultFont, 'normal');

  let y = topY + 12;
  infoLines.forEach((line) => {
    doc.text(line, 20, y);
    y += 8;
  });

  return y;
};

const drawInvoiceDetails = (doc: jsPDF, payload: AdminInvoicePdfPayload, titleY: number) => {
  const rows: Array<[string, string]> = [
    ['Destinataire', payload.counterpart],
    ['Montant total', payload.amount],
    ['Statut', getStatusLabel(payload.status)],
    ['Emise le', payload.issuedAt],
    ['Echeance le', payload.dueAt],
  ];

  doc.setFont(defaultFont, 'bold');
  doc.text('Details de la facture', 20, titleY);
  doc.setFont(defaultFont, 'normal');

  let y = titleY + 10;
  const labelX = 20;
  const valueX = 120;

  rows.forEach(([label, value]) => {
    doc.text(label, labelX, y);
    doc.text(value, valueX, y);
    y += 8;
  });

  return y;
};

const drawFooter = (doc: jsPDF, startY: number) => {
  doc.setFontSize(10);
  doc.setFont(defaultFont, 'italic');
  doc.text("Document genere automatiquement - Merci de verifier dans l'ERP avant envoi.", 20, startY);
};

export const downloadAdminInvoicePdf = async (payload: AdminInvoicePdfPayload) => {
  const doc = new jsPDF();
  addMetadata(doc, `Facture ${payload.id}`);

  const logoBottomY = await drawEcoDeliLogo(doc);
  const headerTopY = Math.max(logoBottomY + 6, 28);
  const headerBottomY = drawHeader(doc, payload, headerTopY);

  const separatorY = headerBottomY + 6;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, separatorY, 190, separatorY);

  const detailsBottomY = drawInvoiceDetails(doc, payload, separatorY + 10);
  drawFooter(doc, detailsBottomY + 12);

  doc.save(`facture-${payload.id}.pdf`);
};
