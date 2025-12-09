import jsPDF from 'jspdf';
import ecoDeliLogoUrl from '../../../assets/EcoDeli-Logo.svg?url';
import type { MerchantContract, MerchantContractDocument } from '../api/merchantContract';

interface DownloadMerchantContractPdfParams {
  contract: MerchantContract;
  document: MerchantContractDocument;
}

const documentTypeLabel: Record<MerchantContractDocument['type'], string> = {
  CONTRACT: 'Contrat',
  ANNEX: 'Annexe',
  POLICY: 'Politique',
};

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

  cursorY += 4;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, cursorY, 190, cursorY);
  cursorY += 14;

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Document sélectionné', 20, cursorY);
  doc.setFont(undefined, 'normal');
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
    lines.forEach((line, index) => {
      doc.text(line, 60, y + index * lineSpacing);
    });
    y += lineSpacing * lines.length + 4;
  });

  doc.setFont(undefined, 'italic');
  doc.text('Document généré automatiquement depuis votre espace EcoDeli.', 20, y + 6);

  const signatureSectionTop = y + 30;
  doc.setFont('helvetica', 'bold');
  doc.text('Signature commerçant', 20, signatureSectionTop);
  doc.setDrawColor(120, 120, 120);
  doc.line(20, signatureSectionTop + 18, 90, signatureSectionTop + 18);
  doc.setFont('courier', 'italic');
  doc.setFontSize(14);
  doc.text('J. Exemple', 22, signatureSectionTop + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  const sanitizedLabel = document.label.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
  doc.save(`contrat-${contract.id}-${sanitizedLabel}.pdf`);
};
