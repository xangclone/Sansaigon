import React, { useState } from 'react';
import { Phone, MessageCircle, X, CheckCircle2, Copy, Facebook } from 'lucide-react';
import { ContactSettings } from '../types';

interface FloatingContactWidgetProps {
  onOpenAdminModal: () => void;
  contactSettings?: ContactSettings;
  bookingPhone?: string;
}

export const FloatingContactWidget: React.FC<FloatingContactWidgetProps> = ({
  contactSettings = {
    bookingPhone: '0908 123 456',
    enablePhone: true,
    zaloPhone: '0908 123 456',
    enableZalo: true,
    bookingEmail: 'booking@sansaigon.vn',
    enableEmail: true,
    fanpageUrl: 'https://facebook.com/sansaigon.vn',
    enableFanpage: true,
  },
  bookingPhone,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const displayPhone = bookingPhone || contactSettings.bookingPhone || '0908 123 456';
  const enablePhone = contactSettings.enablePhone ?? true;
  const zaloPhone = contactSettings.zaloPhone || displayPhone;
  const enableZalo = contactSettings.enableZalo ?? true;
  const fanpageUrl = contactSettings.fanpageUrl || 'https://facebook.com/sansaigon.vn';
  const enableFanpage = contactSettings.enableFanpage ?? true;

  const phoneClean = displayPhone.replace(/\s+/g, '');
  const zaloClean = zaloPhone.replace(/\s+/g, '');

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phoneClean);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const hasAnyContact = enablePhone || enableZalo || enableFanpage;

  if (!hasAnyContact) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      
      {/* Expandable Speed-Dial Popup Menu */}
      {isOpen && (
        <div className="mb-3 w-80 max-w-[calc(100vw-2.5rem)] bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-700/80 animate-fade-in transition-all">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2.5">
              <img 
                src="/avatar.svg" 
                alt="San Sài gòn Avatar" 
                className="w-9 h-9 rounded-full border-2 border-amber-400 object-cover bg-slate-950"
              />
              <div>
                <h4 className="text-sm font-black tracking-tight text-white">LIÊN HỆ TƯ VẤN KHANH</h4>
                <p className="text-[11px] text-amber-400 font-medium">Sàn Sài Gòn — Hỗ trợ 24/7</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Phone Display with Copy (Only if Phone Enabled) */}
          {enablePhone && (
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 mb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Hotline Trực Tiếp</span>
                <span className="text-lg font-black text-amber-400 tracking-wide">{displayPhone}</span>
              </div>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedPhone ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Contact Actions Grid */}
          <div className="space-y-2">
            
            {/* Direct Call Button */}
            {enablePhone && (
              <a
                href={`tel:${phoneClean}`}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>GỌI NGAY CHO TƯ VẤN VIÊN</span>
              </a>
            )}

            {/* Zalo Chat Button */}
            {enableZalo && (
              <a
                href={`https://zalo.me/${zaloClean}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>CHAT QUA ZALO</span>
              </a>
            )}

            {/* Fanpage Facebook Button */}
            {enableFanpage && (
              <a
                href={fanpageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
              >
                <Facebook className="w-4 h-4 fill-white" />
                <span>GHÉ FANPAGE FACEBOOK</span>
              </a>
            )}

          </div>

        </div>
      )}

      {/* Main Floating Round Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-emerald-300/40"
        title="Liên hệ tư vấn xem phòng"
      >
        {/* Pulsing Outer Ping Ring */}
        <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60 pointer-events-none" />

        {/* Dynamic Icon */}
        {isOpen ? (
          <X className="w-7 h-7 text-white relative z-10 transition-transform duration-300" />
        ) : (
          <div className="relative z-10 flex items-center justify-center">
            <Phone className="w-7 h-7 text-white fill-white animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
            </span>
          </div>
        )}
      </button>

      {/* Label Tooltip below or left when closed */}
      {!isOpen && (
        <span className="mt-1 bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md text-center pointer-events-none border border-slate-700">
          Liên hệ ngay
        </span>
      )}

    </div>
  );
};
