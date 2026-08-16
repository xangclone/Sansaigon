import React from 'react';
import { Home, PhoneCall, MapPin, Mail, ShieldCheck, MessageCircle, Facebook } from 'lucide-react';
import { ContactSettings } from '../types';

interface FooterProps {
  onSelectDistrict: (district: string) => void;
  onOpenAdminModal?: () => void;
  contactSettings?: ContactSettings;
  bookingPhone?: string;
  bookingEmail?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectDistrict,
  onOpenAdminModal,
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
  bookingEmail,
}) => {
  const displayPhone = bookingPhone || contactSettings.bookingPhone || '0908 123 456';
  const displayEmail = bookingEmail || contactSettings.bookingEmail || 'booking@sansaigon.vn';
  const enablePhone = contactSettings.enablePhone ?? true;
  const zaloPhone = contactSettings.zaloPhone || displayPhone;
  const enableZalo = contactSettings.enableZalo ?? true;
  const enableEmail = contactSettings.enableEmail ?? true;
  const fanpageUrl = contactSettings.fanpageUrl || 'https://facebook.com/sansaigon.vn';
  const enableFanpage = contactSettings.enableFanpage ?? true;

  const phoneClean = displayPhone.replace(/\s+/g, '');
  const zaloClean = zaloPhone.replace(/\s+/g, '');

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img 
                src="/avatar.svg" 
                alt="San Sài gòn Avatar Logo" 
                className="w-11 h-11 rounded-full border-2 border-amber-400 shadow-md object-cover bg-slate-950"
              />
              <div>
                <span className="text-xl font-black text-white tracking-tight">SAN SÀI GÒN</span>
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Hệ thống phòng trọ - KTX - Pass phòng</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Trang thông tin phòng trọ, ký túc xá và pass phòng chính thức từ chuyên viên San Sài gòn. Cập nhật dữ liệu phòng trống thực tế, thông tin minh bạch, địa chỉ rõ ràng và hỗ trợ xem phòng trực tiếp.
            </p>
          </div>

          {/* Quick District Navigation */}
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Phòng Trọ Khu Vực Nổi Bật</span>
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-400">
              {['Bình Thạnh', 'Quận 1', 'Quận 3', 'Quận 7', 'Thủ Đức', 'Tân Bình', 'Quận 10', 'Gò Vấp'].map((d) => (
                <li key={d}>
                  <button
                    onClick={() => onSelectDistrict(d)}
                    className="hover:text-rose-400 transition-colors cursor-pointer text-left"
                  >
                    • Phòng trọ {d}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Category Services */}
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Home className="w-4 h-4 text-amber-400" />
              <span>Loại Hình Cho Thuê</span>
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>• Phòng trọ full nội thất, ban công thoáng mát</li>
              <li>• Ký túc xá cao cấp, Sleepbox giá sinh viên</li>
              <li>• Nhượng phòng pass gấp hợp đồng giá tốt</li>
              <li>• Căn hộ studio dịch vụ an ninh 24/7</li>
            </ul>
          </div>

          {/* Contact Support Hotlines & Email */}
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Thông Tin Booking San Sài gòn</span>
            </h3>
            <div className="space-y-2.5 text-xs">
              {enablePhone && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Hotline Booking</span>
                  <a href={`tel:${phoneClean}`} className="text-lg font-black text-amber-400 hover:underline flex items-center gap-1.5 mt-0.5">
                    <PhoneCall className="w-4 h-4 text-amber-400" />
                    <span>{displayPhone}</span>
                  </a>
                </div>
              )}

              {enableZalo && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Zalo Tư Vấn Trực Tiếp</span>
                  <a href={`https://zalo.me/${zaloClean}`} target="_blank" rel="noopener noreferrer" className="text-xs font-extrabold text-blue-400 hover:underline flex items-center gap-1.5 mt-0.5">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    <span>Chat Zalo ({zaloPhone})</span>
                  </a>
                </div>
              )}

              {enableEmail && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Email Booking & Hỗ Trợ</span>
                  <a href={`mailto:${displayEmail}`} className="text-xs font-extrabold text-emerald-400 hover:underline flex items-center gap-1.5 mt-0.5 truncate">
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{displayEmail}</span>
                  </a>
                </div>
              )}

              {enableFanpage && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Fanpage Facebook Chính Thức</span>
                  <a href={fanpageUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-extrabold text-indigo-400 hover:underline flex items-center gap-1.5 mt-0.5 truncate">
                    <Facebook className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">Facebook San Sài Gòn</span>
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            © 2026 San Sài gòn — Hệ thống đăng tin phòng trọ, KTX, phòng pass Sài Gòn.
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Địa chỉ & Giá cả đã xác minh chính chủ</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
