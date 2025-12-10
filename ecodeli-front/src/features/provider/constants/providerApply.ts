import type {
  ProviderApplyFormValues,
  ProviderDocumentField,
} from "../types/providerApply";

export const PROVIDER_APPLY_INITIAL_VALUES: ProviderApplyFormValues = {
  fullName: "",
  email: "",
  phone: "",
  birthDate: "",
  address: "",
  city: "",
  companyCity: "",
  postalCode: "",
  companyName: "",
  siret: "",
  legalStatus: "",
  serviceCategory: "",
  transportMode: "",
  experienceYears: "",
  hourlyRate: "",
  serviceArea: "",
  availabilityNotes: "",
  equipment: "",
  services: "",
  weeklyCapacity: "",
  consent: false,
};

export const PROVIDER_SERVICE_CATEGORIES = [
  "Livraison urbaine",
  "Services à domicile",
  "Soins personnels",
  "Collecte et recyclage",
  "Support administratif",
];

export const PROVIDER_TRANSPORT_MODES = [
  "Vélo cargo",
  "Voiture",
  "Scooter",
  "Utilitaire",
  "A pied",
];

export const PROVIDER_LEGAL_STATUSES = [
  "Auto-entrepreneur",
  "SARL",
  "SASU",
  "Association",
  "Autre",
];

export const PROVIDER_DOCUMENT_FIELDS: ProviderDocumentField[] = [
  { key: "idProof", label: "Pièce d’identité (PDF ou photo)" },
  { key: "insurance", label: "Attestation d’assurance responsabilité civile" },
  { key: "kbis", label: "Kbis / Insee / SIREN" },
  { key: "certifications", label: "Certifications ou habilitations" },
];

export const PROVIDER_CITY_OPTIONS = [
  "Paris",
  "Marseille",
  "Lyon",
  "Toulouse",
  "Nice",
  "Nantes",
  "Montpellier",
  "Strasbourg",
  "Bordeaux",
  "Lille",
];
