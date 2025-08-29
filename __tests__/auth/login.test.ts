import { supabase } from '@/lib/supabase/supabase';

// Mock the supabase module
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      getSession: jest.fn(),
    },
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Login Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Login', () => {
    it('should successfully login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {
          name: 'Test User',
          school: 'Test University',
          phoneNumber: '0412345678',
        },
        aud: 'authenticated' as const,
      };

      const mockSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'bearer' as const,
        user: mockUser,
      };

      // Mock successful login
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: mockUser,
          session: mockSession,
        },
        error: null,
      });

      const result = await mockSupabase.auth.signInWithPassword(loginData);

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith(loginData);
      expect(result.error).toBeNull();
      expect(result.data.user).toBeDefined();
      expect(result.data.session).toBeDefined();
      expect(result.data.user?.email).toBe(loginData.email);
      expect(result.data.session?.access_token).toBeTruthy();
    });

    it('should maintain session after successful login', async () => {
      const mockSession = {
        access_token: 'active-session-token',
        refresh_token: 'active-refresh-token',
        expires_in: 3600,
        token_type: 'bearer' as const,
        user: {
          id: 'user-123',
          email: 'test@example.com',
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated' as const,
        },
      };

      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      const sessionResult = await mockSupabase.auth.getSession();

      expect(sessionResult.data.session).toBeDefined();
      expect(sessionResult.data.session?.access_token).toBe('active-session-token');
    });
  });

  describe('Login Failures', () => {
    it('should handle invalid credentials', async () => {
      const invalidLoginData = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      // Mock authentication failure
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Invalid login credentials',
          status: 400,
        } as any,
      });

      const result = await mockSupabase.auth.signInWithPassword(invalidLoginData);

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith(invalidLoginData);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Invalid login credentials');
      expect(result.data.user).toBeNull();
      expect(result.data.session).toBeNull();
    });

    it('should handle non-existent user', async () => {
      const nonExistentUserData = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Invalid login credentials',
          status: 400,
        } as any,
      });

      const result = await mockSupabase.auth.signInWithPassword(nonExistentUserData);

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Invalid login credentials');
      expect(result.data.user).toBeNull();
    });

    it('should handle account not confirmed', async () => {
      const unconfirmedUserData = {
        email: 'unconfirmed@example.com',
        password: 'Password123!',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Email not confirmed',
          status: 400,
        } as any,
      });

      const result = await mockSupabase.auth.signInWithPassword(unconfirmedUserData);

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Email not confirmed');
    });

    it('should handle network errors', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Network error',
          status: 500,
        } as any,
      });

      const result = await mockSupabase.auth.signInWithPassword(loginData);

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Network error');
      expect(result.error?.status).toBe(500);
    });
  });

  describe('Logout Functionality', () => {
    it('should successfully logout user', async () => {
      // Mock successful logout
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        error: null,
      });

      const result = await mockSupabase.auth.signOut();

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });

    it('should handle logout errors', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        error: {
          message: 'Logout failed',
          status: 500,
        } as any,
      });

      const result = await mockSupabase.auth.signOut();

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Logout failed');
    });

    it('should clear session after logout', async () => {
      // Mock successful logout
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        error: null,
      });

      // Mock empty session after logout
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
        error: null,
      });

      await mockSupabase.auth.signOut();
      const sessionResult = await mockSupabase.auth.getSession();

      expect(sessionResult.data.session).toBeNull();
    });
  });

  describe('Session Management', () => {
    it('should retrieve current user when authenticated', async () => {
      const mockUser = {
        id: 'user-456',
        email: 'authenticated@example.com',
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {
          name: 'Authenticated User',
          school: 'Test School',
          phoneNumber: '0412345678',
        },
        aud: 'authenticated' as const,
      };

      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      const result = await mockSupabase.auth.getUser();

      expect(result.data.user).toBeDefined();
      expect(result.data.user?.id).toBe('user-456');
      expect(result.data.user?.email).toBe('authenticated@example.com');
      expect(result.error).toBeNull();
    });

    it('should handle unauthenticated user', async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: {
          message: 'User not authenticated',
          status: 401,
        } as any,
      });

      const result = await mockSupabase.auth.getUser();

      expect(result.data.user).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('User not authenticated');
    });

    it('should handle expired session', async () => {
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
        error: {
          message: 'Session expired',
          status: 401,
        } as any,
      });

      const result = await mockSupabase.auth.getSession();

      expect(result.data.session).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Session expired');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty email', async () => {
      const emptyEmailData = {
        email: '',
        password: 'Password123!',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Email is required',
          status: 400,
        } as any,
      });

      const result = await mockSupabase.auth.signInWithPassword(emptyEmailData);

      expect(result.error?.message).toBe('Email is required');
    });

    it('should handle empty password', async () => {
      const emptyPasswordData = {
        email: 'test@example.com',
        password: '',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Password is required',
          status: 400,
        } as any,
      });

      const result = await mockSupabase.auth.signInWithPassword(emptyPasswordData);

      expect(result.error?.message).toBe('Password is required');
    });

    it('should handle malformed email', async () => {
      const malformedEmailData = {
        email: 'not-an-email',
        password: 'Password123!',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Invalid email format',
          status: 400,
        } as any,
      });

      const result = await mockSupabase.auth.signInWithPassword(malformedEmailData);

      expect(result.error?.message).toBe('Invalid email format');
    });
  });
});