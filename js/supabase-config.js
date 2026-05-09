// Gunakan CDN Supabase agar tidak perlu install npm (cocok untuk GitHub Pages)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'URL_SUPABASE_ANDA'
const supabaseKey = 'ANON_KEY_SUPABASE_ANDA'

export const supabase = createClient(supabaseUrl, supabaseKey)
