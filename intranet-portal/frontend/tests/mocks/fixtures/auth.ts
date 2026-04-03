export const mockUser = {
  id: 1,
  sicil: '00001',
  ad: 'Test',
  soyad: 'User',
  unvan: 'Mühendis',
  isActive: true,
  createdAt: '2026-04-03T00:00:00.000Z',
};

export const mockBirim = {
  birimID: 1,
  birimAdi: 'Bilgi İşlem',
};

export const mockRole = {
  roleID: 2,
  roleName: 'Admin',
};

export const mockUserBirimRole = {
  birimId: 1,
  birimAdi: 'Bilgi İşlem',
  roleId: 2,
  roleName: 'Admin',
};

export const mockLoginResponse = {
  user: mockUser,
  birimler: [mockUserBirimRole],
  selectedBirim: mockBirim,
  selectedRole: mockRole,
  requiresBirimSelection: false,
};
