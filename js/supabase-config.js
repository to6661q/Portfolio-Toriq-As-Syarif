// USING CDN SUPABASE FOR GIHUB PAGES
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabaseUrl = 'https://relosxezemvjiilnhrrp.supabase.co';
 // ANON KEY
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbG9zeGV6ZW12amlpbG5ocnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDI1NDIsImV4cCI6MjA5MzkxODU0Mn0.RRTm3L9J9JpBCT123-vN3MU8ju0FgUnqNGIFf7dbrEM';
export const supabase = createClient(supabaseUrl, supabaseKey);
