import jsPDF from 'jspdf';
import type { MerchantContract, MerchantContractDocument } from '../api/merchantContract';
import { drawEcoDeliLogo } from '../../shared/utils/ecoDeliLogo';

interface DownloadMerchantContractPdfParams {
  contract: MerchantContract;
  document: MerchantContractDocument;
}

const documentTypeLabel: Record<MerchantContractDocument['type'], string> = {
  CONTRACT: 'Contrat',
  ANNEX: 'Annexe',
  POLICY: 'Politique',
};

const setFontStyle = (pdf: jsPDF, style: 'normal' | 'bold' | 'italic' | 'bolditalic') => {
  const { fontName } = pdf.getFont();
  pdf.setFont(fontName || 'helvetica', style);
};

export const downloadMerchantContractPdf = async ({ contract, document }: DownloadMerchantContractPdfParams) => {
  const doc = new jsPDF();

  const logoBottomY = await drawEcoDeliLogo(doc);
  doc.setFontSize(18);
  const titleY = logoBottomY - 4;
  doc.text('Contrat EcoDeli - Espace Commerçant', 105, titleY, { align: 'center' });

  doc.setFontSize(12);
  const infoStartY = Math.max(titleY, logoBottomY) + 12;
  const infoLineSpacing = 8;
  const contractInfoLines = [
    `Entreprise: ${contract.companyName}`,
    `Identifiant contrat: ${contract.id}`,
    `Statut: ${contract.statusLabel}`,
    `Date: ${contract.lastUpdate}`,
  ];

  let cursorY = infoStartY;
  contractInfoLines.forEach((line) => {
    doc.text(line, 20, cursorY);
    cursorY += infoLineSpacing;
  });

  doc.setFontSize(14);
  setFontStyle(doc, 'bold');
  doc.text('Document sélectionné', 20, cursorY);
  setFontStyle(doc, 'normal');
  doc.setFontSize(12);
  cursorY += 10;

  const details: Array<[string, string]> = [
    ['Intitulé', document.label],
    ['Type', documentTypeLabel[document.type]],
    ['Dernière mise à jour', document.updatedAt],
    // ['Lien original', document.pdfUrl],
  ];

  let y = cursorY;
  const valueWidth = 150;
  const lineSpacing = 6;

  details.forEach(([label, value]) => {
    const lines = doc.splitTextToSize(value, valueWidth);
    doc.text(`${label}:`, 20, y);
    lines.forEach((lineText: string, index: number) => {
      const lineY = y + lineSpacing * index;
      doc.text(lineText, 60, lineY);
    });
    y += lineSpacing * lines.length + 4;
  });

  setFontStyle(doc, 'italic');
  doc.text('Document généré automatiquement depuis votre espace EcoDeli.', 20, y + 6);

  const signatureSectionTop = y + 30;
  doc.setFontSize(14);
  doc.text('J. Exemple', 22, signatureSectionTop + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  const sanitizedLabel = document.label.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
  doc.save(`contrat-${contract.id}-${sanitizedLabel}.pdf`);
};
