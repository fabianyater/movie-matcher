import { createClient } from '@supabase/supabase-js'

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_CLIENT_API_KEY as string;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
