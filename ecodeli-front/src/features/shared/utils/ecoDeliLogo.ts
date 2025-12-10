import type jsPDF from 'jspdf';

import ecoDeliLogoUrl from '../../../assets/EcoDeli-Logo.svg?url';

let logoDataUrlPromise: Promise<string> | null = null;

const loadLogoAsPngDataUrl = () =>
  new Promise<string>((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('EcoDeli logo requires a browser context.'));
      return;
    }

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Unable to acquire a 2D canvas context for the EcoDeli logo.'));
        return;
      }

      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = () => reject(new Error('Failed to load EcoDeli logo asset.'));
    image.src = ecoDeliLogoUrl;
  });

export const getEcoDeliLogoDataUrl = () => {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = loadLogoAsPngDataUrl();
  }

  return logoDataUrlPromise;
};

export interface DrawEcoDeliLogoOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fallbackText?: string;
  fallbackColor?: [number, number, number];
  font?: string;
}

export const drawEcoDeliLogo = async (
  pdf: jsPDF,
  {
    x = 20,
    y = 14,
    width = 24,
    height = 24,
    fallbackText = 'EcoDeli',
    fallbackColor = [47, 127, 51],
    font = 'helvetica',
  }: DrawEcoDeliLogoOptions = {},
) => {
  try {
    const dataUrl = await getEcoDeliLogoDataUrl();
    pdf.addImage(dataUrl, 'PNG', x, y, width, height);
  } catch (_error) {
    pdf.setFont(font, 'bold');
    pdf.setTextColor(...fallbackColor);
    pdf.text(fallbackText, x, y + height - 6);
  }

  pdf.setTextColor(0, 0, 0);
  pdf.setFont(font, 'normal');

  return y + height;
};
