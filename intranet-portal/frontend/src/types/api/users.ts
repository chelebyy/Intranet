import type { User } from '../index';

export interface CreateUserRequest {
    ad: string;
    soyad: string;
    sicil: string;
    unvan?: string;
    sifre?: string;
    birimId?: number;
    roleId?: number;
}

export interface UpdateUserRequest {
    ad?: string;
    soyad?: string;
    sicil?: string;
    unvan?: string;
    isActive?: boolean;
}

export interface UserDto extends User {
    lastLoginAt?: string;
}
