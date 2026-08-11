import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Plus, Trash2, CheckCircle2, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { RoomListing, ListingType, RoomStatus } from '../types';
import { SAIGON_DISTRICTS } from '../data/mockListings';
import { AmenitySelector } from './AmenitySelector';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoom: (newRoom: Partial<RoomListing>) => Promise<boolean>;
}

export const AddListingModal: React.FC<AddListingModalProps> = ({
  isOpen,
  onClose,
  onAddRoom
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [type, setType] = useState<ListingType>('phong-tro');
  const [status, setStatus] = useState<RoomStatus>('con-trong');
  const [price, setPrice] = useState<number | ''>(3500000);
  const [deposit, setDeposit] = useState<number | ''>(3500000);
  const [depositSupport, setDepositSupport] = useState('');
  const [area, setArea] = useState<number | ''>(25);
  const [availableRooms, setAvailableRooms] = useState<number | ''>(2);
  const [district, setDistrict] = useState('Bình Thạnh');
  const [ward, setWard] = useState('Phường 25');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('Chủ nhà');
  const [phone, setPhone] = useState('0908123456');
  const [description, setDescription] = useState('');
  const [electricityPrice, setElectricityPrice] = useState('3.800 đ/kWh');
  const [waterPrice, setWaterPrice] = useState('100.000 đ/người');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Máy lạnh',
    'Tủ lạnh',
    'Giờ giấc tự do',
    'Không chung chủ'
  ]);

  // Images uploaded list
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle local image file upload & convert to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!title.trim() || !address.trim() || !price) {
      setErrorMessage('⚠️ Vui lòng điền đầy đủ các thông tin bắt buộc: Tiêu đề bài đăng, Địa chỉ và Giá thuê.');
      return;
    }

    const finalPhone = phone.trim() || '0908123456';

    setIsSubmitting(true);

    try {
      const success = await onAddRoom({
        title: title.trim(),
        type,
        status,
        price: Number(price),
        deposit: Number(deposit || price),
        depositSupport: depositSupport || undefined,
        area: Number(area || 20),
        availableRooms: Number(availableRooms || 1),
        district,
        ward,
        address: address.trim(),
        contactName: contactName.trim() || 'Chủ nhà',
        phone: finalPhone,
        zalo: finalPhone,
        description: description || 'Phòng thoáng mát sạch sẽ, an ninh tốt, giờ giấc tự do.',
        electricityPrice,
        waterPrice,
        amenities: selectedAmenities,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'],
        isVerified: true
      });

      if (success) {
        setSuccessMessage('🎉 Đã đăng tin phòng trọ mới thành công vào hệ thống!');
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 1500);
      } else {
        setErrorMessage('❌ Lỗi máy chủ không thể lưu bài đăng. Vui lòng kiểm tra lại kết nối mạng.');
      }
    } catch (err) {
      setErrorMessage('❌ Đã xảy ra lỗi khi lưu bài đăng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white font-extrabold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">ĐĂNG TIN PHÒNG TRỌ / KTX / PASS PHÒNG</h2>
              <p className="text-xs text-slate-300">Nhập thông tin chi tiết phòng trọ để hiển thị lên San Sài gòn & Google Sheets</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
          
          {successMessage && (
            <div className="p-4 bg-emerald-100 text-emerald-900 rounded-2xl font-bold text-sm border border-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-rose-50 text-rose-900 rounded-2xl font-bold text-sm border border-rose-300 flex items-center gap-2 animate-shake">
              <span className="shrink-0">{errorMessage}</span>
            </div>
          )}

          {/* Type & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Loại hình phòng <span className="text-rose-600">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ListingType)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
              >
                <option value="phong-tro">🏢 Phòng Trọ / Cho Thuê Studio</option>
                <option value="ky-tuc-xa">👥 Ký Túc Xá / Giường Tầng / Sleepbox</option>
                <option value="phong-pass">🔄 Phòng Pass (Nhượng Lại Hợp Đồng)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Tình trạng hiện tại <span className="text-rose-600">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RoomStatus)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
              >
                <option value="con-trong">🟢 Còn trống (Ở ngay)</option>
                <option value="sap-trong">🟡 Sắp trống (Dự kiến 5-10 ngày tới)</option>
                <option value="trong-1-2-giuong">🔵 Trống 1-2 giường (KTX)</option>
                <option value="da-thue">🔴 Đã cho thuê</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
              Tiêu đề bài đăng <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Phòng Trọ Full Nội Thất Ban Công Siêu Thoáng Ngay ĐH HUTECH"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          {/* Location / Address */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Quận / Huyện TP.HCM <span className="text-rose-600">*</span>
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
              >
                {SAIGON_DISTRICTS.filter((d) => d !== 'Tất cả khu vực').map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Phường / Xã
              </label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="VD: Phường 25"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Số nhà & Tên đường <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="VD: 475A Điện Biên Phủ"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
              />
            </div>
          </div>

          {/* Price, Deposit, Area & Available Rooms */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Giá thuê (VNĐ/Tháng) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="3500000"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-rose-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Tiền đặt cọc (VNĐ)
              </label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                placeholder="3500000"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Diện tích (m²)
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                placeholder="25"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Số phòng trống <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                min={0}
                required
                value={availableRooms}
                onChange={(e) => setAvailableRooms(Number(e.target.value))}
                placeholder="2"
                className="w-full p-3 bg-amber-50 border border-amber-300 rounded-xl text-sm font-extrabold text-amber-950 outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Deposit Support Field (e.g. for Pass phòng) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase mb-1 flex items-center justify-between">
              <span>🎁 Hỗ trợ tiền cọc (Pass phòng / Ưu đãi cọc)</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Hiển thị nổi bật</span>
            </label>
            <input
              type="text"
              value={depositSupport}
              onChange={(e) => setDepositSupport(e.target.value)}
              placeholder="VD: Hỗ trợ 1.000.000đ tiền cọc, hoặc Tặng 50% cọc"
              className="w-full p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-950 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Owner Phone & Contact Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Tên chủ nhà / Người liên hệ <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="VD: Anh Minh (Chủ nhà) hoặc Bảo (Pass phòng)"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Số điện thoại Zalo / Call <span className="text-rose-600">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="VD: 0908123456"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-emerald-700 outline-none"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 uppercase mb-2 flex items-center justify-between">
              <span>Upload Hình Ảnh Phòng Trọ ({images.length} ảnh)</span>
              <span className="text-slate-500 font-normal text-[11px]">Hỗ trợ file máy tính & link hình ảnh</span>
            </label>

            {/* Upload Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 mb-3">
              <label className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors">
                <Upload className="w-4 h-4" />
                <span>TẢI ẢNH TỪ THIẾT BỊ (ĐIỆN THOẠI / MÁY TÍNH)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">hoặc</span>

              <div className="flex items-center gap-1.5 w-full sm:w-auto flex-1">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Dán URL link hình ảnh (Unsplash, Imgur...)"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shrink-0"
                >
                  Thêm
                </button>
              </div>
            </div>

            {/* Image Preview Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-200/80">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200 bg-slate-200">
                  <img src={img} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                    title="Xóa ảnh này"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
              Mô tả chi tiết phòng
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập chi tiết về nội thất, giờ giấc, lối đi, môi trường xung quanh..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
            />
          </div>

          {/* Amenities Selector (Suggestions + Custom input) */}
          <AmenitySelector
            selectedAmenities={selectedAmenities}
            onChange={setSelectedAmenities}
          />

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 text-slate-600 hover:text-slate-900 font-bold text-sm"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-transform active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang đăng bài...' : 'ĐĂNG TIN PHÒNG NGAY'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
