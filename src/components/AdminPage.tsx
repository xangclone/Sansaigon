import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, FileSpreadsheet, Plus, Trash2, Edit3,
  CheckCircle2, RefreshCw, Phone, User, Building2, Eye, Search, Sparkles, Layers,
  BarChart3, TrendingUp, Smartphone, Monitor, ArrowLeft, Home, Lock, KeyRound, Clock, MessageSquare, Gift, Settings,
  Facebook, MessageCircle, Mail, Globe, Power, AlertTriangle, Copy
} from 'lucide-react';
import { RoomListing, RoomStatus, ListingType } from '../types';
import { SAIGON_DISTRICTS } from '../data/mockListings';
import { AmenitySelector } from './AmenitySelector';

interface AdminPageProps {
  onBackToClient: () => void;
  rooms: RoomListing[];
  onRefreshRooms: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  onBackToClient,
  rooms,
  onRefreshRooms,
}) => {
  // Authentication State
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_token') === 'admin-authorized-token';
  });
  const [loginError, setLoginError] = useState('');

  // Active Tab: 'analytics' | 'listings' | 'edit' | 'consultations' | 'sheets'
  const [activeTab, setActiveTab] = useState<'analytics' | 'listings' | 'edit' | 'consultations' | 'sheets'>('analytics');

  // Search in Admin Panel
  const [adminSearch, setAdminSearch] = useState('');

  // Currently Editing Room (null if creating new)
  const [editingRoom, setEditingRoom] = useState<Partial<RoomListing> | null>(null);

  // Consultations List
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loadingConsultations, setLoadingConsultations] = useState(false);

  // Analytics & Data Settings State
  const [useMockData, setUseMockData] = useState<boolean>(false);
  const [bookingPhone, setBookingPhone] = useState<string>('0908 123 456');
  const [enablePhone, setEnablePhone] = useState<boolean>(true);
  const [zaloPhone, setZaloPhone] = useState<string>('0908 123 456');
  const [enableZalo, setEnableZalo] = useState<boolean>(true);
  const [bookingEmail, setBookingEmail] = useState<string>('booking@sansaigon.vn');
  const [enableEmail, setEnableEmail] = useState<boolean>(true);
  const [fanpageUrl, setFanpageUrl] = useState<string>('https://facebook.com/sansaigon.vn');
  const [enableFanpage, setEnableFanpage] = useState<boolean>(true);
  const [isSavingContact, setIsSavingContact] = useState<boolean>(false);
  const [statsData, setStatsData] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);

  // Admin Security & Custom Link State
  const [adminSecretPath, setAdminSecretPath] = useState<string>('quan-tri-bao-mat-2026');
  const [currPasswordInput, setCurrPasswordInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [newSecretPathInput, setNewSecretPathInput] = useState<string>('quan-tri-bao-mat-2026');
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState<boolean>(false);
  const [securityMsg, setSecurityMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedSecretUrl, setCopiedSecretUrl] = useState<boolean>(false);

  // Status Toast Notification
  const [toastMsg, setToastMsg] = useState('');

  // Google Sheet Sync & Connection Diagnostic State
  const [sheetUrl, setSheetUrl] = useState('');
  const [appsScriptEndpoint, setAppsScriptEndpoint] = useState('');
  const [isSavingSheetConfig, setIsSavingSheetConfig] = useState(false);
  const [isTestingSheet, setIsTestingSheet] = useState(false);
  const [sheetConnectionStatus, setSheetConnectionStatus] = useState<{
    isConnected: boolean;
    message: string;
    details?: string;
    testedAt?: string;
  } | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConsultations();
      fetchSheetConfig();
      fetchAnalyticsAndSettings();
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchAnalyticsAndSettings = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/analytics/stats');
      const data = await res.json();
      if (data.success) {
        setStatsData(data.stats);
        if (data.settings) {
          if (data.settings.useMockData !== undefined) setUseMockData(data.settings.useMockData);
          if (data.settings.bookingPhone) setBookingPhone(data.settings.bookingPhone);
          if (data.settings.enablePhone !== undefined) setEnablePhone(Boolean(data.settings.enablePhone));
          if (data.settings.zaloPhone) setZaloPhone(data.settings.zaloPhone);
          if (data.settings.enableZalo !== undefined) setEnableZalo(Boolean(data.settings.enableZalo));
          if (data.settings.bookingEmail) setBookingEmail(data.settings.bookingEmail);
          if (data.settings.enableEmail !== undefined) setEnableEmail(Boolean(data.settings.enableEmail));
          if (data.settings.fanpageUrl) setFanpageUrl(data.settings.fanpageUrl);
          if (data.settings.enableFanpage !== undefined) setEnableFanpage(Boolean(data.settings.enableFanpage));
          if (data.settings.adminSecretPath) {
            setAdminSecretPath(data.settings.adminSecretPath);
            setNewSecretPathInput(data.settings.adminSecretPath);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSaveContactSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContact(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingPhone,
          enablePhone,
          zaloPhone,
          enableZalo,
          bookingEmail,
          enableEmail,
          fanpageUrl,
          enableFanpage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('✅ Đã lưu cấu hình liên hệ & fanpage thành công!');
        fetchAnalyticsAndSettings();
      }
    } catch (err) {
      alert('Lỗi khi lưu thông tin liên hệ');
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleToggleMockData = async (newVal: boolean) => {
    setUseMockData(newVal);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useMockData: newVal }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          newVal
            ? '🔄 Đã BẬT hiển thị Dữ Liệu Mẫu'
            : '⚡ Đã TẮT Dữ Liệu Mẫu (Chỉ dùng dữ liệu thật)'
        );
        onRefreshRooms();
        fetchAnalyticsAndSettings();
      }
    } catch (err) {
      alert('Lỗi khi cập nhật cài đặt dữ liệu mẫu');
    }
  };

  const fetchConsultations = async () => {
    setLoadingConsultations(true);
    try {
      const res = await fetch('/api/consultations');
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        setConsultations(data.requests);
      }
    } catch (err) {
      console.error('Error fetching consultations:', err);
    } finally {
      setLoadingConsultations(false);
    }
  };

  const testSheetConnection = async () => {
    setIsTestingSheet(true);
    try {
      const res = await fetch('/api/sheets/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl, appsScriptEndpoint }),
      });
      const data = await res.json();
      setSheetConnectionStatus({
        isConnected: Boolean(data.isConnected),
        message: data.message || (data.isConnected ? '🟢 KẾT NỐI GOOGLE SHEET HOẠT ĐỘNG TỐT!' : '❌ CHƯA CẤU HÌNH KẾT NỐI GOOGLE SHEET'),
        details: data.details,
        testedAt: data.testedAt || new Date().toLocaleString('vi-VN'),
      });
      if (data.isConnected) {
        showToast('🟢 Kiểm tra kết nối Google Sheet thành công!');
      }
    } catch (err) {
      setSheetConnectionStatus({
        isConnected: false,
        message: '❌ Lỗi kết nối đến máy chủ kiểm tra Google Sheet',
        details: 'Vui lòng thử lại sau',
        testedAt: new Date().toLocaleString('vi-VN'),
      });
    } finally {
      setIsTestingSheet(false);
    }
  };

  const fetchSheetConfig = async () => {
    try {
      const res = await fetch('/api/sheets/config');
      const data = await res.json();
      if (data.success && data.config) {
        const url = data.config.sheetUrl || '';
        const endpoint = data.config.appsScriptEndpoint || '';
        setSheetUrl(url);
        setAppsScriptEndpoint(endpoint);

        const hasConfig = Boolean((url && url.trim().length > 10) || (endpoint && endpoint.trim().length > 10));
        setSheetConnectionStatus({
          isConnected: hasConfig,
          message: hasConfig
            ? '🟢 ĐÃ CẤU HÌNH ĐỒNG BỘ GOOGLE SHEET'
            : '⚠️ CHƯA KẾT NỐI GOOGLE SHEET! (Dữ liệu bài đăng đang lưu nội bộ)',
          details: hasConfig
            ? 'Hệ thống đã nhận link Google Sheet/Endpoint và sẵn sàng đồng bộ.'
            : 'Hãy nhập Link Google Sheet hoặc Apps Script Web App Endpoint để đồng bộ bài đăng.',
          testedAt: data.config.lastSyncedAt || new Date().toLocaleString('vi-VN'),
        });
      }
    } catch (err) {
      console.error('Error fetching sheet config:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem('admin_token', 'admin-authorized-token');
        setIsAuthenticated(true);
        setLoginError('');
        fetchConsultations();
        fetchSheetConfig();
        fetchAnalyticsAndSettings();
      } else {
        setLoginError(data.error || 'Mật khẩu quản trị không chính xác!');
      }
    } catch (err) {
      setLoginError('Lỗi kết nối máy chủ xác thực');
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMsg(null);

    if (!currPasswordInput) {
      setSecurityMsg({ type: 'error', text: 'Vui lòng nhập Mật khẩu Admin hiện tại để xác nhận thay đổi.' });
      return;
    }

    setIsUpdatingSecurity(true);
    try {
      const res = await fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currPasswordInput,
          newPassword: newPasswordInput || undefined,
          adminSecretPath: newSecretPathInput || undefined,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSecurityMsg({ type: 'success', text: data.message });
        if (data.adminSecretPath) {
          setAdminSecretPath(data.adminSecretPath);
          setNewSecretPathInput(data.adminSecretPath);
        }
        setCurrPasswordInput('');
        setNewPasswordInput('');
        showToast('🔒 Đã lưu mật khẩu & đường dẫn bảo mật Admin mới!');
      } else {
        setSecurityMsg({ type: 'error', text: data.error || 'Thao tác bảo mật thất bại' });
      }
    } catch (err) {
      setSecurityMsg({ type: 'error', text: 'Lỗi kết nối máy chủ xác thực' });
    } finally {
      setIsUpdatingSecurity(false);
    }
  };

  const handleQuickStatusChange = async (roomId: string, newStatus: RoomStatus) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Đã cập nhật trạng thái phòng #${roomId}`);
        onRefreshRooms();
      }
    } catch (err) {
      alert('Lỗi khi cập nhật trạng thái phòng');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xoá phòng mã #${roomId} khỏi hệ thống?`)) return;
    try {
      const res = await fetch(`/api/rooms/${roomId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Đã xoá phòng #${roomId} thành công`);
        onRefreshRooms();
      }
    } catch (err) {
      alert('Lỗi khi xoá bài đăng');
    }
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom?.title || !editingRoom?.price || !editingRoom?.address) {
      alert('Vui lòng điền đầy đủ tiêu đề, địa chỉ và giá thuê!');
      return;
    }

    try {
      const method = editingRoom.id ? 'PUT' : 'POST';
      const url = editingRoom.id ? `/api/rooms/${editingRoom.id}` : '/api/rooms';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRoom),
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingRoom.id ? '✅ Cập nhật phòng thành công!' : '✨ Thêm phòng mới thành công!');
        setEditingRoom(null);
        setActiveTab('listings');
        onRefreshRooms();
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu phòng');
    }
  };

  const handleSaveSheetConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSheetConfig(true);
    try {
      const res = await fetch('/api/sheets/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl, appsScriptEndpoint }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('✅ Đã lưu cấu hình Google Sheet!');
        await testSheetConnection();
      }
    } catch (err) {
      alert('Lỗi khi lưu cấu hình Google Sheet');
    } finally {
      setIsSavingSheetConfig(false);
    }
  };

  // Filtered rooms list for Admin search
  const filteredAdminRooms = rooms.filter((r) => {
    if (!adminSearch.trim()) return true;
    const q = adminSearch.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.district.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      (r.ownerPhone && r.ownerPhone.includes(q))
    );
  });

  // Calculate max visits for bar chart scaling
  const max7DayVisit = Math.max(
    ...(statsData?.last7Days || []).map((d: any) => d.count),
    50
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img 
              src="/avatar.svg" 
              alt="San Sài gòn Avatar Logo" 
              className="w-11 h-11 rounded-full border-2 border-amber-400 shadow-md object-cover bg-slate-950"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">TRANG QUẢN TRỊ HỆ THỐNG — SAN SÀI GÒN</h1>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">
                  ADMIN PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Thống kê lưu lượng truy cập thực tế & Quản lý dữ liệu phòng trọ, KTX, Pass phòng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToClient}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span>Xem Trang Web Đăng Tin</span>
            </button>

            <button
              onClick={() => {
                onRefreshRooms();
                fetchAnalyticsAndSettings();
                fetchConsultations();
                showToast('Đã làm mới dữ liệu hệ thống!');
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cập nhật</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {!isAuthenticated ? (
        /* Password Gate Screen */
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl text-center">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">ĐĂNG NHẬP TRANG QUẢN TRỊ</h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Vui lòng nhập mật khẩu quản trị viên để xem thống kê lưu lượng người truy cập và quản lý hệ thống.
            </p>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Mật Khẩu Admin
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu quản trị hệ thống..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-amber-500"
                    autoFocus
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-bold rounded-xl">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer uppercase tracking-wider"
              >
                Vào Trang Admin
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end text-[11px] text-slate-500">
              <button
                onClick={onBackToClient}
                className="text-slate-400 hover:text-white underline cursor-pointer font-bold"
              >
                Trở lại
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Admin Dashboard Layout */
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex flex-col gap-6">
          {/* Admin Navigation Bar Tabs */}
          <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Thống Kê Lưu Lượng</span>
              <span className="bg-slate-900/30 px-1.5 py-0.5 rounded text-[10px]">REALTIME</span>
            </button>

            <button
              onClick={() => setActiveTab('listings')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'listings'
                  ? 'bg-rose-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Quản Lý Phòng ({rooms.length})</span>
            </button>

            <button
              onClick={() => {
                setEditingRoom({
                  type: 'phong-tro',
                  status: 'con-trong',
                  price: 3500000,
                  deposit: 3500000,
                  depositSupport: 'Hỗ trợ 1.000.000đ tiền cọc',
                  area: 25,
                  availableRooms: 1,
                  district: 'Bình Thạnh',
                  address: 'Nơ Trang Long, Phường 13',
                  amenities: ['WC riêng', 'Bãi xe', 'Giờ giấc tự do', 'Không chung chủ'],
                  electricityPrice: '3.800 đ/kWh',
                  waterPrice: '100.000 đ/người',
                  internetPrice: '100.000 đ/phòng',
                  parkingPrice: 'Miễn phí',
                  ownerName: 'Chủ nhà San Sài gòn',
                  ownerPhone: '0908 123 456',
                  isVerified: true,
                  images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop'],
                });
                setActiveTab('edit');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-emerald-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Đăng Bài Mới</span>
            </button>

            <button
              onClick={() => setActiveTab('consultations')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'consultations'
                  ? 'bg-blue-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Yêu Cầu Tư Vấn ({consultations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('sheets')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'sheets'
                  ? 'bg-purple-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Cấu Hình Sheets & Hotline</span>
            </button>
          </div>

          {/* PROMINENT GOOGLE SHEET CONNECTION STATUS BANNER FOR ADMIN */}
          {(!sheetUrl && !appsScriptEndpoint) ? (
            <div className="bg-amber-500/10 border-2 border-amber-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl shrink-0 mt-0.5 border border-amber-500/30">
                  <AlertTriangle className="w-5 h-5 animate-pulse text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                      ⚠️ CẢNH BÁO: CHƯA KẾT NỐI GOOGLE SHEET
                    </span>
                    <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-400 font-extrabold text-[10px] rounded-full border border-rose-500/30 uppercase">
                      Chưa Đồng Bộ Sheet
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Hệ thống đang lưu trữ bài đăng &amp; yêu cầu tư vấn trên <strong>Cơ sở dữ liệu nội bộ</strong>.
                    Để tự động sao lưu và hiển thị trực tiếp dữ liệu trên Google Sheets công khai, Quản trị viên vui lòng khai báo link Google Sheet bên dưới.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('sheets')}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2 whitespace-nowrap transition-all duration-200 shrink-0"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Cấu Hình Google Sheet Ngay</span>
              </button>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  TRẠNG THÁI GOOGLE SHEET: <span className="font-bold text-white uppercase">Đã Kết Nối &amp; Đồng Bộ</span>
                  <span className="text-slate-400 font-normal hidden md:inline ml-2">({sheetUrl ? sheetUrl.substring(0, 45) + '...' : appsScriptEndpoint.substring(0, 45) + '...'})</span>
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={testSheetConnection}
                  disabled={isTestingSheet}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-lg border border-slate-700 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingSheet ? 'animate-spin' : ''}`} />
                  <span>{isTestingSheet ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('sheets')}
                  className="text-slate-400 hover:text-white underline font-bold cursor-pointer"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: TRAFFIC & ANALYTICS DASHBOARD */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>DỮ LIỆU LƯU LƯỢNG TRUY CẬP TRỰC TUYẾN</span>
                  </div>
                  <h2 className="text-xl font-black text-white">BÁO CÁO THỐNG KÊ NGƯỜI DÙNG GHÉ THĂM SAN SÀI GÒN</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Dữ liệu được ghi nhận tự động từ lượt xem trang web, tìm kiếm phòng trọ và mở chi tiết bài đăng.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Hotline Hiện Tại</span>
                    <strong className="text-sm font-extrabold text-amber-400">{bookingPhone}</strong>
                  </div>
                </div>
              </div>

              {/* Top Metric Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-5 bg-gradient-to-br from-purple-900/40 to-slate-950 border border-purple-800/50 rounded-2xl">
                  <div className="flex items-center justify-between text-purple-400 text-xs font-extrabold mb-2">
                    <span>Tổng Lượt Truy Cập</span>
                    <Eye className="w-4 h-4" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-purple-200">
                    {statsData?.totalVisits || 0}
                    <span className="text-xs font-normal text-purple-400 ml-1">lượt</span>
                  </div>
                  <div className="text-[10px] text-purple-400 font-semibold mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span>Tự động cập nhật</span>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-rose-900/40 to-slate-950 border border-rose-800/50 rounded-2xl">
                  <div className="flex items-center justify-between text-rose-400 text-xs font-extrabold mb-2">
                    <span>Lượt Truy Cập Hôm Nay</span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-rose-200">
                    {statsData?.last7Days?.[statsData.last7Days.length - 1]?.count || 0}
                    <span className="text-xs font-normal text-rose-400 ml-1">khách</span>
                  </div>
                  <div className="text-[10px] text-rose-400 font-semibold mt-2">Đang ghé thăm hôm nay</div>
                </div>

                <div className="p-5 bg-gradient-to-br from-emerald-900/40 to-slate-950 border border-emerald-800/50 rounded-2xl">
                  <div className="flex items-center justify-between text-emerald-400 text-xs font-extrabold mb-2">
                    <span>Truy Cập Mobile</span>
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-200">
                    {statsData?.devices?.mobilePercent || 70}%
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-2 truncate">
                    {statsData?.devices?.mobile || 0} thiết bị di động
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-amber-900/40 to-slate-950 border border-amber-800/50 rounded-2xl">
                  <div className="flex items-center justify-between text-amber-400 text-xs font-extrabold mb-2">
                    <span>Lượt Xem Chi Tiết Bài</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-200">
                    {Object.values(statsData?.roomViews || {}).reduce((a: any, b: any) => Number(a) + Number(b), 0)}
                  </div>
                  <div className="text-[10px] text-amber-400 font-semibold mt-2">Mở modal xem thông tin</div>
                </div>

                <div className="p-5 bg-gradient-to-br from-blue-900/40 to-slate-950 border border-blue-800/50 rounded-2xl">
                  <div className="flex items-center justify-between text-blue-400 text-xs font-extrabold mb-2">
                    <span>Khách Đăng Ký Tư Vấn</span>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-200">
                    {statsData?.consultationsCount || consultations.length || 0}
                  </div>
                  <div className="text-[10px] text-blue-400 font-semibold mt-2">Lead muốn thuê phòng</div>
                </div>

                <div className="p-5 bg-gradient-to-br from-teal-900/40 to-slate-950 border border-teal-800/50 rounded-2xl">
                  <div className="flex items-center justify-between text-teal-400 text-xs font-extrabold mb-2">
                    <span>Số Lượng Bài Đăng</span>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-200">
                    {statsData?.totalRoomsCount || rooms.length}
                  </div>
                  <div className="text-[10px] text-teal-400 font-semibold mt-2">
                    Thật: {statsData?.realRoomsCount || 0} | Mẫu: {statsData?.mockRoomsCount || 0}
                  </div>
                </div>
              </div>

              {/* 7-Day Traffic Bar Chart */}
              <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-amber-400" />
                      <span>BIỂU ĐỒ LƯU LƯỢNG TRUY CẬP 7 NGÀY GẦN NHẤT</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Thống kê số lượng lượt khách truy cập hệ thống theo từng ngày</p>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full self-start">
                    Cập nhật mới nhất
                  </span>
                </div>

                {/* Visual Bars Container */}
                <div className="pt-6 pb-2">
                  <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-8 border-b border-slate-800">
                    {(statsData?.last7Days || []).map((dayItem: any, idx: number) => {
                      const heightPercent = Math.min(100, Math.max(15, Math.round((dayItem.count / max7DayVisit) * 100)));
                      const isToday = idx === (statsData?.last7Days?.length || 0) - 1;
                      return (
                        <div key={dayItem.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          {/* Value Tag on Hover/Visible */}
                          <div className="text-xs font-black text-amber-400 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-md shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
                            {dayItem.count}
                          </div>
                          {/* Bar */}
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full max-w-[48px] rounded-t-xl transition-all duration-500 relative ${
                              isToday
                                ? 'bg-gradient-to-t from-rose-600 via-amber-500 to-amber-400 shadow-lg shadow-amber-500/20'
                                : 'bg-gradient-to-t from-purple-900 via-purple-600 to-amber-400/80 group-hover:brightness-125'
                            }`}
                          />
                          {/* Date Label */}
                          <div className="text-[11px] font-extrabold text-slate-400 mt-2">
                            {dayItem.formattedDate}
                            {isToday && <span className="block text-[9px] text-rose-400 font-black">Hôm nay</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Detailed Per-Listing Views Table */}
              <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <span>THỐNG KÊ LƯỢT XEM CHI TIẾT TỪNG BÀI ĐĂNG PHÒNG TRỌ</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Xếp hạng các bài đăng được khách hàng quan tâm & click mở xem chi tiết nhiều nhất</p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      placeholder="Tìm bài đăng..."
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 font-extrabold uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">Mã Phòng</th>
                        <th className="p-3.5">Tiêu Đề Bài Đăng</th>
                        <th className="p-3.5">Quận/Huyện</th>
                        <th className="p-3.5">Giá Thuê / Tháng</th>
                        <th className="p-3.5">Ưu Đãi Cọc (Pass phòng)</th>
                        <th className="p-3.5">Nguồn</th>
                        <th className="p-3.5 text-right">Tổng Lượt Xem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {rooms
                        .filter((r) => !adminSearch || r.title.toLowerCase().includes(adminSearch.toLowerCase()) || r.id.toLowerCase().includes(adminSearch.toLowerCase()))
                        .map((r) => ({
                          ...r,
                          viewCount: statsData?.roomViews?.[r.id] || 0,
                        }))
                        .sort((a, b) => b.viewCount - a.viewCount)
                        .map((r) => {
                          const isMockRoom = Boolean((r as any).isMock || r.id.startsWith('sg-00'));
                          return (
                            <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="p-3.5 font-mono font-bold text-slate-400 text-[11px]">{r.id}</td>
                              <td className="p-3.5 font-bold text-white max-w-xs truncate">{r.title}</td>
                              <td className="p-3.5 text-slate-300 font-medium">{r.district}</td>
                              <td className="p-3.5 font-extrabold text-rose-400">
                                {(r.price / 1000000).toFixed(1)} tr/th
                              </td>
                              <td className="p-3.5">
                                {r.depositSupport ? (
                                  <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-emerald-700/50">
                                    <Gift className="w-3 h-3 text-amber-400" />
                                    <span>{r.depositSupport}</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-[11px]">—</span>
                                )}
                              </td>
                              <td className="p-3.5">
                                {isMockRoom ? (
                                  <span className="bg-amber-950/60 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-800/40">
                                    Dữ liệu mẫu
                                  </span>
                                ) : (
                                  <span className="bg-emerald-950/60 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-800/40">
                                    ✨ Dữ liệu thật
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 text-right">
                                <span className="inline-flex items-center gap-1.5 bg-purple-950 text-purple-300 font-black px-3 py-1 rounded-xl text-xs border border-purple-800/50">
                                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                                  <span>{r.viewCount} lượt</span>
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Direct Quick Contact Settings Card */}
              <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <span>CẤU HÌNH SỐ TELEPHONE HOTLINE BOOKING TƯ VẤN</span>
                </h3>
                <form onSubmit={handleSaveContactSettings} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Số Hotline Booking (Hiển thị toàn bộ website)
                    </label>
                    <input
                      type="text"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      placeholder="VD: 0908 123 456"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Email Liên Hệ Quản Trị
                    </label>
                    <input
                      type="email"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      placeholder="VD: booking@sansaigon.vn"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingContact}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      {isSavingContact ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Lưu Hotline & Email Quản Trị</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: ROOM LISTINGS MANAGEMENT */}
          {activeTab === 'listings' && (
            <div className="space-y-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-black text-white">QUẢN LÝ DANH SÁCH BÀI ĐĂNG PHÒNG TRỌ</h2>
                  <p className="text-xs text-slate-400">Danh sách tất cả các phòng trọ, KTX, phòng pass đang được quản lý trên hệ thống San Sài gòn</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      placeholder="Tìm bài đăng..."
                      className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setEditingRoom({
                        type: 'phong-tro',
                        status: 'con-trong',
                        price: 3500000,
                        deposit: 3500000,
                        depositSupport: 'Hỗ trợ 1.000.000đ tiền cọc',
                        area: 25,
                        availableRooms: 1,
                        district: 'Bình Thạnh',
                        address: 'Nơ Trang Long, Phường 13',
                        amenities: ['WC riêng', 'Bãi xe', 'Giờ giấc tự do'],
                        ownerName: 'Chủ nhà San Sài gòn',
                        ownerPhone: '0908 123 456',
                        isVerified: true,
                        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop'],
                      });
                      setActiveTab('edit');
                    }}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Mới</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-extrabold uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Ảnh</th>
                      <th className="p-3.5">Mã & Tiêu Đề</th>
                      <th className="p-3.5">Loại Hình</th>
                      <th className="p-3.5">Giá Thuê / Quận</th>
                      <th className="p-3.5">Trạng Thái</th>
                      <th className="p-3.5">Chủ Phòng</th>
                      <th className="p-3.5 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredAdminRooms.map((room) => (
                      <tr key={room.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <img
                            src={room.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
                            alt={room.title}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-800"
                          />
                        </td>
                        <td className="p-3.5">
                          <span className="font-mono text-[10px] text-amber-400 font-bold block">#{room.id}</span>
                          <span className="font-bold text-white max-w-xs truncate block">{room.title}</span>
                          <span className="text-[10px] text-slate-400 truncate block">{room.address}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded text-[10px]">
                            {room.type === 'phong-tro' ? 'Phòng trọ' : room.type === 'ky-tuc-xa' ? 'KTX / Box' : 'Pass phòng'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-extrabold text-rose-400 block">{room.price.toLocaleString('vi-VN')} đ</span>
                          <span className="text-slate-400 font-medium block">{room.district} ({room.area}m²)</span>
                          {room.depositSupport && (
                            <span className="mt-1 inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-800/60">
                              🎁 {room.depositSupport}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <select
                            value={room.status}
                            onChange={(e) => handleQuickStatusChange(room.id, e.target.value as RoomStatus)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-extrabold outline-none cursor-pointer border ${
                              room.status === 'con-trong'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800/80'
                                : room.status === 'sap-trong'
                                ? 'bg-amber-950 text-amber-300 border-amber-800/80'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            <option value="con-trong">🟢 Còn trống ({room.availableRooms || 1} phòng)</option>
                            <option value="sap-trong">🟡 Sắp trống</option>
                            <option value="da-cho-thue">🔴 Đã cho thuê</option>
                          </select>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-slate-200 block text-[11px]">{room.ownerName || 'Bảo Bảo Sàn Sài Gòn'}</span>
                          <span className="text-slate-400 text-[10px] block">{room.ownerPhone || bookingPhone}</span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setEditingRoom(room);
                                setActiveTab('edit');
                              }}
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors cursor-pointer"
                              title="Chỉnh sửa bài đăng"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="p-2 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg transition-colors cursor-pointer"
                              title="Xoá bài đăng"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ADD / EDIT ROOM FORM */}
          {activeTab === 'edit' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-black text-white">
                    {editingRoom?.id ? `CHỈNH SỬA BÀI ĐĂNG PHÒNG TRỌ #${editingRoom.id}` : 'TẠO BÀI ĐĂNG PHÒNG TRỌ MỚI'}
                  </h2>
                  <p className="text-xs text-slate-400">Điền thông tin chi tiết phòng trọ để hiển thị công khai trên San Sài gòn</p>
                </div>
                <button
                  onClick={() => setActiveTab('listings')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Hủy & Quay lại
                </button>
              </div>

              <form onSubmit={handleSaveRoom} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Loại Bài Đăng</label>
                    <select
                      value={editingRoom?.type || 'phong-tro'}
                      onChange={(e) => setEditingRoom({ ...editingRoom, type: e.target.value as ListingType })}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="phong-tro">🏢 Phòng trọ cho thuê</option>
                      <option value="ky-tuc-xa">👥 Ký túc xá / Sleepbox</option>
                      <option value="pass-phong">🔄 Pass phòng (Sang nhượng hđ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Trạng Thái Phòng</label>
                    <select
                      value={editingRoom?.status || 'con-trong'}
                      onChange={(e) => setEditingRoom({ ...editingRoom, status: e.target.value as RoomStatus })}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="con-trong">🟢 Còn phòng trống</option>
                      <option value="sap-trong">🟡 Sắp trống</option>
                      <option value="da-cho-thue">🔴 Đã cho thuê</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Số Lượng Phòng Còn</label>
                    <input
                      type="number"
                      value={editingRoom?.availableRooms || 1}
                      onChange={(e) => setEditingRoom({ ...editingRoom, availableRooms: Number(e.target.value) })}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-rose-500"
                      min={1}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Tiêu Đề Bài Đăng</label>
                  <input
                    type="text"
                    value={editingRoom?.title || ''}
                    onChange={(e) => setEditingRoom({ ...editingRoom, title: e.target.value })}
                    placeholder="VD: Cho thuê phòng full nội thất Nơ Trang Long Bình Thạnh..."
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Giá Thuê (VNĐ / Tháng)</label>
                    <input
                      type="number"
                      value={editingRoom?.price || 3500000}
                      onChange={(e) => setEditingRoom({ ...editingRoom, price: Number(e.target.value) })}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-rose-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Tiền Đặt Cọc (VNĐ)</label>
                    <input
                      type="number"
                      value={editingRoom?.deposit || 3500000}
                      onChange={(e) => setEditingRoom({ ...editingRoom, deposit: Number(e.target.value) })}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Diện Tích (m²)</label>
                    <input
                      type="number"
                      value={editingRoom?.area || 25}
                      onChange={(e) => setEditingRoom({ ...editingRoom, area: Number(e.target.value) })}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                {/* Deposit Support Field */}
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-1 flex items-center justify-between">
                    <span>🎁 Hỗ Trợ Tiền Cọc (Dành Cho Bài Pass Phòng / Ưu Đãi Cọc)</span>
                    <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">Hiển thị nổi bật</span>
                  </label>
                  <input
                    type="text"
                    value={editingRoom?.depositSupport || ''}
                    onChange={(e) => setEditingRoom({ ...editingRoom, depositSupport: e.target.value })}
                    placeholder="VD: Hỗ trợ 1.000.000đ tiền cọc, hoặc Tặng 50% cọc..."
                    className="w-full p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-xs font-bold text-emerald-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Quận / Huyện HCM</label>
                    <select
                      value={editingRoom?.district || 'Bình Thạnh'}
                      onChange={(e) => setEditingRoom({ ...editingRoom, district: e.target.value })}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      {SAIGON_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Địa Chỉ Chi Tiết</label>
                    <input
                      type="text"
                      value={editingRoom?.address || ''}
                      onChange={(e) => setEditingRoom({ ...editingRoom, address: e.target.value })}
                      placeholder="VD: 184/20 Nơ Trang Long, Phường 13, Bình Thạnh"
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-rose-500"
                      required
                    />
                  </div>
                </div>

                {/* Amenities Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Tiện Ích Phòng Trọ</label>
                  <AmenitySelector
                    selectedAmenities={editingRoom?.amenities || []}
                    onChange={(amenities) => setEditingRoom({ ...editingRoom, amenities })}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Mô Tả Chi Tiết Phòng</label>
                  <textarea
                    rows={4}
                    value={editingRoom?.description || ''}
                    onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                    placeholder="Mô tả nội thất, giờ giấc, quy định phòng trọ..."
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Images Array Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Link Hình Ảnh (Mỗi dòng 1 URL)</label>
                  <textarea
                    rows={3}
                    value={(editingRoom?.images || []).join('\n')}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        images: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-amber-300 outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('listings')}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Lưu Bài Đăng
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: CONSULTATION LEADS */}
          {activeTab === 'consultations' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-black text-white">DANH SÁCH KHÁCH HÀNG ĐĂNG KÝ TƯ VẤN</h2>
                  <p className="text-xs text-slate-400">Tất cả thông tin khách hàng để lại SĐT muốn xem phòng hoặc tìm phòng trọ</p>
                </div>
                <button
                  onClick={fetchConsultations}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs font-bold text-amber-400 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Cập nhật</span>
                </button>
              </div>

              {loadingConsultations ? (
                <div className="py-12 text-center text-slate-400 font-bold text-xs">Đang tải danh sách tư vấn...</div>
              ) : consultations.length === 0 ? (
                <div className="py-12 text-center text-slate-500 font-bold text-xs">Chưa có yêu cầu tư vấn mới nào</div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 font-extrabold uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">Họ & Tên</th>
                        <th className="p-3.5">Số Điện Thoại</th>
                        <th className="p-3.5">Quận / Phòng Quan Tâm</th>
                        <th className="p-3.5">Ghi Chú Nhu Cầu</th>
                        <th className="p-3.5">Thời Gian</th>
                        <th className="p-3.5 text-right">Gọi Ngay</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {consultations.map((c, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 font-bold text-white">{c.name || 'Khách hàng'}</td>
                          <td className="p-3.5 font-bold text-amber-400 font-mono">{c.phone}</td>
                          <td className="p-3.5 text-slate-300 font-medium">
                            {c.roomTitle ? (
                              <span className="text-rose-400 font-bold">{c.roomTitle}</span>
                            ) : (
                              <span>Quận: {c.district || 'Tất cả'}</span>
                            )}
                          </td>
                          <td className="p-3.5 text-slate-400 max-w-xs truncate">{c.note || 'Muốn xem phòng trực tiếp'}</td>
                          <td className="p-3.5 text-slate-500 font-mono text-[11px]">{c.createdAt || 'Mới đây'}</td>
                          <td className="p-3.5 text-right">
                            <a
                              href={`tel:${c.phone}`}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] rounded-lg shadow-sm transition-all inline-flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Gọi ngay</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: GOOGLE SHEETS & SYSTEM CONFIG */}
          {activeTab === 'sheets' && (
            <div className="space-y-6">

              {/* 🔒 ADMIN SECURITY & SECRET LINK CONFIGURATION CARD */}
              <div className="bg-slate-950 p-6 rounded-3xl border border-rose-900/40 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-rose-400 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-rose-400" />
                      <span>🔒 CẤU HÌNH BẢO MẬT ADMIN & ĐƯỜNG DẪN TRUY CẬP BẢO MẬT</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Đường dẫn Admin mặc định (/admin hoặc #admin) đã bị tắt hoàn toàn. Chỉ có thể truy cập bằng Liên kết Bảo mật bên dưới.
                    </p>
                  </div>
                </div>

                {/* Secret Link Display Box */}
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <label className="text-xs font-black text-amber-400 uppercase tracking-wide block">
                    🔗 Liên kết Truy Cập Admin Bảo Mật Của Bạn (Lưu Bookmark):
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/#${adminSecretPath}`}
                      className="flex-1 p-3 bg-slate-950 border border-slate-700 rounded-xl font-mono text-xs text-emerald-400 font-bold outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/#${adminSecretPath}`);
                        setCopiedSecretUrl(true);
                        setTimeout(() => setCopiedSecretUrl(false), 2500);
                      }}
                      className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      {copiedSecretUrl ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                          <span>Đã Sao Chép!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Sao Chép Link Admin</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    💡 Mẹo: Hãy lưu đường dẫn này vào Bookmark trình duyệt của bạn. Tuyệt đối không chia sẻ đường dẫn này cho người lạ.
                  </p>
                </div>

                {/* Security Update Form */}
                <form onSubmit={handleSaveSecurity} className="space-y-4 pt-2">
                  {securityMsg && (
                    <div className={`p-3.5 rounded-xl border text-xs font-bold ${
                      securityMsg.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}>
                      {securityMsg.text}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Mật Khẩu Hiện Tại <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={currPasswordInput}
                        onChange={(e) => setCurrPasswordInput(e.target.value)}
                        placeholder="Nhập mật khẩu đang dùng..."
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Mật Khẩu Mới (Tùy chọn)
                      </label>
                      <input
                        type="password"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="Để trống nếu không đổi..."
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Đường Dẫn Slug Admin Mới
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={newSecretPathInput}
                          onChange={(e) => setNewSecretPathInput(e.target.value)}
                          placeholder="VD: quan-tri-sansaigon-2026"
                          className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-amber-400 outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isUpdatingSecurity}
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                    >
                      {isUpdatingSecurity ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Đang Cập Nhật...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Lưu Bảo Mật &amp; Đổi Đường Dẫn</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Contact Phone, Zalo, Email & Fanpage Configuration Card */}
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Phone className="w-5 h-5 text-amber-400" />
                      <span>CẤU HÌNH THÔNG TIN LIÊN HỆ & BẬT/TẮT KÊNH HỖ TRỢ</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Bật/tắt từng kênh liên hệ (Hotline, Zalo, Email, Fanpage) và tùy chỉnh thông tin hiển thị trên toàn trang web.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveContactSettings} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* 1. HOTLINE PHONE CHANNEL */}
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-black text-white uppercase">1. Hotline Gọi Điện</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEnablePhone(!enablePhone)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            enablePhone
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{enablePhone ? 'ĐANG BẬT' : 'ĐÃ TẮT'}</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                          Số Điện Thoại Hotline Trực Tiếp
                        </label>
                        <input
                          type="text"
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          placeholder="VD: 0908 123 456"
                          disabled={!enablePhone}
                          className={`w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-amber-400 outline-none focus:ring-2 focus:ring-amber-500 ${
                            !enablePhone && 'opacity-40 cursor-not-allowed'
                          }`}
                          required={enablePhone}
                        />
                      </div>
                    </div>

                    {/* 2. ZALO CHANNEL */}
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-blue-400" />
                          <span className="text-xs font-black text-white uppercase">2. Zalo Tư Vấn</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEnableZalo(!enableZalo)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            enableZalo
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{enableZalo ? 'ĐANG BẬT' : 'ĐÃ TẮT'}</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                          Số Điện Thoại Zalo Tư Vấn
                        </label>
                        <input
                          type="text"
                          value={zaloPhone}
                          onChange={(e) => setZaloPhone(e.target.value)}
                          placeholder="VD: 0908 123 456"
                          disabled={!enableZalo}
                          className={`w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-blue-400 outline-none focus:ring-2 focus:ring-blue-500 ${
                            !enableZalo && 'opacity-40 cursor-not-allowed'
                          }`}
                          required={enableZalo}
                        />
                      </div>
                    </div>

                    {/* 3. EMAIL CHANNEL */}
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-rose-400" />
                          <span className="text-xs font-black text-white uppercase">3. Email Booking</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEnableEmail(!enableEmail)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            enableEmail
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{enableEmail ? 'ĐANG BẬT' : 'ĐÃ TẮT'}</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                          Email Hỗ Trợ Khách Hàng
                        </label>
                        <input
                          type="email"
                          value={bookingEmail}
                          onChange={(e) => setBookingEmail(e.target.value)}
                          placeholder="VD: booking@sansaigon.vn"
                          disabled={!enableEmail}
                          className={`w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-rose-500 ${
                            !enableEmail && 'opacity-40 cursor-not-allowed'
                          }`}
                          required={enableEmail}
                        />
                      </div>
                    </div>

                    {/* 4. FANPAGE FACEBOOK CHANNEL */}
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Facebook className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                          <span className="text-xs font-black text-white uppercase">4. Fanpage Facebook</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEnableFanpage(!enableFanpage)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            enableFanpage
                              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{enableFanpage ? 'ĐANG BẬT' : 'ĐÃ TẮT'}</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                          Đường Dẫn Link Fanpage Facebook
                        </label>
                        <input
                          type="url"
                          value={fanpageUrl}
                          onChange={(e) => setFanpageUrl(e.target.value)}
                          placeholder="VD: https://facebook.com/sansaigon.vn"
                          disabled={!enableFanpage}
                          className={`w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-indigo-300 outline-none focus:ring-2 focus:ring-indigo-500 ${
                            !enableFanpage && 'opacity-40 cursor-not-allowed'
                          }`}
                          required={enableFanpage}
                        />
                      </div>
                    </div>

                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSavingContact}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer flex items-center gap-2 transition-all"
                    >
                      {isSavingContact ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Đang lưu cấu hình...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>LƯU CẤU HÌNH THÔNG TIN LIÊN HỆ & FANPAGE</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Google Sheets Config Card */}
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                      <span>CẤU HÌNH &amp; KIỂM TRA TRẠNG THÁI KẾT NỐI GOOGLE SHEETS</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Kiểm tra thực tế trạng thái đồng bộ bài đăng &amp; đơn tư vấn giữa website Sàn Sài Gòn và Google Sheets.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={testSheetConnection}
                    disabled={isTestingSheet}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-2 transition-all shrink-0"
                  >
                    <RefreshCw className={`w-4 h-4 ${isTestingSheet ? 'animate-spin' : ''}`} />
                    <span>{isTestingSheet ? 'ĐANG KIỂM TRA...' : '⚡ KIỂM TRA KẾT NỐI NGAY'}</span>
                  </button>
                </div>

                {/* Status Result Display Box */}
                {sheetConnectionStatus && (
                  <div className={`p-4 rounded-2xl border ${
                    sheetConnectionStatus.isConnected
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}>
                    <div className="flex items-center gap-2 font-black text-sm">
                      {sheetConnectionStatus.isConnected ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
                      )}
                      <span>{sheetConnectionStatus.message}</span>
                    </div>
                    {sheetConnectionStatus.details && (
                      <p className="text-xs mt-2 text-slate-200 leading-relaxed font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        {sheetConnectionStatus.details}
                      </p>
                    )}
                    {sheetConnectionStatus.testedAt && (
                      <div className="text-[10px] text-slate-400 mt-2 text-right">
                        Thời gian kiểm tra: {sheetConnectionStatus.testedAt}
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleSaveSheetConfig} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Link Google Sheet Xem Công Khai (URL Bảng Tính)
                    </label>
                    <input
                      type="url"
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Google Apps Script Web App Endpoint (Tự động lưu dòng)
                    </label>
                    <input
                      type="url"
                      value={appsScriptEndpoint}
                      onChange={(e) => setAppsScriptEndpoint(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={testSheetConnection}
                      disabled={isTestingSheet}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${isTestingSheet ? 'animate-spin' : ''}`} />
                      <span>Thử Kết Nối</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingSheetConfig}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                    >
                      {isSavingSheetConfig ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Lưu Cấu Hình &amp; Báo Trạng Thái</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Standard Basic Sheet Column Layout Diagram */}
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-amber-400 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5" />
                    <span>CẤU TRÚC CỘT BẢNG TÍNH GOOGLE SHEET CHUẨN (BASIC SHEET LAYOUT)</span>
                  </h3>
                  <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
                    Thứ tự từ cột A -&gt; L
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Đảm bảo dòng đầu tiên (Row 1) của trang tính Google Sheet được thiết lập đúng các tên cột theo bảng sau:
                </p>

                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 font-extrabold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Cột</th>
                        <th className="p-3">Tên Cột Google Sheet</th>
                        <th className="p-3">Giải Thích Dữ Liệu</th>
                        <th className="p-3">Ví Dụ Mẫu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">Cột A</td>
                        <td className="p-3 font-bold text-white">Mã Phòng (ID)</td>
                        <td className="p-3 text-slate-400">Mã định danh duy nhất</td>
                        <td className="p-3 font-mono text-slate-400">SG-101</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">Cột B</td>
                        <td className="p-3 font-bold text-white">Tiêu Đề Bài Đăng</td>
                        <td className="p-3 text-slate-400">Tên bài đăng phòng trọ / KTX / Pass phòng</td>
                        <td className="p-3 text-slate-300">Phòng trọ cao cấp Nơ Trang Long Bình Thạnh</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">Cột C</td>
                        <td className="p-3 font-bold text-white">Loại Bài Đăng</td>
                        <td className="p-3 font-mono text-[11px] text-amber-300">phong-tro | ky-tuc-xa | pass-phong</td>
                        <td className="p-3 text-slate-300">phong-tro</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">Cột D</td>
                        <td className="p-3 font-bold text-white">Giá Thuê (VND)</td>
                        <td className="p-3 text-slate-400">Giá theo tháng (Chỉ điền số nguyên)</td>
                        <td className="p-3 font-mono font-bold text-rose-400">3500000</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">Cột E</td>
                        <td className="p-3 font-bold text-white">Hỗ Trợ Cọc (Pass Phòng)</td>
                        <td className="p-3 text-emerald-400 font-semibold">Tiền hỗ trợ cọc cho khách mới</td>
                        <td className="p-3 text-emerald-400 font-bold">Hỗ trợ 1.000.000đ tiền cọc</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">Cột F</td>
                        <td className="p-3 font-bold text-white">Diện Tích (m2)</td>
                        <td className="p-3 text-slate-400">Diện tích sử dụng m²</td>
                        <td className="p-3 text-slate-300">28</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">Cột G</td>
                        <td className="p-3 font-bold text-white">Quận / Huyện</td>
                        <td className="p-3 text-slate-400">Tên quận (Bình Thạnh, Quận 1, Gò Vấp,...)</td>
                        <td className="p-3 text-slate-300">Bình Thạnh</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">Cột H</td>
                        <td className="p-3 font-bold text-white">Địa Chỉ Chi Tiết</td>
                        <td className="p-3 text-slate-400">Số nhà, tên đường, phường</td>
                        <td className="p-3 text-slate-300">184 Nơ Trang Long, Phường 12</td>
                      </tr>
                      <tr className="bg-emerald-950/40 border-y border-emerald-800/60">
                        <td className="p-3 font-mono font-bold text-emerald-400">Cột I 📸</td>
                        <td className="p-3 font-bold text-emerald-200">Link Hình Ảnh URL</td>
                        <td className="p-3 text-emerald-300 font-bold">
                          Dán link ảnh online (Unsplash, Imgur, Cloudinary,...). Cách nhau bằng dấu phẩy <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-400 font-mono">,</code>
                        </td>
                        <td className="p-3 font-mono text-[10px] text-emerald-400 max-w-[200px] truncate">
                          https://images.unsplash.com/photo-1522708323590-d24dbb6b0267
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">Cột J</td>
                        <td className="p-3 font-bold text-white">Số Điện Thoại Chủ Nhà</td>
                        <td className="p-3 text-slate-400">Số di động liên hệ xem phòng</td>
                        <td className="p-3 font-mono text-amber-400">0908123456</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Mode Switch Card */}
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-white">BẬT / TẮT DỮ LIỆU MẪU BAN ĐẦU</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tắt dữ liệu mẫu khi bạn đã nhập đủ bài đăng thật từ thực tế để hệ thống chỉ hiển thị phòng do bạn tạo.
                  </p>
                </div>

                <button
                  onClick={() => handleToggleMockData(!useMockData)}
                  className={`px-5 py-2.5 font-black text-xs rounded-xl transition-all cursor-pointer ${
                    useMockData
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {useMockData ? '🔄 ĐANG BẬT DỮ LIỆU MẪU' : '⚡ CHỈ HIỂN THỊ DỮ LIỆU THẬT'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admin Footer */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500">
        <span>© 2026 Trang Quản Trị Hệ Thống San Sài Gòn — Quản lý phòng trọ, KTX, Pass phòng & Thống kê lưu lượng truy cập</span>
      </footer>
    </div>
  );
};
