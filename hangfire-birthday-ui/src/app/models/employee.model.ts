export interface Employee {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string;   // ISO date string
  joiningDate: string;   // ISO date string
  department: string;
  isActive: boolean;
}

export interface EmployeeStats {
  totalEmployees: number;
  birthdaysToday: number;
  anniversariesToday: number;
}

export type EmployeeForm = Omit<Employee, 'id'>;
