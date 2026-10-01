import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { config } from './env.js';
globalThis.WebSocket = ws;

let supabaseClient = null;

if (config.supabase.url && (config.supabase.serviceRoleKey || config.supabase.anonKey)) {
  const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
  supabaseClient = createClient(config.supabase.url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  console.log('[Supabase] Initialized client connected to:', config.supabase.url);
} else {
  console.log('[Supabase] No credentials found in environment. Backend running with resilient in-memory seed repository.');
}

export const supabase = supabaseClient;
export const isSupabaseConfigured = () => Boolean(supabaseClient);



