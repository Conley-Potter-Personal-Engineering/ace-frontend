// lib/api.ts
import { z } from 'zod';

export const ACE_AUTH_TOKEN_KEY = 'ace_auth_token';
export const ACE_AUTH_USER_KEY = 'ace_auth_user';

export interface AceResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string | Record<string, unknown> | null;
}

export async function aceFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');

  const isBrowser = typeof window !== 'undefined';
  const authToken =
    isBrowser && typeof localStorage !== 'undefined'
      ? localStorage.getItem(ACE_AUTH_TOKEN_KEY)
      : null;
  const shouldProxy =
    isBrowser &&
    (base.startsWith('http://') || base.startsWith('https://')) &&
    !base.startsWith(window.location.origin);

  const target = shouldProxy
    ? `/api/ace-proxy?path=${encodeURIComponent(path)}`
    : `${base}${path}`;

  const res = await fetch(target, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? 'dev',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
    cache: 'no-store',
  });

  // Graceful handling of non-2xx
  if (!res.ok) {
    const text = await res.text();
    console.error(`[aceFetch] HTTP ${res.status} → ${text}`);
    throw new Error(`API request failed with status ${res.status}`);
  }

  let json: AceResponse<T>;
  try {
    json = await res.json();
  } catch {
    throw new Error('Failed to parse API response as JSON');
  }

  if (!json.success) {
    console.error('[aceFetch] API error:', json.error);
    throw new Error(
      typeof json.error === 'string' ? json.error : 'Unknown API error'
    );
  }

  return json.data;
}

// Optional helper for schema validation (client-side, if needed)
export async function aceFetchValidated<T>(
  path: string,
  schema: z.ZodSchema<T>,
  options: RequestInit = {}
): Promise<T> {
  const data = await aceFetch<unknown>(path, options);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    console.error('[aceFetchValidated] Schema validation failed:', parsed.error);
    throw new Error('Invalid response format');
  }
  return parsed.data;
}
