import jsPDF from 'jspdf';
import ecoDeliLogoUrl from '../../../assets/EcoDeli-Logo.svg?url';
import type { ProviderInvoice } from '../types';

export interface ProviderInvoiceDownloadPayload extends ProviderInvoice {
  providerName?: string;
  iban?: string;
  payoutReference?: string;
}

const formatCurrency = (value: number) => `${value.toFixed(2)} €`;

let logoDataUrlPromise: Promise<string> | null = null;

const loadLogoAsPngDataUrl = () =>
  new Promise<string>((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Impossible de charger le logo EcoDeli hors navigateur.'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Contexte canvas indisponible pour le logo EcoDeli.'));
        return;
      }
      context.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Impossible de charger le logo EcoDeli.'));
    img.src = ecoDeliLogoUrl;
  });

const getLogoDataUrl = () => {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = loadLogoAsPngDataUrl();
  }
  return logoDataUrlPromise;
};

const drawEcoDeliLogo = async (pdf: jsPDF) => {
  const logoX = 20;
  const logoY = 14;
  const logoWidth = 24;
  const logoHeight = 24;

  try {
    const logoDataUrl = await getLogoDataUrl();
    pdf.addImage(logoDataUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);
  } catch (error) {
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(47, 127, 51);
    pdf.text('EcoDeli', logoX, logoY + logoHeight - 6);
  }

  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  return logoY + logoHeight;
};

export const downloadProviderInvoice = async ({
  id,
  period,
  amount,
  issuedAt,
  status,
  providerName = 'Prestataire EcoDeli',
  iban = 'FR76 XXXX XXXX XXXX XXXX XXXX XXX',
  payoutReference,
}: ProviderInvoiceDownloadPayload) => {
  const doc = new jsPDF();

  const logoBottomY = await drawEcoDeliLogo(doc);
  doc.setFontSize(18);
  const titleY = logoBottomY - 4;
  doc.text('Recapitulatif de facturation', 105, titleY, { align: 'center' });

  doc.setFontSize(12);
  const infoStartY = Math.max(titleY, logoBottomY) + 12;
  doc.text(`Facture #${id}`, 20, infoStartY);
  doc.text(`Prestataire: ${providerName}`, 20, infoStartY + 8);
  doc.text(`Periode: ${period}`, 20, infoStartY + 16);
  doc.text(`Emise le: ${issuedAt}`, 20, infoStartY + 24);

  doc.setDrawColor(200, 200, 200);
  const separatorY = infoStartY + 30;
  doc.line(20, separatorY, 190, separatorY);

  doc.setFont('helvetica', 'bold');
  doc.text('Details financiers', 20, separatorY + 12);
  doc.setFont('helvetica', 'normal');

  const rows: Array<[string, string]> = [
    ['Statut de la facture', status],
    ['Montant total', formatCurrency(amount)],
    ['IBAN de versement', iban],
  ];

  if (payoutReference) {
    rows.push(['Reference virement', payoutReference]);
  }

  let y = separatorY + 24;
  rows.forEach(([label, value]) => {
    doc.text(label, 20, y);
    doc.text(value, 190, y, { align: 'right' });
    y += 8;
  });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(
    "Ce document est genere automatiquement. Conservez-le pour vos archives comptables.",
    20,
    y + 6
  );

  doc.save(`facture-prestataire-${id}.pdf`);
};
