export interface Visit {
  visitId: number;
  visitDate: string;
  salesExecutiveId: number;
  customerId: number;
  visitType: 'New Visit' | 'Follow-up Visit';
  purpose?: 'Order discussion' | 'Payment' | 'New lead' | 'Complaint' | 'Promotion'; // Optional/Legacy
  leadStatus?: string;
  notes: string;
  isNextVisitRequired: boolean;
  nextVisitDate?: string;
  createdAt?: string;
  updatedAt?: string;

  // Relations
  customer?: {
    companyName: string;
    contactPerson: string;
  };
  salesExecutive?: {
    firstName: string;
    lastName: string;
  };
}

export interface CreateVisitDTO {
  visitDate: string;
  customerId: number;
  visitType: string;
  purpose?: string;
  leadStatus?: string;
  notes: string;
  isNextVisitRequired: boolean;
  nextVisitDate?: string;
}
