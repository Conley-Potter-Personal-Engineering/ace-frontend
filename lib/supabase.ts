import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const env = (() => {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!parsed.success) {
    console.error('[agent] Invalid Supabase environment configuration', parsed.error.flatten().fieldErrors);
    throw new Error('Missing or invalid Supabase environment variables');
  }

  return parsed.data;
})();

const globalForSupabase = globalThis as typeof globalThis & {
  supabaseClient?: SupabaseClient;
  supabaseValidation?: Promise<void>;
};

const supabaseClient: SupabaseClient =
  globalForSupabase.supabaseClient ??
  createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

globalForSupabase.supabaseClient = supabaseClient;

const validateConnection = (client: SupabaseClient) => {
  if (!globalForSupabase.supabaseValidation) {
    console.info('[agent] Validating Supabase connection against system_events');

    globalForSupabase.supabaseValidation = client
      .from('system_events')
      .select('*')
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.error('[agent] Supabase validation failed', error);
          return;
        }

        console.info('[agent] Supabase validation succeeded', data);
      })
      .catch((validationError: unknown) => {
        console.error('[agent] Supabase validation encountered an unexpected error', validationError);
      });
  }

  return globalForSupabase.supabaseValidation;
};

void validateConnection(supabaseClient);

export function getSupabaseClient(): SupabaseClient {
  return supabaseClient;
}
