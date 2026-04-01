import { createClient } from '@supabase/supabase-js'

// Vite exposes env vars via import.meta.env (with VITE_ prefix)
// We also support the existing NEXT_PUBLIC_ names for backwards compat via vite.config define
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL ||
  'https://placeholder.supabase.co'

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
