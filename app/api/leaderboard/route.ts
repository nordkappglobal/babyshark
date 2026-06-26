import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0; // Force dynamic fetching

export async function GET() {
  try {
    const supabase = await createClient();
    
    // We can use the anon client here since leaderboard_top10 is public to read
    const { data, error } = await supabase
      .from("leaderboard_top10")
      .select("*")
      .order("position", { ascending: true });

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return NextResponse.json(
        { success: false, error: "Không thể lấy bảng xếp hạng" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}
