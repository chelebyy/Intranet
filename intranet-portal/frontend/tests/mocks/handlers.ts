import { http, HttpResponse } from 'msw';
import { mockLoginResponse, mockUser } from './fixtures/auth';

export const handlers = [
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      success: true,
      data: mockLoginResponse,
    });
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json({
      success: true,
      data: mockUser,
    });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'healthy' });
  }),
];
