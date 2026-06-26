import { createAdminServerClient } from "@/lib/supabase/server";
import TiersManager from "@/components/admin/TiersManager";

export default async function AdminTiersPage() {
  const supabase = await createAdminServerClient();
  const { data, error } = await supabase
    .from("achievement_tiers")
    .select("*")
    .order("display_order", { ascending: true })
    .order("min_pullups", { ascending: true });

  if (error) {
    return <div className="text-red-500">Lỗi tải dữ liệu</div>;
  }

  return (
    <div>
      <TiersManager initialData={data || []} />
    </div>
  );
}
