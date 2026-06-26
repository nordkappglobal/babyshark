"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { toggleActiveStatus, softDelete, restoreRecord, editResult, hardDelete } from "@/app/admin/results/actions";
import { Trash2, RefreshCcw, Power, PowerOff, CheckCircle2, Edit2, X, Trash } from "lucide-react";

type RecordType = {
  id: number;
  player_code: string;
  full_name: string;
  pullups: number;
  tier_name: string;
  rank_at_submission: number;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
};

export default function ResultsTable({ initialData }: { initialData: RecordType[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ full_name: "", pullups: 0 });

  const handleToggle = (id: number, current: boolean) => {
    if (confirm(`Bạn có chắc muốn ${current ? 'ẩn' : 'hiện'} kết quả này?`)) {
      startTransition(() => {
        toggleActiveStatus(id, current).then(res => {
          if (res?.error) alert("Lỗi: " + res.error);
        }).catch(e => alert("Lỗi kết nối: " + e.message));
      });
    }
  };

  const handleSoftDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa mềm kết quả này? Nó sẽ không hiển thị trên BXH.')) {
      startTransition(() => {
        softDelete(id).then(res => {
          if (res?.error) alert("Lỗi xóa mềm: " + res.error);
        }).catch(e => alert("Lỗi kết nối: " + e.message));
      });
    }
  };

  const handleHardDelete = (id: number) => {
    if (confirm('XÓA VĨNH VIỄN: Kết quả sẽ bị xóa khỏi Database và không thể phục hồi. Bạn có chắc chắn?')) {
      startTransition(() => {
        hardDelete(id).then(res => {
          if (res?.error) alert("Lỗi xóa vĩnh viễn: " + res.error);
        }).catch(e => alert("Lỗi kết nối: " + e.message));
      });
    }
  };

  const handleRestore = (id: number) => {
    if (confirm('Phục hồi kết quả này?')) {
      startTransition(() => {
        restoreRecord(id).then(res => {
          if (res?.error) alert("Lỗi phục hồi: " + res.error);
        }).catch(e => alert("Lỗi kết nối: " + e.message));
      });
    }
  };

  const startEdit = (row: RecordType) => {
    setEditingId(row.id);
    setEditForm({ full_name: row.full_name, pullups: row.pullups });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id: number) => {
    if (!editForm.full_name || editForm.pullups < 0) return;
    startTransition(() => {
      editResult(id, editForm.full_name, editForm.pullups).then((res) => {
        if (res?.error) alert("Lỗi: " + res.error);
        else setEditingId(null);
      }).catch(e => alert("Lỗi kết nối: " + e.message));
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto relative min-h-[300px]">
      {isPending && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="px-4 py-2 bg-slate-800 text-white rounded-lg shadow-lg">Đang xử lý...</div>
        </div>
      )}
      <table className="w-full text-left whitespace-nowrap">
        <thead className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
          <tr>
            <th className="px-4 py-3">Mã KH</th>
            <th className="px-4 py-3">Họ tên</th>
            <th className="px-4 py-3">Số lần</th>
            <th className="px-4 py-3">Danh hiệu</th>
            <th className="px-4 py-3">Rank gốc</th>
            <th className="px-4 py-3">Thời gian</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {initialData.map((row) => (
            <tr key={row.id} className={row.deleted_at ? "bg-red-50/50" : "hover:bg-slate-50"}>
              <td className="px-4 py-3 font-mono text-slate-500">#{row.player_code}</td>
              
              <td className="px-4 py-3 font-medium text-slate-800">
                {editingId === row.id ? (
                  <input 
                    type="text" 
                    className="border border-blue-400 rounded px-2 py-1 w-full max-w-[150px]"
                    value={editForm.full_name} 
                    onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                  />
                ) : (
                  row.full_name
                )}
              </td>
              
              <td className="px-4 py-3 font-bold text-blue-600">
                {editingId === row.id ? (
                  <input 
                    type="number" 
                    className="border border-blue-400 rounded px-2 py-1 w-20"
                    value={editForm.pullups} 
                    onChange={(e) => setEditForm({...editForm, pullups: parseInt(e.target.value) || 0})}
                  />
                ) : (
                  row.pullups
                )}
              </td>
              
              <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-100 rounded-md text-xs">{row.tier_name}</span></td>
              <td className="px-4 py-3 text-slate-500">#{row.rank_at_submission}</td>
              <td className="px-4 py-3 text-slate-500">{format(new Date(row.created_at), "dd/MM/yyyy HH:mm:ss")}</td>
              <td className="px-4 py-3">
                {row.deleted_at ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-md">
                    Đã xóa mềm
                  </span>
                ) : row.is_active ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-md">
                    <CheckCircle2 className="w-3 h-3" /> Hợp lệ
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md">
                    Ẩn
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 items-center">
                  {editingId === row.id ? (
                    <>
                      <button onClick={() => saveEdit(row.id)} className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">Lưu</button>
                      <button onClick={cancelEdit} className="p-1 text-slate-500 hover:bg-slate-200 rounded"><X className="w-4 h-4" /></button>
                    </>
                  ) : (
                    <>
                      {!row.deleted_at && (
                        <>
                          <button
                            onClick={() => startEdit(row)}
                            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggle(row.id, row.is_active)}
                            className={`p-1.5 rounded-md transition-colors ${row.is_active ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'}`}
                            title={row.is_active ? "Ẩn kết quả" : "Hiện kết quả"}
                          >
                            {row.is_active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleSoftDelete(row.id)}
                            className="p-1.5 rounded-md text-orange-600 hover:bg-orange-50 transition-colors"
                            title="Xóa mềm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {row.deleted_at && (
                        <button
                          onClick={() => handleRestore(row.id)}
                          className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition-colors"
                          title="Khôi phục"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleHardDelete(row.id)}
                        className="p-1.5 rounded-md text-red-600 hover:bg-red-100 transition-colors bg-red-50 ml-2"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {initialData.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center py-8 text-slate-500">Chưa có kết quả nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
