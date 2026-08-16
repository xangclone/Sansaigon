export type ListingType = 'phong-tro' | 'ky-tuc-xa' | 'phong-pass';

export type RoomStatus = 'con-trong' | 'sap-trong' | 'trong-1-2-giuong' | 'da-thue';

export interface RoomListing {
  id: string;
  title: string;
  type: ListingType;
  status: RoomStatus;
  price: number; // in VND
  deposit: number; // in VND
  area: number; // m2
  address: string;
  district: string;
  ward?: string;
  images: string[];
  phone: string;
  zalo?: string;
  contactName: string;
  description: string;
  amenities: string[];
  electricityPrice: string;
  waterPrice: string;
  internetPrice?: string;
  parkingPrice?: string;
  createdAt: string;
  availableFrom?: string;
  availableRooms?: number; // Số lượng phòng còn trống
  depositSupport?: string; // Hỗ trợ tiền cọc (dành cho phòng pass hoặc ưu đãi cọc)
  isVerified?: boolean;
  isFeatured?: boolean;
  isMock?: boolean;
  googleSheetRowId?: string | number;
}

export interface FilterState {
  searchQuery: string;
  district: string;
  type: ListingType | 'all';
  status: RoomStatus | 'all';
  priceRange: [number, number]; // [min, max]
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'area-desc';
  amenities: string[];
  onlyVerified: boolean;
}

export interface GoogleSheetSyncConfig {
  sheetUrl: string;
  appsScriptEndpoint: string;
  autoSync: boolean;
  lastSyncedAt?: string;
}

export interface ContactSettings {
  bookingPhone: string;
  enablePhone: boolean;
  zaloPhone: string;
  enableZalo: boolean;
  bookingEmail: string;
  enableEmail: boolean;
  fanpageUrl: string;
  enableFanpage: boolean;
}

export interface QuickConsultationForm {
  listingId?: string;
  listingTitle?: string;
  customerName: string;
  customerPhone: string;
  note: string;
  preferredTime: string;
}
