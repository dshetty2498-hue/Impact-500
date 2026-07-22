"use server";

import { getSupabase } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function setFavorite(companyId: string, active: boolean) {
  const { userId } = await auth();
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!userId || !uuidPattern.test(companyId)) {
    throw new Error("The favorite request is invalid.");
  }
  const supabase = getSupabase();
  if (!supabase) throw new Error("Favorites are unavailable until the database is configured.");
  if (active) {
    const { error } = await supabase
      .from("favorites")
      .upsert({ clerk_user_id: userId, company_id: companyId });
    if (error) throw new Error("Unable to save favorite.");
    return;
  }
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("clerk_user_id", userId)
    .eq("company_id", companyId);
  if (error) throw new Error("Unable to remove favorite.");
}
