import { NextResponse } from "next/server";
import { submitResultSchema } from "@/lib/validations";
import { createAdminServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = submitResultSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Dữ liệu không hợp lệ", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { fullName, pullups, captchaCode, idempotencyKey } = parsed.data;

    // Use admin client since this is a server route and we need to bypass RLS for inserting public submissions
    const supabase = await createAdminServerClient();

    // Verify captcha
    const { data: captchaData, error: captchaError } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "captcha_code")
      .single();

    if (captchaError || !captchaData) {
      console.error("Error fetching captcha:", captchaError);
      return NextResponse.json(
        { success: false, error: "Lỗi cấu hình hệ thống (Không tìm thấy mã Captcha)" },
        { status: 500 }
      );
    }

    if (captchaCode !== captchaData.value) {
      return NextResponse.json(
        { success: false, error: "Mã xác nhận không chính xác!" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("submit_challenge_result", {
      p_full_name: fullName,
      p_pullups: pullups,
      p_idempotency_key: idempotencyKey,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return NextResponse.json(
        { success: false, error: "Lỗi hệ thống. Vui lòng thử lại sau." },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Submit API error:", error);
    return NextResponse.json(
      { success: false, error: "Đã có lỗi xảy ra. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
