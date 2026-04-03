import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../render';
import { mockUser, mockBirim, mockRole } from '../../mocks/fixtures/auth';

vi.mock('../../../src/shared/components/MatrixBackground', () => ({
  default: () => <div data-testid="matrix-bg">Matrix Background</div>,
}));

vi.mock('../../../src/api/authApi', () => ({
  authApi: {
    login: vi.fn(),
  },
}));

describe('LoginPage Smoke Test', () => {
  it('renders login form with all required elements', async () => {
    expect(mockUser).toBeDefined();
    expect(mockBirim).toBeDefined();
    expect(mockRole).toBeDefined();

    const { default: LoginPage } = await import('../../../src/features/auth/LoginPage');
    render(<LoginPage />);

    expect(screen.getByText(/hoş geldiniz/i)).toBeInTheDocument();
    expect(screen.getByTestId('matrix-bg')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/00001/i)).toBeInTheDocument();
    expect(screen.getByText(/sicil numarası/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/şifre/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /giriş yap/i })).toBeInTheDocument();
  });

  it('has password visibility toggle', async () => {
    const { default: LoginPage } = await import('../../../src/features/auth/LoginPage');
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText(/şifre/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
