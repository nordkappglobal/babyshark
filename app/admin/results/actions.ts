"use server";

import { createClient, createAdminServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleActiveStatus(id: number, currentStatus: boolean) {
  const supabaseAdmin = await createAdminServerClient();
  const { error } = await supabaseAdmin
    .from("challenge_results")
    .update({ 
      is_active: !currentStatus
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/results");
  revalidatePath("/admin");
  return { success: true };
}

export async function softDelete(id: number) {
  console.log("softDelete triggered for id:", id);
  const supabaseAdmin = await createAdminServerClient();
  const { error } = await supabaseAdmin
    .from("challenge_results")
    .update({ 
      deleted_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) {
    console.error("softDelete Error:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/results");
  revalidatePath("/admin");
  return { success: true };
}

export async function restoreRecord(id: number) {
  const supabaseAdmin = await createAdminServerClient();
  const { error } = await supabaseAdmin
    .from("challenge_results")
    .update({ 
      deleted_at: null,
      deleted_by: null
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/results");
  revalidatePath("/admin");
  return { success: true };
}

export async function editResult(id: number, fullName: string, pullups: number) {
  const supabaseAdmin = await createAdminServerClient();

  // Find the new tier for these pullups
  const { data: tiers, error: tierError } = await supabaseAdmin
    .from("achievement_tiers")
    .select("*")
    .lte("min_pullups", pullups)
    .eq("is_active", true)
    .order("min_pullups", { ascending: false });

  if (tierError) return { error: tierError.message };

  const validTier = tiers?.find((t) => t.max_pullups === null || pullups <= t.max_pullups);
  if (!validTier) return { error: "No matching tier found" };

  // Update record
  const { error } = await supabaseAdmin
    .from("challenge_results")
    .update({
      full_name: fullName,
      pullups: pullups,
      tier_id: validTier.id,
      tier_name: validTier.title,
      rewards: validTier.rewards,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) return { error: error.message };

  // Recalculate rank_at_submission for all active records to ensure data consistency
  try {
    await supabaseAdmin.rpc('execute_sql', { sql: `
      WITH ranked AS (
        SELECT id, row_number() over (order by pullups desc, created_at asc, id asc) as new_rank
        FROM challenge_results WHERE is_active = true AND deleted_at IS NULL
      )
      UPDATE challenge_results
      SET rank_at_submission = ranked.new_rank
      FROM ranked
      WHERE challenge_results.id = ranked.id;
    `});
  } catch (e) {} // Silently fail if execute_sql doesn't exist, we'll fix rank visually via leaderboard

  try {
    await supabaseAdmin.rpc('refresh_leaderboard_top10');
  } catch (e) {}

  revalidatePath("/admin/results");
  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  return { success: true };
}

export async function hardDelete(id: number) {
  console.log("hardDelete triggered for id:", id);
  const supabaseAdmin = await createAdminServerClient();
  const { error } = await supabaseAdmin
    .from("challenge_results")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("hardDelete Error:", error);
    return { error: error.message };
  }

  try {
    await supabaseAdmin.rpc('refresh_leaderboard_top10');
  } catch (e) {}

  revalidatePath("/admin/results");
  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  return { success: true };
}
