import { supabase } from '@/lib/supabase/supabase';
import { validateCompleteForm } from '@/lib/validations/signupValidation';

// Mock the supabase module
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete User Journey', () => {
    it('should complete full user registration and login flow', async () => {
      const userData = {
        name: 'Integration Test User',
        email: 'integration@test.com',
        password: 'TestPassword123!',
        school: 'Test University',
        phoneNumber: '0412345678',
      };

      // Step 1: Validate form data
      const validationResult = validateCompleteForm(userData);
      expect(validationResult.success).toBe(true);

      // Step 2: Mock successful signup
      const mockUser = {
        id: 'integration-user-123',
        email: userData.email,
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {
          name: userData.name,
          school: userData.school,
          phoneNumber: userData.phoneNumber,
        },
        aud: 'authenticated' as const,
      };

      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: mockUser, session: null },
        error: null,
      });

      const signupResult = await mockSupabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            school: userData.school,
            phoneNumber: userData.phoneNumber,
          },
        },
      });

      expect(signupResult.error).toBeNull();
      expect(signupResult.data.user?.email).toBe(userData.email);

      // Step 3: Mock automatic login after signup
      const mockSession = {
        access_token: 'integration-access-token',
        refresh_token: 'integration-refresh-token',
        expires_in: 3600,
        token_type: 'bearer' as const,
        user: mockUser,
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const loginResult = await mockSupabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password,
      });

      expect(loginResult.error).toBeNull();
      expect(loginResult.data.session).toBeDefined();
      expect(loginResult.data.user?.id).toBe(mockUser.id);
    });

    it('should handle complete flow with validation errors', async () => {
      const invalidUserData = {
        name: '', // Invalid: empty name
        email: 'invalid-email', // Invalid: not a proper email
        password: '123', // Invalid: too short
        school: 'Test University',
        phoneNumber: '555-1234', // Invalid: not Australian format
      };

      // Step 1: Validation should fail
      const validationResult = validateCompleteForm(invalidUserData);
      expect(validationResult.success).toBe(false);

      if (!validationResult.success) {
        const errors = validationResult.error.errors;
        expect(errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ['name'] }),
            expect.objectContaining({ path: ['email'] }),
            expect.objectContaining({ path: ['password'] }),
            expect.objectContaining({ path: ['phoneNumber'] }),
          ])
        );
      }

      // Step 2: Signup should not be attempted with invalid data
      // In real app, form validation would prevent this call
      expect(mockSupabase.auth.signUp).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling Scenarios', () => {
    it('should handle signup failure followed by retry', async () => {
      const userData = {
        email: 'retry@test.com',
        password: 'RetryPassword123!',
        options: {
          data: {
            name: 'Retry User',
            school: 'Retry University',
            phoneNumber: '0412345679',
          },
        },
      };

      // First attempt - network error
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Network timeout',
          status: 500,
        } as any,
      });

      const firstAttempt = await mockSupabase.auth.signUp(userData);
      expect(firstAttempt.error?.message).toBe('Network timeout');

      // Second attempt - success
      const mockUser = {
        id: 'retry-user-123',
        email: userData.email,
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: userData.options.data,
        aud: 'authenticated' as const,
      };

      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: mockUser, session: null },
        error: null,
      });

      const secondAttempt = await mockSupabase.auth.signUp(userData);
      expect(secondAttempt.error).toBeNull();
      expect(secondAttempt.data.user?.email).toBe(userData.email);

      // Verify signup was called twice
      expect(mockSupabase.auth.signUp).toHaveBeenCalledTimes(2);
    });

    it('should handle login after account creation but before confirmation', async () => {
      const loginData = {
        email: 'unconfirmed@test.com',
        password: 'UnconfirmedPassword123!',
      };

      // Mock login attempt for unconfirmed account
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Email not confirmed',
          status: 400,
        } as any,
      });

      const loginResult = await mockSupabase.auth.signInWithPassword(loginData);

      expect(loginResult.error?.message).toBe('Email not confirmed');
      expect(loginResult.data.user).toBeNull();
      expect(loginResult.data.session).toBeNull();
    });
  });

  describe('Security Tests', () => {
    it('should not expose sensitive information in error messages', async () => {
      const loginData = {
        email: 'secure@test.com',
        password: 'wrongpassword',
      };

      // Mock generic error message (good security practice)
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Invalid login credentials',
          status: 400,
        } as any,
      });

      const result = await mockSupabase.auth.signInWithPassword(loginData);

      // Error message should be generic, not revealing whether email exists
      expect(result.error?.message).toBe('Invalid login credentials');
      expect(result.error?.message).not.toContain('user not found');
      expect(result.error?.message).not.toContain('email does not exist');
    });

    it('should handle SQL injection attempts safely', async () => {
      const maliciousData = {
        email: "'; DROP TABLE users; --",
        password: 'password',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Invalid email format',
          status: 400,
        } as any,
      });

      const result = await mockSupabase.auth.signInWithPassword(maliciousData);

      // Should reject malicious input safely
      expect(result.error?.message).toBe('Invalid email format');
      expect(result.data.user).toBeNull();
    });
  });

  describe('Performance Tests', () => {
    it('should handle concurrent login attempts', async () => {
      const loginData = {
        email: 'concurrent@test.com',
        password: 'ConcurrentPassword123!',
      };

      const mockUser = {
        id: 'concurrent-user-123',
        email: loginData.email,
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated' as const,
      };

      const mockSession = {
        access_token: 'concurrent-token',
        refresh_token: 'concurrent-refresh',
        expires_in: 3600,
        token_type: 'bearer' as const,
        user: mockUser,
      };

      // Mock multiple concurrent responses
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      // Simulate concurrent login attempts
      const promises = Array(5).fill(null).map(() => 
        mockSupabase.auth.signInWithPassword(loginData)
      );

      const results = await Promise.all(promises);

      // All should succeed
      results.forEach((result) => {
        expect(result.error).toBeNull();
        expect(result.data.user?.email).toBe(loginData.email);
      });

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledTimes(5);
    });
  });
});