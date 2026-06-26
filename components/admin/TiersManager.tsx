"use client";

import { useState, useTransition } from "react";
import { createTier, updateTier, deleteTier } from "@/app/admin/tiers/actions";
import { Plus, Edit2, Trash2, X, Check, Power, PowerOff } from "lucide-react";

type Tier = {
  id: number;
  title: string;
  slug: string;
  min_pullups: number;
  max_pullups: number | null;
  rewards: string[];
  display_order: number;
  is_active: boolean;
};

export default function TiersManager({ initialData }: { initialData: Tier[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingTier, setEditingTier] = useState<Partial<Tier> | null>(null);

  const handleEdit = (tier: Tier) => {
    setEditingTier({ ...tier });
  };

  const handleCreateNew = () => {
    setEditingTier({
      title: "",
      slug: "",
      min_pullups: 0,
      max_pullups: null,
      rewards: [],
      display_order: initialData.length + 1,
      is_active: true
    });
  };

  const cancelEdit = () => {
    setEditingTier(null);
  };

  const handleSave = () => {
    if (!editingTier) return;
    if (!editingTier.title || editingTier.min_pullups === undefined) {
      alert("Vui lòng nhập Tên mốc và Số lần tối thiểu");
      return;
    }

    startTransition(() => {
      if (editingTier.id) {
        updateTier(editingTier.id, {
          title: editingTier.title || "",
          min_pullups: editingTier.min_pullups || 0,
          max_pullups: editingTier.max_pullups || null,
          rewards: editingTier.rewards || [],
          display_order: editingTier.display_order || 1,
          is_active: editingTier.is_active !== false
        }).then((res) => {
          if (res.error) alert(res.error);
          else setEditingTier(null);
        });
      } else {
        createTier({
          title: editingTier.title || "",
          slug: editingTier.slug || (editingTier.title || "").toLowerCase().replace(/ /g, '-'),
          min_pullups: editingTier.min_pullups || 0,
          max_pullups: editingTier.max_pullups || null,
          rewards: editingTier.rewards || [],
          display_order: editingTier.display_order || 1
        }).then((res) => {
          if (res.error) alert(res.error);
          else setEditingTier(null);
        });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Xóa vĩnh viễn mốc này?")) {
      startTransition(() => {
        deleteTier(id).then(res => {
          if (res.error) alert(res.error);
        });
      });
    }
  };

  return (
    <div className="relative">
      {isPending && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
          <div className="px-4 py-2 bg-slate-800 text-white rounded-lg shadow-lg">Đang xử lý...</div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Mốc phần thưởng (Tiers)</h1>
          <p className="text-sm text-slate-500">Danh sách các mốc quà hiện tại. Việc chỉnh sửa sẽ tự động cập nhật ngay trên BXH.</p>
        </div>
        <button onClick={handleCreateNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700">
          <Plus className="w-5 h-5" /> Thêm mốc mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialData.map((tier) => (
          <div key={tier.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-800">{tier.title}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-md ${tier.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {tier.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-slate-500 mb-1">Điều kiện:</p>
              <p className="font-bold text-blue-600">
                Từ {tier.min_pullups} {tier.max_pullups ? `đến ${tier.max_pullups}` : 'trở lên'} lần kéo
              </p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-2">Phần thưởng:</p>
              <ul className="space-y-1">
                {tier.rewards.map((r, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-gold-500">•</span>
                    {r}
                  </li>
                ))}
                {tier.rewards.length === 0 && (
                  <li className="text-sm text-slate-400 italic">Không có phần thưởng</li>
                )}
              </ul>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-2">
              <button onClick={() => handleEdit(tier)} className="p-2 bg-slate-100 rounded-md text-blue-600 hover:bg-blue-100">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(tier.id)} className="p-2 bg-slate-100 rounded-md text-red-600 hover:bg-red-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingTier && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <h2 className="text-xl font-bold mb-4">{editingTier.id ? 'Sửa Mốc' : 'Thêm Mốc Mới'}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên danh hiệu</label>
                <input 
                  type="text" 
                  value={editingTier.title || ''} 
                  onChange={e => setEditingTier({...editingTier, title: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              {!editingTier.id && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slug (Mã)</label>
                  <input 
                    type="text" 
                    value={editingTier.slug || ''} 
                    onChange={e => setEditingTier({...editingTier, slug: e.target.value})}
                    placeholder="vd: shark-chien-binh"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              )}

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tối thiểu</label>
                  <input 
                    type="number" 
                    value={editingTier.min_pullups || 0} 
                    onChange={e => setEditingTier({...editingTier, min_pullups: parseInt(e.target.value) || 0})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tối đa (để trống nếu ko giới hạn)</label>
                  <input 
                    type="number" 
                    value={editingTier.max_pullups || ''} 
                    onChange={e => setEditingTier({...editingTier, max_pullups: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phần thưởng (Mỗi dòng 1 món quà)</label>
                <textarea 
                  rows={4}
                  value={(editingTier.rewards || []).join('\n')} 
                  onChange={e => setEditingTier({...editingTier, rewards: e.target.value.split('\n').filter(r => r.trim() !== '')})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={editingTier.is_active !== false}
                  onChange={e => setEditingTier({...editingTier, is_active: e.target.checked})}
                />
                <label htmlFor="isActive" className="text-sm text-slate-700">Đang kích hoạt</label>
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={cancelEdit} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Hủy</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                {editingTier.id ? 'Lưu cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
