'use server';

import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/lib/supabase/server';

type AuthProvider = 'github' | 'google';

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';
}

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function redirectWithMessage(path: string, message: string): never {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}

// Only allow internal, single-leading-slash paths as a post-auth destination. Anything else
// (absolute URLs, protocol-relative //host) falls back to the library.
function safeNext(value: string) {
  if (value.startsWith('/') && !value.startsWith('//')) {
    return value;
  }

  return '/library';
}

export async function signInWithPassword(formData: FormData) {
  const email = readString(formData, 'email');
  const password = readString(formData, 'password');
  const next = safeNext(readString(formData, 'next'));

  if (!email || !password) {
    redirectWithError('/signin', 'Enter your email and password.');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectWithError('/signin', error.message);
  }

  redirect(next);
}

export async function signUpWithPassword(formData: FormData) {
  const displayName = readString(formData, 'displayName');
  const email = readString(formData, 'email');
  const password = readString(formData, 'password');

  if (!email || !password) {
    redirectWithError('/signup', 'Enter your email and password.');
  }

  if (password.length < 8) {
    redirectWithError('/signup', 'Use at least 8 characters for your password.');
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName || email.split('@')[0],
      },
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/library`,
    },
  });

  if (error) {
    redirectWithError('/signup', error.message);
  }

  if (data.session) {
    redirect('/library');
  }

  redirectWithMessage('/signin', 'Check your email to confirm your account.');
}

export async function signInWithOAuth(formData: FormData) {
  const provider = readString(formData, 'provider');
  const next = safeNext(readString(formData, 'next'));

  if (provider !== 'google' && provider !== 'github') {
    redirectWithError('/signin', 'Choose a supported sign-in provider.');
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as AuthProvider,
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    redirectWithError('/signin', error?.message ?? 'Could not start OAuth sign in.');
  }

  redirect(data.url);
}

export async function requestPasswordReset(formData: FormData) {
  const email = readString(formData, 'email');

  if (!email) {
    redirectWithError('/forgot-password', 'Enter your email address.');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/settings`,
  });

  if (error) {
    redirectWithError('/forgot-password', error.message);
  }

  redirectWithMessage('/signin', 'Check your email for a password reset link.');
}
