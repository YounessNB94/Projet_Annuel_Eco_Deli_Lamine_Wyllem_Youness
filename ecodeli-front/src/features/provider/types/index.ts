import type React from 'react';

export type ProviderAssignmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type ProviderDocumentStatus =
  | 'MISSING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED';

export type ProviderInvoiceStatus = 'DUE' | 'PAID' | 'PROCESSING';

export type ProviderValidationStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export type ProviderStatusToken =
  | ProviderAssignmentStatus
  | ProviderDocumentStatus
  | ProviderInvoiceStatus
  | ProviderValidationStatus
  | 'AVAILABLE'
  | 'UNAVAILABLE'
  | 'READY_FOR_PAYOUT'
  | 'READY'
  | 'PAUSED';

export interface ProviderStat {
  label: string;
  value: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'flat';
    label?: string;
  };
  icon?: React.ReactNode;
}

export interface ProviderAssignment {
  id: string;
  title: string;
  clientName: string;
  scheduledAt: string;
  location: string;
  status: ProviderAssignmentStatus;
  payout: number;
}

export interface ProviderAssignmentDetail extends ProviderAssignment {
  description?: string;
  timeWindow?: {
    start: string;
    end: string;
  };
  contact?: {
    name: string;
    company?: string;
    phone: string;
    email?: string;
  };
  payload?: {
    type?: string;
    volume?: string;
    weight?: string;
  };
  requirements?: string[];
  notes?: string[];
}

export interface ProviderAvailabilitySlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'UNAVAILABLE';
}

export interface ProviderInvoice {
  id: string;
  period: string;
  amount: number;
  issuedAt: string;
  status: ProviderInvoiceStatus;
}

export interface ProviderDocument {
  id: string;
  label: string;
  lastUpdated: string;
  status: ProviderDocumentStatus;
}

export interface ProviderEvaluation {
  id: string;
  clientName: string;
  score: number;
  comment: string;
  completedAt: string;
}
