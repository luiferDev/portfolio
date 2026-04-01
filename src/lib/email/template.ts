/**
 * Email templates for contact form
 * Responsive HTML emails matching portfolio design
 * Palette: #93565d (accent), #222 (bg), #ffffff (text)
 * Fonts: Space Grotesk (headings), Inter (body)
 */

interface ConfirmationEmailData {
  name: string;
  message: string;
  locale: string;
}

interface NotificationEmailData {
  name: string;
  lastname: string;
  email: string;
  message: string;
}

const translations = {
  es: {
    greeting: '¡Hola',
    confirmationTitle: 'Tu mensaje ha sido recibido',
    confirmationMessage: 'Gracias por contactarme. He recibido tu mensaje y te responderé en breve.',
    messageLabel: 'Tu mensaje:',
    footer: 'Este es un correo automático, por favor no respondas a este mensaje.',
    regards: 'Saludos',
    signature: 'LuiferDev',
  },
  en: {
    greeting: 'Hi',
    confirmationTitle: 'Your message has been received',
    confirmationMessage: 'Thank you for contacting me. I have received your message and will reply shortly.',
    messageLabel: 'Your message:',
    footer: 'This is an automatic email, please do not reply to this message.',
    regards: 'Best regards',
    signature: 'LuiferDev',
  },
  fr: {
    greeting: 'Bonjour',
    confirmationTitle: 'Votre message a été reçu',
    confirmationMessage: "Merci de m'avoir contacté. J'ai reçu votre message et je répondrai sous peu.",
    messageLabel: 'Votre message:',
    footer: "Ceci est un correo automatique, s'il vous plaît ne pas répondre à ce message.",
    regards: 'Cordialement',
    signature: 'LuiferDev',
  },
};

function getTranslations(locale: string) {
  return translations[locale as keyof typeof translations] || translations.es;
}

/**
 * Build confirmation email sent to the user
 * Responsive HTML with inline styles for email compatibility
 */
export function buildConfirmationEmail(data: ConfirmationEmailData): string {
  const t = getTranslations(data.locale);
  
  const html = `
<!DOCTYPE html>
<html lang="${data.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.confirmationTitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #222; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #222;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #2a2a2a; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #93565d 0%, #7a4750 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700;">
                ${t.confirmationTitle}
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #ffffff; font-size: 16px; line-height: 1.6;">
                ${t.greeting} <strong style="color: #93565d;">${data.name}</strong>! 👋
              </p>
              
              <p style="margin: 0 0 30px; color: #d1d5db; font-size: 16px; line-height: 1.6;">
                ${t.confirmationMessage}
              </p>
              
              <!-- Message Preview -->
              <div style="background-color: rgba(147, 86, 93, 0.1); border-left: 4px solid #93565d; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0 0 10px; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                  ${t.messageLabel}
                </p>
                <p style="margin: 0; color: #ffffff; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">
                  ${escapeHtml(data.message)}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #1a1a1a; text-align: center;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px;">
                ${t.footer}
              </p>
              <p style="margin: 0; color: #93565d; font-size: 14px; font-weight: 600;">
                ${t.signature}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
  
  return html;
}

/**
 * Build notification email sent to you
 * Shows all the contact form data
 */
export function buildNotificationEmail(data: NotificationEmailData): string {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo mensaje de contacto</title>
</head>
<body style="margin: 0; padding: 0; background-color: #222; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #222;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #2a2a2a; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #93565d 0%, #7a4750 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700;">
                📬 Nuevo mensaje de contacto
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <!-- Contact Info -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px; background-color: rgba(147, 86, 93, 0.1); border-radius: 8px; margin-bottom: 10px;">
                    <strong style="color: #93565d; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Nombre:</strong>
                    <p style="margin: 5px 0 0; color: #ffffff; font-size: 16px;">${escapeHtml(data.name)} ${escapeHtml(data.lastname)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: rgba(147, 86, 93, 0.1); border-radius: 8px;">
                    <strong style="color: #93565d; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email:</strong>
                    <p style="margin: 5px 0 0;">
                      <a href="mailto:${escapeHtml(data.email)}" style="color: #93565d; text-decoration: none;">${escapeHtml(data.email)}</a>
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Message -->
              <div style="background-color: rgba(147, 86, 93, 0.1); border-left: 4px solid #93565d; border-radius: 8px; padding: 20px;">
                <strong style="color: #93565d; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Mensaje:</strong>
                <p style="margin: 10px 0 0; color: #ffffff; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">
                  ${escapeHtml(data.message)}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #1a1a1a; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 13px;">
                Enviado desde el formulario de contacto de luiferdev.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
  
  return html;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}