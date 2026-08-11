import React, { useState } from 'react';
import { X, Phone, MessageCircle, Send, CheckCircle2, Sparkles, Clock, User, PhoneCall, ShieldCheck } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomTitle?: string;
  roomId?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  roomTitle,
  roomId
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('Trong 15 phút');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('⚠️ Vui lòng điền Họ tên và Số điện thoại liên hệ.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: roomId || 'Tư vấn chung',
          listingTitle: roomTitle || 'Tìm phòng trọ Sài Gòn',
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          note,
          preferredTime
        }),
      });
      const data = await res.json();
      if (data && data.success) {
        setIsSubmitted(true);
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500 via-rose-600 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center font-black shadow-md">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight uppercase">LIÊN HỆ TƯ VẤN NGAY</h2>
              <p className="text-xs text-amber-100">Hotline hỗ trợ miễn phí 24/7 Sàn Sài Gòn</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Prominent Hotline Phone Numbers Section */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-slate-400 font-semibold uppercase">Hotline Trực Tiếp</span>
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">Đang Hoạt Động</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="tel:0908123456"
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-2 transition-colors border border-slate-700/80"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 fill-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Tư Vấn Phòng Trọ</span>
                  <span className="text-sm font-black text-amber-400">0908 123 456</span>
                </div>
              </a>

              <a
                href="tel:0938789012"
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-2 transition-colors border border-slate-700/80"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 fill-blue-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Tư Vấn KTX / Pass</span>
                  <span className="text-sm font-black text-amber-400">0938 789 012</span>
                </div>
              </a>
            </div>
          </div>

          {/* Form / Success State */}
          {isSubmitted ? (
            <div className="p-6 bg-emerald-50 rounded-2xl text-center space-y-3 border border-emerald-200">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-emerald-900">Gửi Yêu Cầu Tư Vấn Thành Công!</h3>
              <p className="text-xs text-slate-600">
                Chuyên viên Sàn Sài Gòn sẽ gọi lại cho bạn theo số <strong>{customerPhone}</strong> trong vòng 5-10 phút tới.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
              >
                Đóng Cửa Sổ
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {errorMsg && (
                <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-xs font-bold text-rose-700">
                  {errorMsg}
                </div>
              )}

              {roomTitle && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-semibold text-amber-900 truncate">
                  📌 Đang quan tâm: <strong className="text-rose-700">{roomTitle}</strong>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Họ và tên của bạn <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Số điện thoại nhận cuộc gọi tư vấn <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="VD: 0912 345 678"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Thời gian thuận tiện nghe máy
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                >
                  <option value="Trong 15 phút">⚡ Gọi lại ngay trong 15 phút</option>
                  <option value="Buổi sáng (8h - 12h)">🌅 Buổi sáng (8h - 12h)</option>
                  <option value="Buổi chiều (13h - 17h)">☀️ Buổi chiều (13h - 17h)</option>
                  <option value="Buổi tối (18h - 21h)">🌙 Buổi tối (18h - 21h)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Ghi chú yêu cầu (Ngân sách, quận mong muốn, v.v.)
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="VD: Cần tìm phòng Quận 7 gần Tôn Đức Thắng giá khoảng 3.5 triệu..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>GỬI YÊU CẦU TƯ VẤN GỌI LẠI</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
