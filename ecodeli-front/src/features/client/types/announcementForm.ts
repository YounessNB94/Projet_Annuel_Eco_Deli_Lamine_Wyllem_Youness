export type AnnouncementType =
  | 'DOCUMENT'
  | 'SMALL'
  | 'MEDIUM'
  | 'LARGE'
  | 'PALLET';

export interface AnnouncementFormValues {
  [key: string]: string;
  type: AnnouncementType | '';
  fromAddress: string;
  toAddress: string;
  pickupDate: string;
  pickupTimeStart: string;
  pickupTimeEnd: string;
  deliveryDate: string;
  deliveryTimeStart: string;
  deliveryTimeEnd: string;
  budget: string;
  description: string;
}

export type AnnouncementFormErrors = Partial<
  Record<keyof AnnouncementFormValues, string>
>;
