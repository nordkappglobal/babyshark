"use server";

import { createClient, createAdminServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTier(data: {
  title: string;
  slug: string;
  min_pullups: number;
  max_pullups: number | null;
  rewards: string[];
  display_order: number;
}) {
  const supabaseAdmin = await createAdminServerClient();
  const { error } = await supabaseAdmin
    .from("achievement_tiers")
    .insert([{ ...data, is_active: true }]);

  if (error) return { error: error.message };

  revalidatePath("/admin/tiers");
  return { success: true };
}

export async function updateTier(id: number, data: {
  title: string;
  min_pullups: number;
  max_pullups: number | null;
  rewards: string[];
  display_order: number;
  is_active: boolean;
}) {
  const supabaseAdmin = await createAdminServerClient();
  const { error } = await supabaseAdmin
    .from("achievement_tiers")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/tiers");
  return { success: true };
}

export async function deleteTier(id: number) {
  // Hard delete
  const supabaseAdmin = await createAdminServerClient();
  const { error } = await supabaseAdmin
    .from("achievement_tiers")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/tiers");
  return { success: true };
}
