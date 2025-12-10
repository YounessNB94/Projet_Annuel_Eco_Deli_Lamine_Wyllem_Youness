interface DownloadCourierDocumentOptions {
  courierId: string;
  courierName: string;
  documentTitle: string;
  fileName: string;
  metadata?: Array<{ label: string; value: string }>;
}


export const downloadCourierDocument = ({
  courierId,
  courierName,
  documentTitle,
  fileName,
  metadata = [],
}: DownloadCourierDocumentOptions) => {
  const timestamp = new Date().toLocaleString('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const sanitizedFileName = fileName.includes('.') ? fileName : `${fileName}.txt`;
  const lines = [
    `EcoDeli - Export document`,
    `Dossier: ${courierId}`,
    `Livreur: ${courierName}`,
    `Document: ${documentTitle}`,
    ...metadata.map((entry) => `${entry.label}: ${entry.value}`),
    `Généré le: ${timestamp}`,
  ];

  const blob = new Blob([lines.join('\n')], {
    type: 'text/plain;charset=utf-8',
  });
  const fileUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = fileUrl;
  anchor.download = sanitizedFileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(fileUrl);
};
