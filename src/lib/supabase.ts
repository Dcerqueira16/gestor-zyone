import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[DEBUG] Initializing Supabase...');
console.log('[DEBUG] URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('[DEBUG] Key:', supabaseAnonKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[CRITICAL] Missing Supabase Environment Variables!');
}

// Define client variable
export let supabase: ReturnType<typeof createClient>;

try {
    supabase = createClient(
        supabaseUrl || '',
        supabaseAnonKey || ''
    );
    console.log('[DEBUG] Supabase client created.');
} catch (err) {
    console.error('[CRITICAL] Failed to init Supabase:', err);
    // Re-throw or handle? If we re-throw, app crashes.
    // But we need to export something.
    throw err;
}
