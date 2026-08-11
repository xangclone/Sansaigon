import React, { useState, useEffect } from 'react';
import { X, FileSpreadsheet, Download, RefreshCw, CheckCircle2, Copy, ExternalLink, ShieldCheck, Link2 } from 'lucide-react';
import { GoogleSheetSyncConfig } from '../types';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalRoomsCount: number;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  isOpen,
  onClose,
  totalRoomsCount
}) => {
  if (!isOpen) return null;

  const [sheetUrl, setSheetUrl] = useState('');
  const [appsScriptEndpoint, setAppsScriptEndpoint] = useState('');
  const [autoSync, setAutoSync] = useState(true);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetch('/api/sheets/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setSheetUrl(data.config.sheetUrl || '');
          setAppsScriptEndpoint(data.config.appsScriptEndpoint || '');
          setAutoSync(data.config.autoSync ?? true);
          setLastSynced(data.config.lastSyncedAt || null);
        }
      })
      .catch((err) => console.error('Error fetching sheet config:', err));
  }, []);

  const handleSaveConfig = async () => {
    try {
      const res = await fetch('/api/sheets/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl, appsScriptEndpoint, autoSync }),
      });
      const data = await res.json();
      if (data.success) {
        setLastSynced(data.config.lastSyncedAt);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
      }
    } catch (err) {
      alert('Không thể kết nối lưu cấu hình');
    }
  };

  const handleDownloadCSV = () => {
    window.open('/api/sheets/export-csv', '_blank');
  };

  const appsScriptCodeSnippet = `
function IMPORT_SAN_SAIGON_ROOMS() {
  var url = "${window.location.origin}/api/rooms";
  var response = UrlFetchApp.fetch(url);
  var json = JSON.parse(response.getContentText());
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
  
  // Headers - Cấu trúc các cột chuẩn của Sàn Sài Gòn
  sheet.appendRow([
    "Mã Phòng (ID)", 
    "Tiêu Đề Bài Đăng", 
    "Loại Bài Đăng", 
    "Trạng Thái", 
    "Giá Thuê (VND/Tháng)", 
    "Tiền Cọc (VND)", 
    "Hỗ Trợ Cọc (Pass Phòng)", 
    "Diện Tích (m2)", 
    "Quận/Huyện", 
    "Địa Chỉ Chi Tiết", 
    "Tiện Ích (Phẩy)", 
    "Link Hình Ảnh URL (Phân cách dấu phẩy)", 
    "SĐT Chủ Nhà", 
    "Tên Chủ Nhà", 
    "Ngày Đăng"
  ]);
  
  // Data Rows
  json.rooms.forEach(function(r) {
    var imagesList = (r.images || []).join(", ");
    var amenitiesList = (r.amenities || []).join(", ");
    sheet.appendRow([
      r.id, 
      r.title, 
      r.type, 
      r.status, 
      r.price, 
      r.deposit, 
      r.depositSupport || "", 
      r.area, 
      r.district, 
      r.address, 
      amenitiesList, 
      imagesList, 
      r.ownerPhone || r.phone || "", 
      r.ownerName || r.contactName || "", 
      r.createdAt
    ]);
  });
}
  `.trim();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appsScriptCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">KẾT NỐI DATABASE GOOGLE SHEETS</h2>
              <p className="text-xs text-emerald-200">Xuất dữ liệu phòng trọ ra Excel/Google Sheet hoặc đồng bộ tự động</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          
          {/* Quick Action 1: Export CSV to Excel/Google Sheets */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                  Cách 1: Tải File CSV
                </span>
                <span className="text-xs font-bold text-slate-800">
                  Xuất trọn bộ {totalRoomsCount} dữ liệu phòng trọ
                </span>
              </div>
              <p className="text-xs text-slate-600">
                File CSV tương thích hoàn toàn với Google Sheets và Microsoft Excel (Đã mã hóa chuẩn Tiếng Việt UTF-8 BOM).
              </p>
            </div>

            <button
              onClick={handleDownloadCSV}
              className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>TẢI FILE GOOGLE SHEET (CSV)</span>
            </button>
          </div>

          {/* Detailed Column Format Specification */}
          <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-2">
                <span>📊 BẢNG CẤU HÌNH CỘT GOOGLE SHEET CHUẨN (BASIC SHEET LAYOUT)</span>
              </h3>
              <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded">12 Cột cơ bản</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Nếu bạn tự tạo file Google Sheet mới, hãy đặt tiêu đề cột ở dòng đầu tiên (Row 1) theo đúng thứ tự sau:
            </p>

            <div className="overflow-x-auto rounded-xl border border-amber-200 bg-white">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-amber-100/70 text-amber-950 font-extrabold uppercase border-b border-amber-200">
                  <tr>
                    <th className="p-2">Cột</th>
                    <th className="p-2">Tên Cột</th>
                    <th className="p-2">Mô Tả / Định Dạng</th>
                    <th className="p-2">Ví Dụ Mẫu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 text-slate-800 font-medium">
                  <tr>
                    <td className="p-2 font-mono font-bold text-amber-800">A</td>
                    <td className="p-2 font-bold text-slate-900">Mã Phòng (ID)</td>
                    <td className="p-2">Chuỗi nhận diện duy nhất</td>
                    <td className="p-2 font-mono text-slate-600">SG-101</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold text-amber-800">B</td>
                    <td className="p-2 font-bold text-slate-900">Tiêu Đề Bài Đăng</td>
                    <td className="p-2">Tên phòng trọ / căn hộ</td>
                    <td className="p-2 text-slate-600">Phòng full nội thất Nơ Trang Long</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold text-amber-800">C</td>
                    <td className="p-2 font-bold text-slate-900">Loại Bài Đăng</td>
                    <td className="p-2 font-mono text-[10px]">phong-tro | ky-tuc-xa | pass-phong</td>
                    <td className="p-2 text-slate-600">phong-tro</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold text-amber-800">D</td>
                    <td className="p-2 font-bold text-slate-900">Giá Thuê (VND)</td>
                    <td className="p-2">Giá theo tháng (Số nguyên)</td>
                    <td className="p-2 font-mono text-rose-600 font-bold">3500000</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold text-amber-800">E</td>
                    <td className="p-2 font-bold text-slate-900">Hỗ Trợ Cọc (Pass phòng)</td>
                    <td className="p-2 text-emerald-700 font-bold">Ưu đãi / tặng cọc nếu có</td>
                    <td className="p-2 text-emerald-800 font-semibold">Hỗ trợ 1.000.000đ tiền cọc</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold text-amber-800">F</td>
                    <td className="p-2 font-bold text-slate-900">Diện Tích (m2)</td>
                    <td className="p-2">Diện tích phòng</td>
                    <td className="p-2 text-slate-600">25</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold text-amber-800">G</td>
                    <td className="p-2 font-bold text-slate-900">Quận / Huyện</td>
                    <td className="p-2">Tên quận tại TP.HCM</td>
                    <td className="p-2 text-slate-600">Bình Thạnh</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold text-amber-800">H</td>
                    <td className="p-2 font-bold text-slate-900">Địa Chỉ Chi Tiết</td>
                    <td className="p-2">Số nhà, tên đường, phường</td>
                    <td className="p-2 text-slate-600">184 Nơ Trang Long, Phường 12</td>
                  </tr>
                  <tr className="bg-emerald-50/80">
                    <td className="p-2 font-mono font-bold text-emerald-800">I 📸</td>
                    <td className="p-2 font-bold text-emerald-950">Link Hình Ảnh URL</td>
                    <td className="p-2 text-emerald-900 font-bold">
                      Các đường link ảnh (HTTP/HTTPS) phân cách bởi dấu phẩy <code className="bg-emerald-200 px-1 rounded text-emerald-950 font-black">,</code>
                    </td>
                    <td className="p-2 font-mono text-[10px] text-emerald-800 truncate max-w-[180px]">
                      https://images.unsplash.com/..., https://...
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold text-amber-800">J</td>
                    <td className="p-2 font-bold text-slate-900">Số Điện Thoại Chủ Nhà</td>
                    <td className="p-2">Số liên hệ trực tiếp</td>
                    <td className="p-2 font-mono text-slate-600">0908123456</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Action 2: Direct Google Sheet Link Integration */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                Cách 2: Đăng Nhập Link Google Sheet Của Bạn
              </span>
              <h3 className="text-xs font-bold text-slate-800">Cấu hình đồng bộ hai chiều</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                URL trang tính Google Sheet của bạn
              </label>
              <div className="relative">
                <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/1ABC.../edit"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Apps Script Webhook Endpoint (Tùy chọn cho Sync tự động)
              </label>
              <input
                type="url"
                value={appsScriptEndpoint}
                onChange={(e) => setAppsScriptEndpoint(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-500 font-medium">
                {lastSynced ? `Lần đồng bộ gần nhất: ${lastSynced}` : 'Chưa đồng bộ'}
              </div>

              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4" />}
                <span>{isSaved ? 'Đã Lưu Cấu Hình' : 'Lưu Cấu Hình Sync'}</span>
              </button>
            </div>
          </div>

          {/* Code Snippet for Google Apps Script */}
          <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400">
                ⚡ Code Google Apps Script Tự Động Kéo Dữ Liệu
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700"
              >
                {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Đã chép code' : 'Chép Code Script'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Mở Google Sheet của bạn -&gt; Vào Tiện ích mở rộng (Extensions) -&gt; Apps Script -&gt; Dán đoạn mã này để kết nối trực tiếp Sàn Sài Gòn!
            </p>
            <pre className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto border border-slate-800">
              {appsScriptCodeSnippet}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
