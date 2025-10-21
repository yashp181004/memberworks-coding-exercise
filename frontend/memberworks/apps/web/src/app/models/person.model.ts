export type Role = 'Admin' | 'Member' | 'Coach';

export interface Person {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt?: string;
}
