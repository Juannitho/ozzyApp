# Jest Testing Guide for Supabase Authentication

## Overview
This guide explains how to test login and signup functionality with Supabase using Jest. Since you're new to Jest, I'll explain everything step by step.

## What is Jest?
Jest is a JavaScript testing framework that helps you:
- Test your code automatically
- Find bugs before users do
- Ensure your app works as expected
- Mock external services (like Supabase) for reliable tests

## Setup Complete ✅
I've already set up Jest in your project with the following files:

### Configuration Files:
- `jest.config.js` - Jest configuration
- `jest-setup.js` - Test environment setup
- `package.json` - Added test scripts

### Test Scripts Available:
```bash
npm test              # Run all tests once
npm run test:watch    # Run tests and watch for changes
npm run test:coverage # Run tests with coverage report
npm run test:auth     # Run only authentication tests
```

## Test Files Structure

```
__tests__/
└── auth/
    ├── simple.test.ts      # Beginner-friendly examples (WORKING)
    ├── signup.test.ts      # Advanced signup tests
    ├── login.test.ts       # Advanced login tests
    └── integration.test.ts # Full flow tests
```

## Understanding Jest Tests

### 1. Basic Test Structure

```javascript
describe('What you are testing', () => {
  it('should do something specific', () => {
    // Arrange: Set up test data
    const input = 'test data';
    
    // Act: Execute the code
    const result = someFunction(input);
    
    // Assert: Check the result
    expect(result).toBe('expected output');
  });
});
```

### 2. Key Jest Concepts

**`describe()`**: Groups related tests together
```javascript
describe('User Authentication', () => {
  // All authentication tests go here
});
```

**`it()` or `test()`**: Defines a single test
```javascript
it('should validate email correctly', () => {
  // Test logic here
});
```

**`expect()`**: Makes assertions about your code
```javascript
expect(result).toBe(expectedValue);
expect(result).toBeNull();
expect(result).toBeDefined();
expect(array).toContain(item);
```

**`beforeEach()`**: Runs before each test
```javascript
beforeEach(() => {
  // Reset mocks, clean up data
  jest.clearAllMocks();
});
```

### 3. Mocking with Jest

Mocking means creating fake versions of external services (like Supabase) that you control in tests.

**Why Mock?**
- Tests run faster
- Don't depend on external services
- Can test error scenarios easily
- Tests are more reliable

**Example Mock:**
```javascript
const mockSignUp = jest.fn();

// Tell the mock what to return
mockSignUp.mockResolvedValueOnce({
  data: { user: { id: '123' } },
  error: null
});

// Use the mock
const result = await mockSignUp(userData);

// Check it was called
expect(mockSignUp).toHaveBeenCalledWith(userData);
```

## Running Your First Test

1. **Run the simple test:**
```bash
npm test simple.test.ts
```

2. **You should see output like:**
```
PASS __tests__/auth/simple.test.ts
✓ Form Validation › should validate a complete, valid signup form
✓ Form Validation › should reject invalid email addresses
✓ Supabase Authentication Mocking › should simulate successful user signup
```

## Test Examples in Your Project

### 1. Form Validation Test
Tests that your form validation works correctly:

```javascript
it('should validate valid signup data', () => {
  const validData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123!',
    school: 'University',
    phoneNumber: '0412345678'
  };

  const result = validateCompleteForm(validData);
  expect(result.success).toBe(true);
});
```

### 2. Mocked Supabase Signup Test
Tests signup without actually calling Supabase:

```javascript
it('should successfully sign up a new user', async () => {
  // Arrange: Set up mock response
  const mockResponse = {
    data: { user: { id: '123', email: 'test@example.com' } },
    error: null
  };
  mockSignUp.mockResolvedValueOnce(mockResponse);

  // Act: Call the mocked function
  const result = await mockSignUp({ email: 'test@example.com', password: 'pass' });

  // Assert: Check the results
  expect(result.error).toBeNull();
  expect(result.data.user.email).toBe('test@example.com');
});
```

## What Each Test File Does

### `simple.test.ts` ✅ (Working)
- Basic form validation tests
- Simple mock examples
- Good for learning Jest concepts

### `signup.test.ts` (Advanced)
- Comprehensive signup testing
- Error handling scenarios
- Real Supabase response structures

### `login.test.ts` (Advanced)
- Login functionality testing
- Session management
- Error scenarios

### `integration.test.ts` (Advanced)
- Full user journey tests
- Multiple step processes
- End-to-end scenarios

## Common Jest Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (reruns when files change)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test simple.test.ts

# Run tests matching a pattern
npm test auth

# Verbose output (shows all test names)
npm test -- --verbose
```

## Understanding Test Output

**Green ✓**: Test passed
**Red ✗**: Test failed

**Example output:**
```
PASS __tests__/auth/simple.test.ts
  Form Validation
    ✓ should validate a complete, valid signup form (3ms)
    ✓ should reject invalid email addresses (1ms)
  Supabase Authentication Mocking
    ✓ should simulate successful user signup (2ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

## Next Steps

1. **Start with the simple test:**
   ```bash
   npm test simple.test.ts
   ```

2. **Understand the output and code**

3. **Try modifying a test** - change an expected value and see it fail

4. **Add your own test** - copy an existing test and modify it

5. **Gradually work up to the advanced tests**

## Troubleshooting

**"Cannot find module" errors:**
- Check that file paths are correct
- Ensure imports use the `@/` alias correctly

**Mock errors:**
- Make sure mocks are cleared between tests with `jest.clearAllMocks()`
- Check that mock functions are properly typed

**TypeScript errors:**
- The simple test avoids complex typing issues
- Advanced tests may need type adjustments

## Benefits of Testing

✅ **Catch bugs early** - Before users find them
✅ **Confidence** - Know your code works
✅ **Documentation** - Tests show how code should work
✅ **Refactoring safety** - Change code without breaking functionality
✅ **Team collaboration** - Others understand your code's expectations

## Ready to Start?

Run your first test:
```bash
npm test simple.test.ts
```

Then explore the test file at `__tests__/auth/simple.test.ts` to understand how it works!