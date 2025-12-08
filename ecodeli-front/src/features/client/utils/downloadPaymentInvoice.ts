import jsPDF from 'jspdf';

export interface PaymentInvoicePayload {
  deliveryId: string;
  deliveryTitle: string;
  amount: number;
  serviceFee: number;
  total: number;
  transactionId: string;
  paymentDate: Date;
  cardholder: string;
}

const formatCurrency = (value: number) => `${value.toFixed(2)} €`;

export const downloadPaymentInvoice = ({
  deliveryId,
  deliveryTitle,
  amount,
  serviceFee,
  total,
  transactionId,
  paymentDate,
  cardholder,
}: PaymentInvoicePayload) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Facture EcoDeli', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Livraison #${deliveryId}`, 20, 32);
  doc.text(`Destinataire: ${cardholder}`, 20, 40);
  doc.text(`Date: ${paymentDate.toLocaleString('fr-FR')}`, 20, 48);

  doc.setDrawColor(200, 200, 200);
  doc.line(20, 54, 190, 54);

  doc.setFont(undefined, 'bold');
  doc.text('Details du paiement', 20, 64);
  doc.setFont(undefined, 'normal');

  const rows: Array<[string, string]> = [
    ['Numéro de transaction', transactionId],
    ['Livraison', deliveryTitle],
    ['Prix de la livraison', formatCurrency(amount)],
    ['Frais de service', formatCurrency(serviceFee)],
    ['Total', formatCurrency(total)],
  ];

  let y = 76;
  const valueWidth = 120;
  const lineSpacing = 6;

  rows.forEach(([label, value]) => {
    const valueLines = doc.splitTextToSize(value, valueWidth);
    doc.text(label, 20, y);

    valueLines.forEach((line, index) => {
      const lineY = y + index * lineSpacing;
      doc.text(line, 190, lineY, { align: 'right' });
    });

    y += lineSpacing * valueLines.length + 2;
  });

  doc.setFont(undefined, 'italic');
  doc.text('Merci pour votre confiance.', 20, y + 6);

  doc.save(`facture-${deliveryId}.pdf`);
};
