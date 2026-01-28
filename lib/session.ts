// lib/session.ts
import { cookies } from 'next/headers';
import { SessionUser } from './auth';

const SESSION_COOKIE_NAME = 'session';

export async function createSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify(user);
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
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
    
    return JSON.parse(sessionCookie.value) as SessionUser;
  } catch (error) {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
