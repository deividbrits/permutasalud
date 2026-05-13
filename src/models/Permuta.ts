export interface IPermuta {
  id?: string;
  userId: string;
  userName: string;
  userRole: string;
  userCategory: string;
  userLevel: number;
  actualCommune: string;
  desiredCommunes: string[];
  description?: string;
  status: 'active' | 'matched' | 'inactive';
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
