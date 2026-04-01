import DOMPurify from 'isomorphic-dompurify';

/**
 * Input sanitization utilities
 * Following OWASP XSS prevention guidelines:
 * - Always sanitize on server-side (client-side can be bypassed)
 * - Use DOMPurify for HTML sanitization
 * - Encode output when displaying user input
 */

/**
 * Sanitize user input to prevent XSS attacks
 * Uses DOMPurify to remove malicious scripts while preserving safe HTML
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed - plain text only
    ALLOWED_ATTR: [], // No attributes allowed
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  }).trim();
}

/**
 * Validate honeypot field - should be empty to pass
 * Bots often fill hidden fields, real users leave them empty
 */
export function validateHoneypot(honeypotValue: string | undefined): boolean {
  // If honeypot has any value, it's likely a bot
  return !honeypotValue || honeypotValue === '';
}

/**
 * Sanitize for HTML display - encode special characters
 * Use this when displaying user input in HTML
 */
export function encodeForHtml(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validate string length within safe bounds
 */
export function validateLength(input: string, min: number, max: number): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }
  
  const length = input.trim().length;
  return length >= min && length <= max;
}

/**
 * Check for potential SQL injection patterns
 * Note: This is a heuristic, not a complete solution
 * Primary defense is using parameterized queries (Zod validation)
 */
export function containsSqlInjectionPattern(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION)\b)/i,
    /(--|#|\/\*|\*\/)/,
    /(\bOR\b.*=.*\bOR\b)/i,
    /(\bAND\b.*=.*\bAND\b)/i,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Check for potential prompt injection patterns
 * For AI/LLM integrations - not directly used but documented
 */
export function containsPromptInjectionPattern(input: string): boolean {
  const promptPatterns = [
    /^(ignore|disregard|forget|override)/i,
    /(\b(system|admin|root)\b:)/i,
    /(你是|你是谁|ignore previous)/i,
  ];
  
  return promptPatterns.some(pattern => pattern.test(input));
}