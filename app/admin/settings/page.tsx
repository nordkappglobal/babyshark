"use client";

import { useTransition, useEffect, useState } from "react";
import { resetCampaign, getCaptchaCode, updateCaptchaCode } from "@/app/admin/settings/actions";
import { AlertTriangle, Trash2, Save, KeyRound } from "lucide-react";

export default function AdminSettingsPage() {
  const [isPending, startTransition] = useTransition();
  const [captchaCode, setCaptchaCode] = useState("");
  const [isUpdatingCaptcha, setIsUpdatingCaptcha] = useState(false);

  useEffect(() => {
    getCaptchaCode().then(setCaptchaCode);
  }, []);

  const handleReset = () => {
    if (confirm("CẢNH BÁO NGUY HIỂM: Hành động này sẽ XÓA SẠCH toàn bộ dữ liệu người chơi và reset lại bộ đếm về 0 để bắt đầu một đợt sự kiện mới. Không thể hoàn tác. Bạn có chắc chắn 100% không?")) {
      const prm = prompt("Để xác nhận, vui lòng gõ 'XOA TAT CA' vào ô bên dưới:");
      if (prm === "XOA TAT CA") {
        startTransition(() => {
          resetCampaign().then(res => {
            if (res.error) alert(res.error);
            else alert("Đã dọn dẹp hệ thống thành công!");
          });
        });
      } else {
        alert("Xác nhận không đúng, đã hủy thao tác.");
      }
    }
  };

  const handleSaveCaptcha = async () => {
    setIsUpdatingCaptcha(true);
    const res = await updateCaptchaCode(captchaCode);
    setIsUpdatingCaptcha(false);
    if (res.error) alert(res.error);
    else alert("Đã cập nhật mã Captcha thành công!");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Cấu hình hệ thống</h1>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-ocean-600" /> Mã Xác Nhận (Captcha)
        </h2>
        
        <div className="flex flex-col gap-2 max-w-sm">
          <label className="text-sm font-semibold text-slate-600">Mã cấp cho người chơi để xác nhận kết quả</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={captchaCode}
              onChange={e => setCaptchaCode(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 font-mono font-bold text-slate-900"
              placeholder="Nhập mã..."
            />
            <button 
              onClick={handleSaveCaptcha}
              disabled={isUpdatingCaptcha}
              className="bg-ocean-600 hover:bg-ocean-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isUpdatingCaptcha ? "Đang lưu..." : <><Save className="w-4 h-4" /> Lưu</>}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm">
        <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Vùng Nguy Hiểm (Danger Zone)
        </h2>
        
        <div className="p-4 bg-red-50 rounded-lg border border-red-100 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-red-800 mb-1">Reset toàn bộ Chiến dịch (Bắt đầu mùa mới)</h3>
            <p className="text-sm text-red-600">
              Xóa sạch toàn bộ kết quả của người chơi khỏi cơ sở dữ liệu. Thiết lập lại mã số người chơi (Mã KH) về 0. Bảng xếp hạng sẽ trống. Tiers (Mốc quà) vẫn được giữ nguyên.
            </p>
          </div>
          
          <button 
            onClick={handleReset}
            disabled={isPending}
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isPending ? "Đang xử lý..." : <><Trash2 className="w-4 h-4" /> Reset Hệ Thống</>}
          </button>
        </div>
      </div>
    </div>
  );
}
