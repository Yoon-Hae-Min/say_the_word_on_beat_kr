import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../../../database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    `Missing Supabase server environment variables(${
      !supabaseUrl ? "supabaseUrl" : ""
    } ${
      !supabaseServiceRoleKey ? "supabaseServiceRoleKey" : ""
    }). Please check your .env.local file.`
  );
}

// Server-side Supabase client with service role key
// Use ONLY in API routes or server-side code
// DO NOT expose this client to the browser
// Typed with Database schema for type safety
export const supabaseServer = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
