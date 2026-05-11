const FALLBACK_FROM_EMAIL = "noreply@example.com";

export function parseSesFromEmails(rawValue: string | undefined): string[] {
  if (!rawValue) {
    return [FALLBACK_FROM_EMAIL];
  }

  const emails = rawValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!emails.length) {
    return [FALLBACK_FROM_EMAIL];
  }

  return [...new Set(emails)];
}

export function getAllowedSesFromEmails(): string[] {
  return parseSesFromEmails(process.env.SES_FROM_EMAIL);
}

export function getDefaultSesFromEmail(): string {
  return getAllowedSesFromEmails()[0] ?? FALLBACK_FROM_EMAIL;
}

export function isAllowedSesFromEmail(fromEmail: string): boolean {
  return getAllowedSesFromEmails().includes(fromEmail);
}
