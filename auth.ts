import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { getDb, saveDb, AdminUser } from './db';

const SESSION_COOKIE_NAME = 'asa_admin_token';
const SESSION_SECRET = process.env.SESSION_SECRET || 'athmanathan_secure_jwt_session_secret_2026_x99!';

// In-memory active sessions with expiration (server-side session management)
interface ActiveSession {
  userId: string;
  username: string;
  role: string;
  expiresAt: number;
}

const activeSessions = new Map<string, ActiveSession>();

// Failed login tracker for brute force / rate limit protection
interface FailedAttempt {
  count: number;
  lockedUntil: number;
}
const failedLogins = new Map<string, FailedAttempt>();

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// RFC 6238 Base32 implementation for Google Authenticator / Microsoft Authenticator
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateBase32Secret(length = 20): string {
  const randomBytes = crypto.randomBytes(length);
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < randomBytes.length; i++) {
    value = (value << 8) | randomBytes[i];
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

function base32ToBuffer(base32: string): Buffer {
  const cleaned = base32.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleaned.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(cleaned[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

export function generateTotpCode(secret: string, timeStep = 30, timestamp = Date.now()): string {
  const counter = Math.floor(timestamp / 1000 / timeStep);
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(counter));

  const key = base32ToBuffer(secret);
  const hmac = crypto.createHmac('sha1', key);
  hmac.update(buffer);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0xf;
  const code =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = code % 1000000;
  return otp.toString().padStart(6, '0');
}

export function verifyTotpCode(secret: string, token: string): boolean {
  if (!secret || !token) return false;
  const cleanToken = token.trim().replace(/\s+/g, '');
  if (!/^\d{6}$/.test(cleanToken)) return false;

  const now = Date.now();
  // Allow +-1 step (30s clock drift tolerance)
  for (let step = -1; step <= 1; step++) {
    const testTime = now + step * 30 * 1000;
    const expected = generateTotpCode(secret, 30, testTime);
    if (expected === cleanToken) {
      return true;
    }
  }
  return false;
}

export function getOtpAuthUrl(secret: string, email: string): string {
  const label = encodeURIComponent(`Athmanathan Study Abroad:${email}`);
  const issuer = encodeURIComponent('Athmanathan Study Abroad');
  return `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
}

// Session Token Generation & Verification with HMAC SHA-256
export function createSessionToken(user: AdminUser): string {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    expiresAt: Date.now() + 1000 * 60 * 60 * 12, // 12 hours
  };
  activeSessions.set(sessionId, payload);

  const data = Buffer.from(JSON.stringify({ sessionId, ...payload })).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifySessionToken(token: string): ActiveSession | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, signature] = parts;

  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  if (signature !== expectedSig) return null;

  try {
    const parsed = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (!parsed.sessionId || !parsed.expiresAt || parsed.expiresAt < Date.now()) {
      return null;
    }

    const session = activeSessions.get(parsed.sessionId);
    if (!session || session.expiresAt < Date.now()) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function revokeSession(token: string): void {
  if (!token) return;
  const parts = token.split('.');
  if (parts.length === 2) {
    try {
      const parsed = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf-8'));
      if (parsed.sessionId) {
        activeSessions.delete(parsed.sessionId);
      }
    } catch {
      // ignore
    }
  }
}

// Rate-limiting and Brute-force protection
export function checkLoginAttempts(ip: string): { allowed: boolean; remainingWaitSec?: number } {
  const record = failedLogins.get(ip);
  if (!record) return { allowed: true };

  if (Date.now() < record.lockedUntil) {
    const remainingWaitSec = Math.ceil((record.lockedUntil - Date.now()) / 1000);
    return { allowed: false, remainingWaitSec };
  }

  // Lock period expired, reset
  if (Date.now() >= record.lockedUntil && record.count >= 5) {
    failedLogins.delete(ip);
  }
  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const record = failedLogins.get(ip) || { count: 0, lockedUntil: 0 };
  record.count += 1;
  if (record.count >= 5) {
    // Lock for 10 minutes
    record.lockedUntil = Date.now() + 10 * 60 * 1000;
  }
  failedLogins.set(ip, record);
}

export function resetFailedLogins(ip: string): void {
  failedLogins.delete(ip);
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const cookieToken = req.cookies?.[SESSION_COOKIE_NAME];
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  const token = cookieToken || bearerToken;

  if (!token) {
    res.status(401).json({ error: 'Unauthorized. Admin authentication required.' });
    return;
  }

  const session = verifySessionToken(token);
  if (!session) {
    res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    return;
  }

  // Attach session info to req
  (req as any).adminSession = session;
  next();
}

export { SESSION_COOKIE_NAME };
