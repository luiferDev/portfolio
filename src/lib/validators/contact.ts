import { z } from 'zod';

/**
 * Contact form validation schema
 * Following OWASP input validation best practices:
 * - Use allowlist approach (specific characters allowed)
 * - Server-side validation only (client-side can be bypassed)
 * - Strict length limits to prevent buffer overflow attacks
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  lastname: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters'),
  
  // Honeypot field - should remain empty to prevent spam bots
  honeypot: z.string().max(0, 'Invalid submission').optional(),
  
  // Email for confirmation - validated separately
  email: z
    .string()
    .email('Invalid email format')
    .max(254, 'Email must be less than 254 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Validate contact form data
 * Returns the validated data or throws with detailed errors
 */
export function validateContactForm(data: unknown): ContactFormData {
  return contactSchema.parse(data);
}

/**
 * Validate email format with additional security checks
 * Based on OWASP email validation recommendations
 */
export function validateEmail(email: string): boolean {
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  
  // Check for dangerous characters
  const dangerousChars = /[<>\"'\\\x00-\x1F]/;
  if (dangerousChars.test(email)) {
    return false;
  }
  
  // Check length limits
  if (email.length > 254 || email.split('@')[0].length > 63) {
    return false;
  }
  
  return true;
}