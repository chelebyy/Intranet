export enum Page {
  DASHBOARD = 'DASHBOARD',
  USER_LIST = 'USER_LIST',
  USER_CREATE = 'USER_CREATE',
  DEPARTMENT_LIST = 'DEPARTMENT_LIST',
  DEPARTMENT_CREATE = 'DEPARTMENT_CREATE',
  ROLES_PERMISSIONS = 'ROLES_PERMISSIONS',
  REPORTS = 'REPORTS'
}

export interface User {
  id: number;
  name: string;
  sicil: string;
  department: string;
  role: string;
  status: 'Active' | 'Passive';
}

export interface Department {
  id: number;
  name: string;
  manager: string;
  userCount: number;
  status: 'Active' | 'Passive';
}