import React, { useState } from 'react';
import { Plus, X, Sparkles, Check } from 'lucide-react';

export const PRESET_AMENITIES = [
  { name: 'Máy lạnh', icon: '❄️' },
  { name: 'Tủ lạnh', icon: '🧊' },
  { name: 'Máy giặt', icon: '🧺' },
  { name: 'Ban công', icon: '🌅' },
  { name: 'Thang máy', icon: '🛗' },
  { name: 'WC riêng', icon: '🚿' },
  { name: 'Bãi xe riêng', icon: '🛵' },
  { name: 'Giờ giấc tự do', icon: '🔑' },
  { name: 'Không chung chủ', icon: '🚪' },
  { name: 'Bếp riêng', icon: '🍳' },
  { name: 'Gác xép / Gác đúc', icon: '🛏️' },
  { name: 'Nội thất cơ bản', icon: '🛋️' },
  { name: 'Bình nóng lạnh', icon: '🔥' },
  { name: 'Khóa vân tay / An ninh 24/7', icon: '🔒' },
  { name: 'Cho nuôi thú cưng', icon: '🐶' },
  { name: 'Wifi tốc độ cao', icon: '🌐' },
  { name: 'Dọn phòng miễn phí', icon: '🧹' },
  { name: 'Sân phơi rộng', icon: '☀️' },
];

interface AmenitySelectorProps {
  selectedAmenities: string[];
  onChange: (amenities: string[]) => void;
}

export const AmenitySelector: React.FC<AmenitySelectorProps> = ({
  selectedAmenities,
  onChange,
}) => {
  const [customInput, setCustomInput] = useState('');

  const toggleAmenity = (name: string) => {
    if (selectedAmenities.includes(name)) {
      onChange(selectedAmenities.filter((a) => a !== name));
    } else {
      onChange([...selectedAmenities, name]);
    }
  };

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;

    if (!selectedAmenities.includes(trimmed)) {
      onChange([...selectedAmenities, trimmed]);
    }
    setCustomInput('');
  };

  const removeAmenity = (name: string) => {
    onChange(selectedAmenities.filter((a) => a !== name));
  };

  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Tiện ích đi kèm ({selectedAmenities.length} đã chọn)</span>
        </label>
        <span className="text-[11px] text-slate-500 font-medium">
          Gợi ý có sẵn & Nhập thêm tay
        </span>
      </div>

      {/* Preset Suggestions Chips */}
      <div>
        <p className="text-[11px] font-bold text-slate-500 uppercase mb-2">
          💡 Chọn nhanh tiện ích gợi ý:
        </p>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          {PRESET_AMENITIES.map((item) => {
            const isSelected = selectedAmenities.includes(item.name);
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => toggleAmenity(item.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer select-none ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs scale-102'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Amenity Input (Nhập thêm tay) */}
      <div className="pt-3 border-t border-slate-200/80">
        <p className="text-[11px] font-bold text-slate-500 uppercase mb-2">
          ✏️ Nhập thêm tiện ích thủ công (Tùy chỉnh khác):
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustom();
              }
            }}
            placeholder="VD: Lò vi sóng, Bàn học thông minh, Tủ quần áo âm tường..."
            className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            type="button"
            onClick={() => handleAddCustom()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm</span>
          </button>
        </div>
      </div>

      {/* Currently Selected Badges */}
      {selectedAmenities.length > 0 && (
        <div className="pt-3 border-t border-slate-200/80">
          <p className="text-[11px] font-bold text-slate-500 uppercase mb-2">
            Danh sách tiện ích sẽ hiển thị trên bài đăng:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selectedAmenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold px-2.5 py-1 rounded-lg"
              >
                <span>{amenity}</span>
                <button
                  type="button"
                  onClick={() => removeAmenity(amenity)}
                  className="hover:bg-rose-200 p-0.5 rounded-full transition-colors cursor-pointer"
                  title="Xóa tiện ích này"
                >
                  <X className="w-3 h-3 text-rose-700" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
