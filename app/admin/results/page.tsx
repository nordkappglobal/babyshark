import { createAdminServerClient } from "@/lib/supabase/server";
import ResultsTable from "@/components/admin/ResultsTable";
import { Filter } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createAdminServerClient();
  const search = await searchParams;
  
  // Basic query
  let query = supabase
    .from("challenge_results")
    .select("*")
    .order("created_at", { ascending: false });

  if (search.q && typeof search.q === 'string') {
    query = query.or(`full_name.ilike.%${search.q}%,player_code.ilike.%${search.q}%`);
  }

  const { data, error } = await query;
  console.log("AdminResultsPage key:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "YES" : "NO");
  console.log("AdminResultsPage query returned rows:", data?.length, "error:", error);

  if (error) {
    return <div className="text-red-500">Lỗi tải dữ liệu: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Kết quả tham gia</h1>
        
        {/* Simple search form via server component refresh */}
        <form className="flex gap-2" method="GET" action="/admin/results">
          <div className="relative">
            <input
              type="text"
              name="q"
              defaultValue={search.q as string || ""}
              placeholder="Tìm tên hoặc mã KH..."
              className="pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-slate-700">
            <Filter className="w-4 h-4" /> Lọc
          </button>
        </form>
      </div>

      <ResultsTable initialData={data || []} />
    </div>
  );
}
