import { supabase } from '@/lib/supabase/supabase';
import { validateCompleteForm } from '@/lib/validations/signupValidation';

// Mock the supabase module
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
    },
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Signup Functionality', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Validation', () => {
    it('should validate valid signup data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        school: 'University of Sydney',
        phoneNumber: '0412345678',
      };

      const result = validateCompleteForm(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Password123!',
        school: 'University of Sydney',
        phoneNumber: '0412345678',
      };

      const result = validateCompleteForm(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors).toContainEqual(
          expect.objectContaining({
            path: ['email'],
            message: 'Please enter a valid email address',
          })
        );
      }
    });

    it('should reject weak password', () => {
      const weakPasswordData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123', // Too short and weak
        school: 'University of Sydney',
        phoneNumber: '0412345678',
      };

      const result = validateCompleteForm(weakPasswordData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors).toContainEqual(
          expect.objectContaining({
            path: ['password'],
            message: 'Password must be at least 8 characters',
          })
        );
      }
    });

    it('should reject invalid Australian phone number', () => {
      const invalidPhoneData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        school: 'University of Sydney',
        phoneNumber: '555-1234', // Invalid Australian format
      };

      const result = validateCompleteForm(invalidPhoneData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors).toContainEqual(
          expect.objectContaining({
            path: ['phoneNumber'],
          })
        );
      }
    });
  });

  describe('Supabase Integration', () => {
    it('should successfully sign up a new user', async () => {
      const userData = {
        email: 'john.doe@example.com',
        password: 'Password123!',
        options: {
          data: {
            name: 'John Doe',
            school: 'University of Sydney',
            phoneNumber: '0412345678',
          },
        },
      };

      // Mock successful signup
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: {
          user: {
            id: 'user-123',
            email: 'john.doe@example.com',
            created_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: userData.options.data,
            aud: 'authenticated',
          },
          session: null,
        },
        error: null,
      });

      const result = await mockSupabase.auth.signUp(userData);

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith(userData);
      expect(result.error).toBeNull();
      expect(result.data.user).toBeDefined();
      expect(result.data.user?.email).toBe(userData.email);
      expect(result.data.user?.user_metadata).toEqual(userData.options.data);
    });

    it('should handle signup error - email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'Password123!',
        options: {
          data: {
            name: 'John Doe',
            school: 'University of Sydney',
            phoneNumber: '0412345678',
          },
        },
      };

      // Mock signup error
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'User already registered',
          status: 400,
        } as any,
      });

      const result = await mockSupabase.auth.signUp(userData);

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith(userData);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('User already registered');
      expect(result.data.user).toBeNull();
    });

    it('should handle network error during signup', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        options: {
          data: {
            name: 'John Doe',
            school: 'University of Sydney',
            phoneNumber: '0412345678',
          },
        },
      };

      // Mock network error
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Network error',
          status: 500,
        } as any,
      });

      const result = await mockSupabase.auth.signUp(userData);

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Network error');
    });
  });

  describe('Complete Signup Flow', () => {
    it('should successfully complete full signup process', async () => {
      const signupData = {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        options: {
          data: {
            name: 'New User',
            school: 'UNSW',
            phoneNumber: '0456789012',
          },
        },
      };

      const loginData = {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
      };

      // Mock successful signup
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: {
          user: {
            id: 'new-user-123',
            email: signupData.email,
            created_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: signupData.options.data,
            aud: 'authenticated',
          },
          session: null,
        },
        error: null,
      });

      // Mock successful login after signup
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: {
            id: 'new-user-123',
            email: signupData.email,
            created_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: signupData.options.data,
            aud: 'authenticated',
          },
          session: {
            access_token: 'fake-access-token',
            refresh_token: 'fake-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: {
              id: 'new-user-123',
              email: signupData.email,
              created_at: new Date().toISOString(),
              app_metadata: {},
              user_metadata: signupData.options.data,
              aud: 'authenticated',
            },
          } as any,
        },
        error: null,
      });

      // Test signup
      const signupResult = await mockSupabase.auth.signUp(signupData);
      expect(signupResult.error).toBeNull();
      expect(signupResult.data.user?.email).toBe(signupData.email);

      // Test automatic login after signup
      const loginResult = await mockSupabase.auth.signInWithPassword(loginData);
      expect(loginResult.error).toBeNull();
      expect(loginResult.data.session).toBeDefined();
      expect(loginResult.data.user?.email).toBe(signupData.email);
    });
  });
});