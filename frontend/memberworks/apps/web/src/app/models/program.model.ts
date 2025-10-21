export interface Program {
  id?: number;
  name: string;
  description?: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  assignedPersonIds?: number[];
}
