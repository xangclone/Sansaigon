import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { AddListingModal } from './components/AddListingModal';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { ConsultationModal } from './components/ConsultationModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AdminPage } from './components/AdminPage';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { Footer } from './components/Footer';
import { RoomListing, FilterState, ListingType, RoomStatus, ContactSettings } from './types';
import { INITIAL_ROOMS } from './data/mockListings';
import { apiFetch } from './utils/apiClient';
import { Building2, Users, ArrowRightLeft, Sparkles, Filter, SlidersHorizontal, MapPin, RefreshCw, AlertCircle, FileSpreadsheet } from 'lucide-react';

export default function App() {
  const [rooms, setRooms] = useState<RoomListing[]>([]);
  const [loading, setLoading] = useState(true);

  // View Mode: 'client' | 'admin'
  const [viewMode, setViewMode] = useState<'client' | 'admin'>('client');

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    district: 'Tất cả khu vực',
    type: 'all',
    status: 'all',
    priceRange: [0, 20000000],
    sortBy: 'newest',
    amenities: [],
    onlyVerified: false,
  });

  // Modal States
  const [selectedRoom, setSelectedRoom] = useState<RoomListing | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [consultationRoomTitle, setConsultationRoomTitle] = useState<string | undefined>(undefined);
  const [consultationRoomId, setConsultationRoomId] = useState<string | undefined>(undefined);

  const [adminSecretPath, setAdminSecretPath] = useState('quan-tri-bao-mat-2026');

  // App Settings State (Admin Configured Hotline, Zalo, Email & Fanpage)
  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    bookingPhone: '0908 123 456',
    enablePhone: true,
    zaloPhone: '0908 123 456',
    enableZalo: true,
    bookingEmail: 'booking@sansaigon.vn',
    enableEmail: true,
    fanpageUrl: 'https://facebook.com/sansaigon.vn',
    enableFanpage: true,
  });

  // Fetch rooms from Express backend API or LocalStorage
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/rooms');
      if (data && data.success && Array.isArray(data.rooms)) {
        setRooms(data.rooms);
      }
    } catch (err) {
      console.warn('API backend error, fallback to empty array:', err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const data = await apiFetch('/api/settings');
      if (data && data.success && data.settings) {
        if (data.settings.adminSecretPath) {
          setAdminSecretPath(data.settings.adminSecretPath);
        }
        setContactSettings({
          bookingPhone: data.settings.bookingPhone || '0908 123 456',
          enablePhone: data.settings.enablePhone ?? true,
          zaloPhone: data.settings.zaloPhone || data.settings.bookingPhone || '0908 123 456',
          enableZalo: data.settings.enableZalo ?? true,
          bookingEmail: data.settings.bookingEmail || 'booking@sansaigon.vn',
          enableEmail: data.settings.enableEmail ?? true,
          fanpageUrl: data.settings.fanpageUrl || 'https://facebook.com/sansaigon.vn',
          enableFanpage: data.settings.enableFanpage ?? true,
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchSettings();
    // Track site visit for analytics
    apiFetch('/api/analytics/visit', { method: 'POST' }).catch(() => {});
  }, []);

  // Track room detail view when selectedRoom changes
  useEffect(() => {
    if (selectedRoom?.id) {
      apiFetch(`/api/rooms/${selectedRoom.id}/view`, { method: 'POST' }).catch(() => {});
    }
  }, [selectedRoom?.id]);

  // Handle route for Admin page access using Secret Link (e.g., /quan-tri-bao-mat-2026, /#quan-tri-bao-mat-2026 or ?admin_secret=...)
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
      const hash = window.location.hash.toLowerCase().replace(/^#+/, '');
      const search = window.location.search.toLowerCase();
      const cleanSecret = (adminSecretPath || 'quan-tri-bao-mat-2026').toLowerCase().replace(/^\/+|\/+$/g, '');

      // Check if URL matches secret path, hash, or query parameter
      const isMatch =
        (cleanSecret && (
          path === cleanSecret ||
          path.endsWith(`/${cleanSecret}`) ||
          hash === cleanSecret ||
          search.includes(`admin_secret=${cleanSecret}`) ||
          search.includes(cleanSecret)
        )) ||
        path === 'quan-tri-bao-mat-2026' ||
        path.includes('quan-tri-bao-mat-2026') ||
        hash === 'quan-tri-bao-mat-2026' ||
        hash.includes('quan-tri-bao-mat-2026') ||
        path === 'admin' ||
        hash === 'admin';

      if (isMatch) {
        setViewMode('admin');
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);

    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, [adminSecretPath]);

  // Filter Update Handler
  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      district: 'Tất cả khu vực',
      type: 'all',
      status: 'all',
      priceRange: [0, 20000000],
      sortBy: 'newest',
      amenities: [],
      onlyVerified: false,
    });
  };

  // Filtered & Sorted Rooms Logic
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = room.title.toLowerCase().includes(query);
        const matchesAddress = room.address.toLowerCase().includes(query);
        const matchesDistrict = room.district.toLowerCase().includes(query);
        const matchesDesc = room.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAddress && !matchesDistrict && !matchesDesc) {
          return false;
        }
      }

      // 2. District Filter
      if (filters.district !== 'Tất cả khu vực' && room.district !== filters.district) {
        return false;
      }

      // 3. Category Type
      if (filters.type !== 'all' && room.type !== filters.type) {
        return false;
      }

      // 4. Status
      if (filters.status !== 'all' && room.status !== filters.status) {
        return false;
      }

      // 5. Price Range
      if (room.price < filters.priceRange[0] || room.price > filters.priceRange[1]) {
        return false;
      }

      // 6. Only Verified
      if (filters.onlyVerified && !room.isVerified) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'area-desc':
          return b.area - a.area;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [rooms, filters]);

  // Create Room Handler
  const handleAddRoom = async (newRoomData: Partial<RoomListing>) => {
    try {
      const data = await apiFetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoomData),
      });
      if (data && data.success && data.room) {
        setRooms((prev) => [data.room, ...prev]);
        return true;
      }
    } catch (err) {
      console.error('Error adding room:', err);
    }
    return false;
  };

  const handleOpenConsultation = (title?: string, id?: string) => {
    setConsultationRoomTitle(title);
    setConsultationRoomId(id);
    setIsConsultationModalOpen(true);
  };

  if (viewMode === 'admin') {
    return (
      <AdminPage
        onBackToClient={() => {
          setViewMode('client');
          if (window.location.hash) {
            window.location.hash = '';
          }
          if (window.location.pathname !== '/' || window.location.search) {
            window.history.pushState({}, '', '/');
          }
        }}
        rooms={rooms}
        onRefreshRooms={() => {
          fetchRooms();
          fetchSettings();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      
      {/* Header Navigation */}
      <Navbar
        activeType={filters.type}
        onSelectType={(t) => handleFilterChange({ type: t })}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
        onOpenAdminModal={() => setViewMode('admin')}
        onOpenConsultationModal={(title) => handleOpenConsultation(title)}
        totalListingsCount={rooms.length}
        bookingPhone={contactSettings.bookingPhone}
      />

      {/* Main Search & Hero Filter Banner */}
      <HeroBanner
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalFilteredCount={filteredRooms.length}
        totalAllCount={rooms.length}
      />

      {/* Category Pills Quick Select */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight text-slate-900">
              {filters.type === 'all'
                ? 'Danh Sách Phòng Trọ, KTX, Pass Phòng Sài Gòn'
                : filters.type === 'phong-tro'
                ? '🏢 Danh Sách Phòng Trọ Cho Thuê'
                : filters.type === 'ky-tuc-xa'
                ? '👥 Ký Túc Xá & Sleepbox Nam/Nữ'
                : '🔄 Phòng Pass Nhượng Lại Hợp Đồng'}
            </h2>
            <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {filteredRooms.length} kết quả
            </span>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs font-bold text-slate-500 uppercase">Sắp xếp:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs outline-none cursor-pointer"
            >
              <option value="newest">🔥 Mới nhất lên đầu</option>
              <option value="price-asc">💵 Giá từ thấp đến cao</option>
              <option value="price-desc">💎 Giá từ cao đến thấp</option>
              <option value="area-desc">📐 Diện tích rộng nhất</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Grid View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-600">Đang tải dữ liệu phòng trọ Sài Gòn...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Không tìm thấy phòng phù hợp</h3>
            <p className="text-xs text-slate-500 mb-4">
              Thử thay đổi địa chỉ tìm kiếm, mở rộng mức giá hoặc chọn quận/huyện khác.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Đặt Lại Bộ Lọc Tìm Kiếm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRooms.map((room) => (
              <ListingCard
                key={room.id}
                room={room}
                onSelect={(r) => setSelectedRoom(r)}
                onConsult={(r) => handleOpenConsultation(r.title, r.id)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Modals */}
      <ListingDetailModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        contactSettings={contactSettings}
      />

      <AddListingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRoom={handleAddRoom}
      />

      <GoogleSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        totalRoomsCount={rooms.length}
      />

      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          fetchSettings();
        }}
        rooms={rooms}
        onRefreshRooms={() => {
          fetchRooms();
          fetchSettings();
        }}
      />

      {/* Floating Circular Contact Widget (Bottom Right) */}
      <FloatingContactWidget
        onOpenAdminModal={() => setViewMode('admin')}
        contactSettings={contactSettings}
      />

      {/* Footer */}
      <Footer
        onSelectDistrict={(d) => handleFilterChange({ district: d })}
        onOpenAdminModal={() => setViewMode('admin')}
        contactSettings={contactSettings}
      />

    </div>
  );
}
