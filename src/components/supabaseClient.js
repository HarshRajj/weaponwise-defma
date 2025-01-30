import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://frzuszxndrfvqcffvzta.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyenVzenhuZHJmdnFjZmZ2enRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MjQxODMsImV4cCI6MjA0NjMwMDE4M30.9VRG6CmrrctgzYBh5_plBq_2ehGXW8GyVUfQt0vTrJA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
