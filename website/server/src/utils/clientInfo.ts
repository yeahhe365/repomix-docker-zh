import type { Context } from 'hono';

export interface ClientInfo {
  ip: string;
  userAgent?: string;
  referer?: string;
}

export function getClientInfo(c: Context): ClientInfo {
  // Get client IP from various headers (prioritized order)
  const ip =
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
    c.req.header('x-real-ip') ||
    c.req.header('cf-connecting-ip') ||
    '0.0.0.0';

  const userAgent = c.req.header('user-agent');
  const referer = c.req.header('referer');

  return {
    ip,
    userAgent,
    referer,
  };
}
