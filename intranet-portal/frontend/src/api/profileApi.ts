import apiClient from './apiClient';

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const profileApi = {
    changePassword: async (dto: ChangePasswordDto): Promise<void> => {
        await apiClient.post('/auth/change-password', dto);
    }
};
