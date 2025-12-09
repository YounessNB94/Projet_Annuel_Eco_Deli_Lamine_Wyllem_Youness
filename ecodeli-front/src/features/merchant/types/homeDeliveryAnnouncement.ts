export const MERCHANT_HOME_DELIVERY_TYPE = 'MERCHANT_HOME_DELIVERY' as const;

export type MerchantHomeDeliveryServiceLevel = 'STANDARD' | 'EXPRESS';

export interface MerchantHomeDeliveryFormValues {
  serviceType: typeof MERCHANT_HOME_DELIVERY_TYPE;
  serviceLevel: MerchantHomeDeliveryServiceLevel;
  campaignName: string;
  reference: string;
  pickupAddress: string;
  pickupCity: string;
  pickupPostalCode: string;
  pickupDate: string;
  pickupTimeStart: string;
  pickupTimeEnd: string;
  deliveryDate: string;
  deliveryTimeStart: string;
  deliveryTimeEnd: string;
  deliveryCity: string;
  deliveryRadiusKm: string;
  packagesCount: string;
  averageWeight: string;
  budget: string;
  instructions: string;
  notificationMessage: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  allowPartialDeliveries: boolean;
  requiresSignature: boolean;
  temperatureControlled: boolean;
}

export type MerchantHomeDeliveryFormErrors = Partial<
  Record<keyof MerchantHomeDeliveryFormValues, string>
>;
