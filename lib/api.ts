// lib/api.ts
import { z } from 'zod';

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

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? 'dev',
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
