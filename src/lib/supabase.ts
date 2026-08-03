import { createClient } from "@supabase/supabase-js"
import Constants from "@/lib/constants"

export const supabase = createClient(
  Constants.SUPABASE_URL!,
  Constants.SUPABASE_ANON_KEY!,
)
