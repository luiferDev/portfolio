import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { validateContactForm, validateEmail } from '../../lib/validators/contact';
import { sanitizeInput, validateHoneypot } from '../../lib/security/sanitize';
import { buildConfirmationEmail, buildNotificationEmail } from '../../lib/email/template';

// Your email (to receive notifications)
const YOUR_EMAIL = 'luifer991@protonmail.com';

export const POST: APIRoute = async ({ request }) => {
  try {
    // ... existing code ...
    return new Response(
      JSON.stringify({ success: true, message: 'Message sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Error sending message. Please try again later.' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};