// Mock Supabase client for testing
export const mockSupabase = {
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    getUser: jest.fn(),
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  })),
};

// Mock the supabase module
jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));

export { mockSupabase as supabase };