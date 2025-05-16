import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hiuikgqvimqhssokuubl.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdWlrZ3F2aW1xaHNzb2t1dWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MTEwNDIsImV4cCI6MjA2MDk4NzA0Mn0.55V129JOmUiseVTIxb3e5dZh3EYD0q77WXuN0RhAgew";
export const supabase = createClient(supabaseUrl, supabaseKey);
