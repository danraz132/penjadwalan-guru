// lib/session.ts
import { cookies } from 'next/headers';
import { SessionUser } from './auth';

const SESSION_COOKIE_NAME = 'session';

function encodeSessionValue(user: SessionUser): string {
  const json = JSON.stringify(user);
  return Buffer.from(json, 'utf-8').toString('base64url');
}

function tryParseSession(value: string): SessionUser | null {
  try {
    return JSON.parse(value) as SessionUser;
  } catch {
    return null;
  }
}

function decodeSessionValue(rawValue: string): SessionUser | null {
  const directParsed = tryParseSession(rawValue);
  if (directParsed) return directParsed;

  try {
    const decodedOnce = decodeURIComponent(rawValue);
    const parsedOnce = tryParseSession(decodedOnce);
    if (parsedOnce) return parsedOnce;

    const decodedTwice = decodeURIComponent(decodedOnce);
    const parsedTwice = tryParseSession(decodedTwice);
    if (parsedTwice) return parsedTwice;
  } catch {
    // ignore decodeURIComponent errors and continue with base64 decoding
  }

  try {
    const base64Decoded = Buffer.from(rawValue, 'base64url').toString('utf-8');
    return tryParseSession(base64Decoded);
  } catch {
    return null;
  }
}

export async function createSession(user: SessionUser, secureCookie: boolean): Promise<void> {
  const cookieStore = await cookies();
  const sessionData = encodeSessionValue(user);
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    
    if (!sessionCookie) {
      return null;
    }
    
    return decodeSessionValue(sessionCookie.value);
  } catch (error) {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
