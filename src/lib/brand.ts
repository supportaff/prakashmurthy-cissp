export const HOST_NAME = "Prakashmurthy";
export const SITE_HOST = "prakashmurthy.com";
export const SITE_URL = "https://prakashmurthy.com";
export const HOST_EMAIL = "connect@prakashmurthy.com";

export function mailtoHost(subject: string, body: string): string {
  return `mailto:${HOST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
