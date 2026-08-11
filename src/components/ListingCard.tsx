import React from 'react';
import { MapPin, Phone, MessageSquare, CheckCircle, Clock, Shield, Sparkles, ArrowUpRight, BedDouble, Expand, Gift } from 'lucide-react';
import { RoomListing, RoomStatus, ListingType } from '../types';

interface ListingCardProps {
  room: RoomListing;
  onSelect: (room: RoomListing) => void;
  onConsult: (room: RoomListing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ room, onSelect, onConsult }) => {

  // Format currency nicely (e.g. 3.500.000 đ/tháng or 1.650.000 đ/tháng)
  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Status Badge Rendering
  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case 'con-trong':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Còn Trống
          </span>
        );
      case 'sap-trong':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
            <Clock className="w-3 h-3" />
            Sắp Trống {room.availableFrom ? `(${room.availableFrom})` : ''}
          </span>
        );
      case 'trong-1-2-giuong':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
            <BedDouble className="w-3 h-3" />
            Trống 1-2 Giường
          </span>
        );
      case 'da-thue':
        return (
          <span className="inline-flex items-center gap-1 bg-slate-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
            Đã Cho Thuê
          </span>
        );
      default:
        return null;
    }
  };

  // Category Badge Rendering
  const getTypeBadge = (type: ListingType) => {
    switch (type) {
      case 'phong-tro':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-md border border-blue-200">Phòng Trọ</span>;
      case 'ky-tuc-xa':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-md border border-emerald-200">Ký Túc Xá</span>;
      case 'phong-pass':
        return <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-md border border-amber-200">Phòng Pass</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1">
      
      <div>
        {/* Image Thumbnail Container */}
        <div className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelect(room)}>
          <img
            src={room.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'}
            alt={room.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <div className="flex items-center gap-1.5 flex-wrap">
              {getTypeBadge(room.type)}
              {room.isVerified && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                  <CheckCircle className="w-3 h-3" />
                  Xác minh
                </span>
              )}
            </div>

            {getStatusBadge(room.status)}
          </div>

          {/* Bottom Floating Price & Area Highlight */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white shadow-lg">
              <span className="text-[10px] uppercase font-bold text-slate-300 block leading-tight">Giá thuê</span>
              <span className="text-lg font-black text-amber-400">
                {formatVND(room.price)} <span className="text-xs font-normal text-white">đ/tháng</span>
              </span>
            </div>

            <div className="bg-white/90 backdrop-blur-md text-slate-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-md">
              {room.area} m²
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          
          {/* Prominent Address / Location Tag */}
          <div className="flex items-start gap-1.5 text-rose-600 font-extrabold text-xs mb-1.5">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="line-clamp-1 text-slate-800">
              <strong className="text-rose-600 font-extrabold">{room.district}</strong> — {room.address}
            </span>
          </div>

          {/* Room Title */}
          <h3 
            onClick={() => onSelect(room)}
            className="text-base font-bold text-slate-900 line-clamp-2 hover:text-rose-600 cursor-pointer transition-colors leading-snug mb-2"
            title={room.title}
          >
            {room.title}
          </h3>

          {/* Deposit Support Badge (If available, e.g. for Pass phòng) */}
          {room.depositSupport && (
            <div className="mb-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-[11px] font-black px-2.5 py-1 rounded-xl flex items-center justify-between shadow-xs border border-emerald-500/30">
              <div className="flex items-center gap-1.5 min-w-0">
                <Gift className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
                <span className="truncate">Hỗ trợ cọc: <strong className="text-amber-300">{room.depositSupport}</strong></span>
              </div>
              <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded uppercase shrink-0 ml-1">Ưu đãi</span>
            </div>
          )}

          {/* Key Amenities Pills & Available Rooms count */}
          <div className="flex items-center justify-between gap-1.5 mb-2.5">
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Số lượng trống: <strong className="text-rose-600 font-black">{room.availableRooms ?? (room.status === 'da-thue' ? 0 : 1)} phòng</strong>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Cọc: {formatVND(room.deposit)}đ
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {room.amenities.slice(0, 3).map((a, i) => (
              <span key={i} className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md">
                {a}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-[11px] font-semibold text-slate-400">
                +{room.amenities.length - 3} tiện ích
              </span>
            )}
          </div>

          {/* Owner / Contact Name */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 mb-3">
            <span className="truncate max-w-[200px] font-semibold text-slate-800">
              Đăng bởi: {room.contactName}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">{room.createdAt}</span>
          </div>

        </div>
      </div>

      {/* Card Footer Action Buttons */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        
        {/* Detail Button */}
        <button
          onClick={() => onSelect(room)}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
        >
          <span>Xem Chi Tiết</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {/* Direct Call / Contact Hotline Button */}
        <a
          href={`tel:${room.phone}`}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1 shadow-sm transition-all active:scale-98"
          onClick={(e) => {
            // Optional trigger consultation modal or call direct
          }}
        >
          <Phone className="w-3.5 h-3.5 fill-white" />
          <span>{room.phone}</span>
        </a>

      </div>

    </div>
  );
};
