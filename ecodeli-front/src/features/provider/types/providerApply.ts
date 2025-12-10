import type { ChangeEvent } from "react";

export interface ProviderApplyFormValues {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  city: string;
  companyCity: string;
  postalCode: string;
  companyName: string;
  siret: string;
  legalStatus: string;
  serviceCategory: string;
  transportMode: string;
  experienceYears: string;
  hourlyRate: string;
  serviceArea: string;
  availabilityNotes: string;
  equipment: string;
  services: string;
  weeklyCapacity: string;
  consent: boolean;
}

export interface ProviderDocumentField {
  key: string;
  label: string;
}

export type ProviderApplyFieldChangeHandler = (
  field: keyof ProviderApplyFormValues
) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

export type ProviderApplyNumericChangeHandler = (
  field: keyof ProviderApplyFormValues,
  options?: { allowDecimal?: boolean }
) => (event: ChangeEvent<HTMLInputElement>) => void;

export type ProviderApplyDocumentChangeHandler = (
  key: string
) => (event: ChangeEvent<HTMLInputElement>) => void;
