import React, { useState } from 'react';
import { X, MapPin, Phone, MessageCircle, ShieldCheck, CheckCircle2, Calendar, DollarSign, Home, UserCheck, Zap, Droplet, Wifi, Car, Send, Copy, ExternalLink, Sparkles, Gift, Facebook } from 'lucide-react';
import { RoomListing, ContactSettings } from '../types';

interface ListingDetailModalProps {
  room: RoomListing | null;
  onClose: () => void;
  onRequestConsultation?: (room: RoomListing) => void;
  contactSettings?: ContactSettings;
  bookingPhone?: string;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  room,
  onClose,
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
  if (!room) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const displayPhone = bookingPhone || contactSettings.bookingPhone || '0908 123 456';
  const contactPhone = room.phone || displayPhone;
  const enablePhone = contactSettings.enablePhone ?? true;
  const zaloPhone = room.zalo || contactSettings.zaloPhone || contactPhone;
  const enableZalo = contactSettings.enableZalo ?? true;
  const fanpageUrl = contactSettings.fanpageUrl || 'https://facebook.com/sansaigon.vn';
  const enableFanpage = contactSettings.enableFanpage ?? true;

  const phoneClean = contactPhone.replace(/\s+/g, '');
  const zaloClean = zaloPhone.replace(/\s+/g, '');

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(room.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        
        {/* Close Button Header */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-h-[90vh] overflow-y-auto">
          
          {/* Main Photo Gallery Slider */}
          <div className="relative bg-slate-950 aspect-16/9 sm:aspect-21/9 max-h-[420px]">
            <img
              src={room.images[activeImageIndex] || room.images[0]}
              alt={room.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain sm:object-cover"
            />

            {/* Thumbnail Switchers */}
            {room.images.length > 1 && (
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 overflow-x-auto p-1 bg-slate-950/60 backdrop-blur-md rounded-xl max-w-fit mx-auto">
                {room.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? 'border-rose-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Modal Content Details */}
          <div className="p-6 sm:p-8">
            
            {/* Top Info Tags & Available Rooms Banner */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-rose-100 text-rose-800 font-bold text-xs px-3 py-1 rounded-full border border-rose-200">
                {room.type === 'phong-tro' ? '🏢 Phòng Trọ' : room.type === 'ky-tuc-xa' ? '👥 Ký Túc Xá' : '🔄 Phòng Pass'}
              </span>

              <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
                Tình trạng: {room.status === 'con-trong' ? 'Còn trống' : room.status === 'sap-trong' ? 'Sắp trống' : room.status === 'trong-1-2-giuong' ? 'Trống 1-2 giường' : 'Đã thuê'}
              </span>

              {room.isVerified && (
                <span className="bg-blue-100 text-blue-800 font-bold text-xs px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Địa chỉ chính chủ
                </span>
              )}
            </div>

            {/* Prominent Available Rooms Count Badge */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
                <span className="text-sm font-black text-amber-950">
                  🔥 Số lượng phòng còn trống: <span className="text-rose-600 text-base underline decoration-rose-400">{room.availableRooms ?? (room.status === 'da-thue' ? 0 : 1)} phòng</span>
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                Chuyên viên San Sài gòn hỗ trợ xem phòng miễn phí
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-3">
              {room.title}
            </h1>

            {/* Prominent Address & Map Link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-6">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 block">{room.district} — {room.ward || 'TP.HCM'}</span>
                  <span className="text-slate-600 font-medium text-xs sm:text-sm">{room.address}</span>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-100 transition-colors shrink-0"
              >
                <span>Xem trên Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Deposit Support Banner (If available) */}
            {room.depositSupport && (
              <div className="mb-6 p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl shadow-md border border-emerald-500/30 flex items-center gap-3.5">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md shrink-0 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-amber-300 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider block">Ưu Đãi Hỗ Trợ Tiền Cọc (Pass Phòng)</span>
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded uppercase">Hot</span>
                  </div>
                  <span className="text-base sm:text-lg font-black text-white block mt-0.5">{room.depositSupport}</span>
                  <p className="text-[11px] text-emerald-100 font-medium mt-0.5">Hỗ trợ trực tiếp cho người thuê lại khi nhận sang nhượng phòng pass.</p>
                </div>
              </div>
            )}

            {/* Price & Primary Specs Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-900 text-white rounded-2xl mb-6">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">Giá thuê niêm yết</span>
                <span className="text-xl font-extrabold text-amber-400">{formatVND(room.price)} đ</span>
                <span className="text-[10px] text-slate-300 block">/tháng</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">Tiền cọc</span>
                <span className="text-base font-extrabold text-slate-100">{formatVND(room.deposit)} đ</span>
                <span className="text-[10px] text-slate-300 block">Hoàn trả khi hết HĐ</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">Diện tích sử dụng</span>
                <span className="text-base font-extrabold text-slate-100">{room.area} m²</span>
                <span className="text-[10px] text-slate-300 block">Thoáng mát</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">Cung cấp bởi</span>
                <span className="text-base font-extrabold text-emerald-400 truncate block">San Sài gòn</span>
                <span className="text-[10px] text-slate-300 block">Cập nhật: {room.createdAt}</span>
              </div>
            </div>

            {/* Monthly Utility Rates (Điện, Nước, Xe, Wifi) */}
            <div className="mb-6">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                 Chi Phí Dịch Vụ Hàng Tháng
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>Giá Điện</span>
                  </div>
                  <span className="font-extrabold text-slate-800 text-sm">{room.electricityPrice}</span>
                </div>

                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200/80">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                    <Droplet className="w-4 h-4 text-blue-600" />
                    <span>Giá Nước</span>
                  </div>
                  <span className="font-extrabold text-slate-800 text-sm">{room.waterPrice}</span>
                </div>

                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200/80">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
                    <Wifi className="w-4 h-4 text-indigo-600" />
                    <span>Internet/Wifi</span>
                  </div>
                  <span className="font-extrabold text-slate-800 text-sm">{room.internetPrice || '100.000 đ/phòng'}</span>
                </div>

                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                    <Car className="w-4 h-4 text-slate-700" />
                    <span>Phí Giữ Xe</span>
                  </div>
                  <span className="font-extrabold text-slate-800 text-sm">{room.parkingPrice || 'Miễn phí'}</span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-6">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                 Mô Tả Chi Tiết Phòng
              </h2>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {room.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="mb-6">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                 Tiện Ích Tòa Nhà & Phòng
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {room.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-800 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact CTA Section */}
            <div className="sticky bottom-0 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 border border-slate-800">
              
              <div className="text-center sm:text-left">
                <span className="text-xs text-amber-400 font-extrabold uppercase tracking-wider block mb-1">
                  ⭐ TƯ VẤN VIÊN SAN SÀI GÒN & CHÍNH CHỦ
                </span>
                <p className="text-xs text-slate-300 font-medium">
                  {enablePhone ? (
                    <>Liên hệ xem phòng theo Hotline: <strong className="text-amber-400 font-bold">{contactPhone}</strong></>
                  ) : (
                    <>Liên hệ xem phòng trực tiếp qua Zalo hoặc Fanpage</>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                {enablePhone && (
                  <a
                    href={`tel:${phoneClean}`}
                    className="flex-1 sm:flex-initial px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
                  >
                    <Phone className="w-4 h-4 fill-white" />
                    <span>GỌI LIÊN HỆ</span>
                  </a>
                )}

                {enableZalo && (
                  <a
                    href={`https://zalo.me/${zaloClean}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>CHAT ZALO</span>
                  </a>
                )}

                {enableFanpage && (
                  <a
                    href={fanpageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
                  >
                    <Facebook className="w-4 h-4 fill-white" />
                    <span>FANPAGE</span>
                  </a>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
