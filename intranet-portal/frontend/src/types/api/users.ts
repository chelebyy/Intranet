import type { User } from '../index';

export interface CreateUserRequest {
    ad: string;
    soyad: string;
    sicil: string;
    unvan?: string;
    sifre?: string;
}

export interface UpdateUserRequest {
    ad?: string;
    soyad?: string;
    sicil?: string;
    unvan?: string;
    isActive?: boolean;
}

export interface UserBirimRoleDto {
    birimID: number;
    birimAdi: string;
    roleID: number;
    roleName: string;
}

export interface UserDto extends User {
    userID: number;
    lastLoginAt?: string;
    birimRoles?: UserBirimRoleDto[];
}
