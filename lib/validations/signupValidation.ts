import { z } from 'zod';

// Individual field validations for each step
export const nameValidation = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .trim()
});

export const emailValidation = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(254, 'Email must not exceed 254 characters')
    .toLowerCase()
    .trim()
});

export const passwordValidation = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$\.!%*?&])[A-Za-z\d@$\.!%*?&]/,
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    )
});

export const schoolValidation = z.object({
  school: z.string()
    .min(2, 'School name must be at least 2 characters')
    .max(100, 'School name must not exceed 100 characters')
    .trim()
});

export const phoneValidation = z.object({
  phoneNumber: z.string()
    .regex(
      /^(\+61\s?4|04)\d{8}$/,
      'Please enter a valid Australian mobile number (e.g., 0412345678 or +61 412345678)'
    )
    .refine((phone) => {
      // Remove spaces and normalize the format
      const cleaned = phone.replace(/\s/g, '');
      return cleaned.length === 10 || cleaned.length === 12;
    }, 'Australian mobile number must be 10 digits (04XXXXXXXX) or 12 digits with country code (+614XXXXXXXX)')
});



// Complete signup form validation
export const signupValidationSchema = z.object({
  name: nameValidation.shape.name,
  email: emailValidation.shape.email,
  password: passwordValidation.shape.password,
  school: schoolValidation.shape.school,
  phoneNumber: phoneValidation.shape.phoneNumber
});

// Step-by-step validation schemas
export const stepValidationSchemas = {
  1: nameValidation,
  2: emailValidation,
  3: passwordValidation,
  4: schoolValidation,
  5: phoneValidation
} as const;

// Type inference from Zod schemas
export type SignupFormData = z.infer<typeof signupValidationSchema>;
export type NameData = z.infer<typeof nameValidation>;
export type EmailData = z.infer<typeof emailValidation>;
export type PasswordData = z.infer<typeof passwordValidation>;
export type SchoolData = z.infer<typeof schoolValidation>;
export type PhoneData = z.infer<typeof phoneValidation>;

// Validation function for current step
export const validateCurrentStep = (step: number, data: any) => {
  const schema = stepValidationSchemas[step as keyof typeof stepValidationSchemas];
  if (!schema) {
    throw new Error(`Invalid step: ${step}`);
  }
  return schema.safeParse(data);
};

// Validation function for complete form
export const validateCompleteForm = (data: any) => {
  return signupValidationSchema.safeParse(data);
};