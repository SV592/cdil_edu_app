'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'cdil_user_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function loginAction(userId: number) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);

  redirect('/login');
}

export async function getUserIdFromCookie(): Promise<number | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(COOKIE_NAME);

  if (!userCookie?.value) {
    return null;
  }

  const userId = parseInt(userCookie.value, 10);
  return isNaN(userId) ? null : userId;
}
