import { z } from 'zod';

const baseResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().nullable().optional(),
});

export async function aceFetch<T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const url = `${baseUrl}${path}`;

  const response = await fetch(url, {
    cache: 'no-store',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? 'dev',
      ...(options.headers ?? {}),
    },
  });

  const json = await response.json();
  const parsedBase = baseResponseSchema.safeParse(json);

  if (!parsedBase.success) {
    console.error('[agent]', 'API response validation failed', parsedBase.error.flatten());
    throw new Error('Invalid API response shape');
  }

  const { success, data, error } = parsedBase.data;
  if (!success) {
    console.error('[agent]', 'API returned error', error);
    throw new Error(error ?? 'API error');
  }

  const parsedData = schema.safeParse(data);
  if (!parsedData.success) {
    console.error('[agent]', 'API data validation failed', parsedData.error.flatten());
    throw new Error('Invalid API data shape');
  }

  return parsedData.data;
}
