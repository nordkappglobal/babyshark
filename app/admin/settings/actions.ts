"use server";

import { createClient, createAdminServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function resetCampaign() {
  const supabaseAdmin = await createAdminServerClient();
  // Delete all results
  const { error: deleteError } = await supabaseAdmin
    .from("challenge_results")
    .delete()
    .neq("id", -1); // Deletes all rows

  if (deleteError) return { error: deleteError.message };

  // Reset counters
  await supabaseAdmin
    .from("campaign_counters")
    .update({ last_value: 0 })
    .eq("key", "submission_no");

  // Refresh leaderboard
  try {
    await supabaseAdmin.rpc('refresh_leaderboard_top10');
  } catch (e) {}

  revalidatePath("/admin");
  revalidatePath("/admin/results");
  revalidatePath("/leaderboard");
  return { success: true };
}

export async function getCaptchaCode() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "captcha_code")
    .single();
    
  if (error || !data) return "123456"; // fallback
  return data.value;
}

export async function updateCaptchaCode(newCode: string) {
  if (!newCode || newCode.trim().length === 0) {
    return { error: "Mã captcha không được để trống" };
  }
  
  const supabaseAdmin = await createAdminServerClient();
  const { error } = await supabaseAdmin
    .from("app_settings")
    .upsert({ 
      key: "captcha_code", 
      value: newCode.trim(),
      description: "Mã xác nhận để nộp kết quả kéo xà",
      updated_at: new Date().toISOString()
    });

  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}
