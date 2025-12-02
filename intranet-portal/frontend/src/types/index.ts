// Auth Types
export interface LoginCredentials {
  sicil: string;
  password: string;
  rememberMe?: boolean;
}

export interface User {
  id: number;
  sicil: string;
  ad: string;
  soyad: string;
  unvan?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Birim {
  id: number;
  birimAdi: string;
  aciklama?: string;
  isActive: boolean;
}

export interface UserBirimRole {
  birimId: number;
  birimAdi: string;
  roleId: number;
  roleName: string;
}

export interface SelectedBirimInfo {
  birimId: number;
  birimAdi: string;
}

export interface SelectedRoleInfo {
  roleId: number;
  roleName: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  birimleri: UserBirimRole[];
  selectedBirim: UserBirimRole | null;
  currentBirimInfo: SelectedBirimInfo | null;
  currentRoleInfo: SelectedRoleInfo | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  selectBirim: (birim: UserBirimRole) => void;
  setSelectedBirimRole: (birim: SelectedBirimInfo, role: SelectedRoleInfo) => void;
  logout: () => void;
}

// Admin Panel Types
export interface AdminUser {
  id: number;
  sicil: string;
  ad: string;
  soyad: string;
  isActive: boolean;
  birimleri: UserBirimRole[];
}

export interface Department {
  id: number;
  birimAdi: string;
  aciklama?: string;
  isActive: boolean;
  userCount: number;
}

export interface Role {
  id: number;
  roleName: string;
  aciklama?: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  permissionName: string;
  aciklama?: string;
  resource: string;
  action: string;
}

// Page Navigation
export const Page = {
  DASHBOARD: 'DASHBOARD',
  USER_LIST: 'USER_LIST',
  USER_CREATE: 'USER_CREATE',
  DEPARTMENT_LIST: 'DEPARTMENT_LIST',
  DEPARTMENT_CREATE: 'DEPARTMENT_CREATE',
  ROLES_PERMISSIONS: 'ROLES_PERMISSIONS',
  REPORTS: 'REPORTS',
  AUDIT_LOG: 'AUDIT_LOG',
  IP_RESTRICTIONS: 'IP_RESTRICTIONS',
  PROFILE: 'PROFILE',
  DEFINITIONS: 'DEFINITIONS',
  UNVAN_LIST: 'UNVAN_LIST',
  BIRIM_DEFINITIONS: 'BIRIM_DEFINITIONS'
} as const;

export type Page = typeof Page[keyof typeof Page];

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: string[];
  };
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalBirimler: number;
  activeBirimler: number;
  totalRoles: number;
  birimUserCounts: BirimUserCount[];
  recentActivities: RecentActivity[];
}

export interface BirimUserCount {
  birimId: number;
  birimAdi: string;
  userCount: number;
}

export interface RecentActivity {
  id: number;
  action: string;
  userFullName: string | null;
  details: string | null;
  timestamp: string;
  timeAgo: string;
  iconName: string;
}
