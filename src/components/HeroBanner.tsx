import React from 'react';
import { Search, MapPin, DollarSign, Filter, RefreshCw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { FilterState, ListingType, RoomStatus } from '../types';
import { SAIGON_DISTRICTS } from '../data/mockListings';

interface HeroBannerProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  totalAllCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalFilteredCount,
  totalAllCount
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient background blur lights */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-rose-300 text-xs font-bold border border-white/15 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kênh Cập Nhật Phòng Trống Chính Thức Từ San Sài gòn</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Danh Sách Phòng Trọ, KTX & Pass Phòng <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-amber-200">Cập Nhật Trực Tiếp</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium">
            San Sài Gòn tổng hợp & cập nhật số lượng phòng còn trống liên tục, thông tin chính xác, hỗ trợ xem phòng trực tiếp miễn phí.
          </p>
        </div>

        {/* Main Search Filter Box */}
        <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-100 max-w-5xl mx-auto">
          
          {/* Row 1: Search input + District Select */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
            
            {/* Search Input */}
            <div className="md:col-span-7 relative">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Địa chỉ / Từ khóa / Tên đại học
              </label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                  placeholder="Nhập địa chỉ (vd: Điện Biên Phủ, Lý Thường Kiệt, HUTECH, Bách Khoa...)"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                />
                {filters.searchQuery && (
                  <button
                    onClick={() => onFilterChange({ searchQuery: '' })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>

            {/* District Select */}
            <div className="md:col-span-5 relative">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Khu vực (Quận / Huyện TP.HCM)
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500" />
                <select
                  value={filters.district}
                  onChange={(e) => onFilterChange({ district: e.target.value })}
                  className="w-full pl-11 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                >
                  {SAIGON_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d === 'Tất cả khu vực' ? '📍 Tất cả quận/huyện Sài Gòn' : `Quận/Huyện: ${d}`}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Status Filter & Quick Budget Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-3 border-t border-slate-100 items-center">
            
            {/* Status Filter */}
            <div className="lg:col-span-5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tình trạng phòng
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'con-trong', label: '🟢 Còn trống' },
                  { value: 'sap-trong', label: '🟡 Sắp trống' },
                  { value: 'trong-1-2-giuong', label: '🔵 Còn giường KTX' }
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => onFilterChange({ status: s.value as RoomStatus | 'all' })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      filters.status === s.value
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Price Ranges */}
            <div className="lg:col-span-7">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Mức giá thuê (VNĐ/Tháng)
                </label>
                <span className="text-xs font-bold text-rose-600">
                  {filters.priceRange[0] === 0 && filters.priceRange[1] >= 10000000
                    ? 'Tất cả mức giá'
                    : `${(filters.priceRange[0] / 1000000).toFixed(1)}Tr - ${(filters.priceRange[1] / 1000000).toFixed(1)}Tr/Tháng`}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Tất cả giá', range: [0, 15000000] as [number, number] },
                  { label: 'Dưới 2 triệu', range: [0, 2000000] as [number, number] },
                  { label: '2 - 4 triệu', range: [2000000, 4000000] as [number, number] },
                  { label: '4 - 7 triệu', range: [4000000, 7000000] as [number, number] },
                  { label: 'Trên 7 triệu', range: [7000000, 20000000] as [number, number] },
                ].map((p, idx) => {
                  const isSelected =
                    filters.priceRange[0] === p.range[0] && filters.priceRange[1] === p.range[1];
                  return (
                    <button
                      key={idx}
                      onClick={() => onFilterChange({ priceRange: p.range })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Results Stats & Reset Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tìm thấy <strong className="text-rose-600 font-extrabold text-sm">{totalFilteredCount}</strong> phòng phù hợp tiêu chí (Tổng {totalAllCount} phòng)</span>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer font-semibold select-none">
                <input
                  type="checkbox"
                  checked={filters.onlyVerified}
                  onChange={(e) => onFilterChange({ onlyVerified: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span>Chỉ phòng đã xác minh</span>
              </label>

              {(filters.searchQuery || filters.district !== 'Tất cả khu vực' || filters.status !== 'all' || filters.type !== 'all' || filters.priceRange[0] !== 0 || filters.priceRange[1] !== 15000000) && (
                <button
                  onClick={onResetFilters}
                  className="flex items-center gap-1 text-slate-500 hover:text-rose-600 font-bold transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Đặt lại bộ lọc</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
