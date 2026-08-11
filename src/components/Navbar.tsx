import React from 'react';
import { Home, Building2, Users, ArrowRightLeft, PlusCircle, FileSpreadsheet, PhoneCall, Sparkles, ShieldCheck } from 'lucide-react';
import { ListingType } from '../types';

interface NavbarProps {
  activeType: ListingType | 'all';
  onSelectType: (type: ListingType | 'all') => void;
  onOpenAddModal: () => void;
  onOpenSheetModal: () => void;
  onOpenAdminModal: () => void;
  onOpenConsultationModal: (title?: string) => void;
  totalListingsCount: number;
  bookingPhone?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeType,
  onSelectType,
  onOpenAddModal,
  onOpenSheetModal,
  onOpenAdminModal,
  onOpenConsultationModal,
  totalListingsCount,
  bookingPhone = '0908 123 456',
}) => {
  const phoneClean = bookingPhone.replace(/\s+/g, '');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onSelectType('all')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <img 
              src="/avatar.svg" 
              alt="San Sài gòn Avatar Logo" 
              className="w-11 h-11 rounded-full border-2 border-amber-400 shadow-md group-hover:scale-105 transition-transform object-cover bg-slate-950"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">SAN SÀI GÒN</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-1.5 py-0.5 rounded border border-amber-300">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">Phòng Trọ • Ký Túc Xá • Pass Phòng</p>
            </div>
          </div>

          {/* Quick Category Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => onSelectType('all')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeType === 'all'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Tất cả</span>
            </button>

            <button
              onClick={() => onSelectType('phong-tro')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeType === 'phong-tro'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Building2 className="w-4 h-4 text-blue-500" />
              <span>Phòng Trọ</span>
            </button>

            <button
              onClick={() => onSelectType('ky-tuc-xa')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeType === 'ky-tuc-xa'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-500" />
              <span>Ký Túc Xá</span>
            </button>

            <button
              onClick={() => onSelectType('phong-pass')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeType === 'phong-pass'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 text-amber-500" />
              <span>Phòng Pass</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center">
          </div>

        </div>

        {/* Mobile Category Scrollbar */}
        <div className="flex lg:hidden items-center gap-2 mt-3 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onSelectType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeType === 'all'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => onSelectType('phong-tro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeType === 'phong-tro'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Phòng Trọ
          </button>
          <button
            onClick={() => onSelectType('ky-tuc-xa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeType === 'ky-tuc-xa'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Ký Túc Xá
          </button>
          <button
            onClick={() => onSelectType('phong-pass')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeType === 'phong-pass'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Phòng Pass
          </button>
        </div>
      </div>
    </header>
  );
};
