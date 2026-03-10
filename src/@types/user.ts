export interface User {
  id: number;
  nom: string;
  email: string;
  email_verification: boolean;
  role: string;
  role_id?: number;    
  wilaya_id?: number;
  permissions: string[];
  wilaya: string;
  date_creation: string;
}