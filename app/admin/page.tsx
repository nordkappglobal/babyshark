import { createAdminServerClient } from "@/lib/supabase/server";
import { Users, Target, Activity, FileSpreadsheet } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createAdminServerClient();

  // Fetch some stats
  const [totalRes, activeRes, deletedRes, topPlayers] = await Promise.all([
    supabase.from("challenge_results").select("id", { count: "exact", head: true }),
    supabase.from("challenge_results").select("id", { count: "exact", head: true }).eq("is_active", true).is("deleted_at", null),
    supabase.from("challenge_results").select("id", { count: "exact", head: true }).not("deleted_at", "is", null),
    supabase.from("leaderboard_top10").select("*").limit(5).order("position", { ascending: true })
  ]);

  const total = totalRes.count || 0;
  const active = activeRes.count || 0;
  const deleted = deletedRes.count || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Tổng quan hệ thống</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-500">Tổng lượt ghi nhận</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileSpreadsheet className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black text-slate-800">{total}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-500">Đang hoạt động (Active)</h3>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Activity className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black text-slate-800">{active}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-500">Đã xóa mềm</h3>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Target className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black text-slate-800">{deleted}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4">Top 5 hiện tại</h2>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Hạng</th>
              <th className="px-6 py-4">Tên</th>
              <th className="px-6 py-4">Mã số</th>
              <th className="px-6 py-4">Số lần</th>
              <th className="px-6 py-4">Danh hiệu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {topPlayers.data?.map((p) => (
              <tr key={p.position}>
                <td className="px-6 py-4 font-bold text-slate-800">#{p.position}</td>
                <td className="px-6 py-4 font-medium">{p.display_name}</td>
                <td className="px-6 py-4 text-slate-500">#{p.player_code}</td>
                <td className="px-6 py-4 font-bold text-blue-600">{p.pullups}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">
                    {p.tier_name}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
