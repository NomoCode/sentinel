
"use client"; // Has to be client accessed

import { createClient } from "@supabase/supabase-js";

// Create the supabase client from the env variables, which will be determined by enviornment 
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

export default supabase;