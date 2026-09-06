import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Initialize and export a single reusable Supabase client instance
export const SUPABASE_URL = 'https://jritiortuorrpcfkoupf.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyaXRpb3J0dW9ycnBjZmtvdXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1ODkwMjMsImV4cCI6MjEwNDE2NTAyM30.aV_Z6atA8OgrPZFQ_Oj74u24nGYocz2L8XQXpSRgk0Q';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Helper function to generate Supabase Storage public URLs
 * @param {string} bucket - The storage bucket name
 * @param {string} fileName - The name of the file
 * @returns {string} The public URL for the image
 */
export function getStorageImageUrl(bucket, fileName) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}
