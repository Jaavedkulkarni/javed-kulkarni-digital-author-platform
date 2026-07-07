export type EmailTemplateId =
  | 'invite'
  | 'welcome'
  | 'password_reset'
  | 'verification'
  | 'role_changed';

export interface EmailTemplateContext {
  recipientName?: string;
  recipientEmail: string;
  platformName?: string;
  actionUrl?: string;
  roleName?: string;
  temporaryPassword?: string;
  expiresAt?: string;
  [key: string]: string | undefined;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const PLATFORM_NAME = 'AuthorOS';

const TEMPLATES: Record<EmailTemplateId, { subject: string; body: string }> = {
  invite: {
    subject: 'You have been invited to {{platformName}}',
    body: 'Hello {{recipientName}}, you have been invited to join {{platformName}}. Visit {{actionUrl}} to accept.',
  },
  welcome: {
    subject: 'Welcome to {{platformName}}',
    body: 'Hello {{recipientName}}, your {{platformName}} account is ready.',
  },
  password_reset: {
    subject: 'Reset your {{platformName}} password',
    body: 'Hello {{recipientName}}, use this link to reset your password: {{actionUrl}}',
  },
  verification: {
    subject: 'Verify your {{platformName}} email',
    body: 'Hello {{recipientName}}, verify your email: {{actionUrl}}',
  },
  role_changed: {
    subject: 'Your {{platformName}} role has changed',
    body: 'Hello {{recipientName}}, your role is now {{roleName}}.',
  },
};

function interpolate(template: string, context: EmailTemplateContext): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (key === 'platformName') return context.platformName ?? PLATFORM_NAME;
    return context[key] ?? '';
  });
}

export function renderEmailTemplate(
  templateId: EmailTemplateId,
  context: EmailTemplateContext,
): RenderedEmail {
  const template = TEMPLATES[templateId];
  const enriched: EmailTemplateContext = { platformName: PLATFORM_NAME, ...context };
  const text = interpolate(template.body, enriched);
  const subject = interpolate(template.subject, enriched);
  const html = `<!DOCTYPE html><html><body><p>${text.replace(/\n/g, '<br/>')}</p></body></html>`;
  return { subject, html, text };
}

export function listEmailTemplateIds(): EmailTemplateId[] {
  return Object.keys(TEMPLATES) as EmailTemplateId[];
}
