import type { User } from '../index';

export interface CreateUserRequest {
    adSoyad: string;
    sicil: string;
    unvan?: string;
    sifre?: string;
    birimId?: number;
    roleId?: number;
}

export interface UpdateUserRequest {
    adSoyad?: string;
    unvan?: string;
    isActive?: boolean;
}

export interface UserDto extends User {
    unvan?: string;
    lastLoginAt?: string;
}
