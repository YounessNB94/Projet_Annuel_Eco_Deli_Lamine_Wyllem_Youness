import type { Announcement } from '../api/clientAnnouncements';
import type { AnnouncementFormValues, AnnouncementType } from '../types/announcementForm';

const normalizeKey = (value: string) => value.trim().toLowerCase();

const DISPLAY_LABEL_BY_TYPE: Record<AnnouncementType, string> = {
  DOCUMENT: 'Document',
  SMALL: 'Petite livraison',
  MEDIUM: 'Livraison moyenne',
  LARGE: 'Grande livraison',
  PALLET: 'Palette',
};

const DISPLAY_TO_FORM_TYPE: Record<string, AnnouncementType> = {
  document: 'DOCUMENT',
  'petite livraison': 'SMALL',
  'livraison moyenne': 'MEDIUM',
  'grande livraison': 'LARGE',
  palette: 'PALLET',
};

const mapDisplayTypeToFormType = (value: string | undefined): AnnouncementType | '' => {
  if (!value) {
    return '';
  }
  const normalized = normalizeKey(value);
  return DISPLAY_TO_FORM_TYPE[normalized] ?? '';
};

export const mapFormTypeToDisplayLabel = (value: AnnouncementType | ''): string => {
  if (!value) {
    return '';
  }
  return DISPLAY_LABEL_BY_TYPE[value] ?? value;
};

export const announcementToFormValues = (announcement: Announcement): AnnouncementFormValues => ({
  type: mapDisplayTypeToFormType(announcement.type),
  fromAddress: announcement.origin,
  toAddress: announcement.destination,
  pickupDate: announcement.createdAt ?? '',
  pickupTimeStart: '',
  pickupTimeEnd: '',
  deliveryDate: announcement.dueDate ?? '',
  deliveryTimeStart: '',
  deliveryTimeEnd: '',
  budget: Number.isFinite(announcement.budget)
    ? announcement.budget.toString()
    : '',
  description: '',
});

export const applyFormValuesToAnnouncement = (
  announcement: Announcement,
  values: AnnouncementFormValues,
): Announcement => ({
  ...announcement,
  type: mapFormTypeToDisplayLabel(values.type) || announcement.type,
  origin: values.fromAddress,
  destination: values.toAddress,
  dueDate: values.deliveryDate || announcement.dueDate,
  budget: Number.isFinite(Number(values.budget)) ? Number(values.budget) : announcement.budget,
});
