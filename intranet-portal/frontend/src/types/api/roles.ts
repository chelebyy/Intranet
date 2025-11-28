export interface Role {
  roleID: number;
  roleName: string;
  description?: string;
}

export interface CreateRoleRequest {
  roleAdi: string;
  aciklama?: string;
}

export interface UpdateRoleRequest {
  roleAdi: string;
  aciklama?: string;
}

export interface Permission {
  permissionID: number;
  action: string;
  resource: string;
  description?: string;
  fullPermission: string;
}

export interface AssignPermissionsRequest {
  permissionIds: number[];
}
