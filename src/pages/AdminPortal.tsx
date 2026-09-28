import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldCheck,
  KeyRound,
  LogOut,
  Users,
  Globe,
  BookOpen,
  Building2,
  Image as ImageIcon,
  HelpCircle,
  Settings,
  Calendar,
  Star,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Search,
  MessageCircle,
  ExternalLink,
  Upload,
  RefreshCw,
  Clock,
  Eye,
  EyeOff,
  Filter,
  GraduationCap,
  Smartphone,
  Tag,
  Check,
  Copy,
  RotateCcw,
} from 'lucide-react';
import {
  adminLogin,
  adminVerifyMfa,
  adminGetMe,
  adminLogout,
  adminGetAllData,
  adminUpdateEnquiry,
  adminAddEnquiryNote,
  adminDeleteEnquiry,
  adminSaveCountry,
  adminDeleteCountry,
  adminSaveCourse,
  adminDeleteCourse,
  adminSaveUniversity,
  adminDeleteUniversity,
  adminSavePoster,
  adminDeletePoster,
  adminSaveScholarship,
  adminDeleteScholarship,
  adminSaveFaq,
  adminDeleteFaq,
  adminSaveEvent,
  adminDeleteEvent,
  adminSaveTestimonial,
  adminDeleteTestimonial,
  adminSaveEsim,
  adminDeleteEsim,
  adminUpdateSettings,
  adminUploadImage,
  buildWhatsAppLink,
} from '../api';
import { CandidateStatus, Enquiry } from '../types';

interface AdminPortalProps {
  onClose: () => void;
  onDataRefresh?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose, onDataRefresh }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
  const [mfaQrCode, setMfaQrCode] = useState<string | null>(null);
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Admin Data state
  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'enquiries' | 'countries' | 'courses' | 'universities' | 'posters' | 'scholarships' | 'faqs' | 'settings' | 'audit' | 'esims'
  >('overview');
  const [allData, setAllData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // eSIM plan edit state
  const [editingEsimPlan, setEditingEsimPlan] = useState<{
    productId: string;
    destination: string;
    planId: string;
    dataAmount: string;
    validity: string;
    priceInr: number;
    description: string;
  } | null>(null);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

  // Logo upload state
  const [logoUrlInput, setLogoUrlInput] = useState<string>('/logo.jpeg');
  const [logoUploading, setLogoUploading] = useState<boolean>(false);

  useEffect(() => {
    if (allData?.settings?.logoUrl !== undefined) {
      setLogoUrlInput(allData.settings.logoUrl || '/logo.jpeg');
    }
  }, [allData?.settings?.logoUrl]);

  // CRM filter & Note modal state
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Check initial admin session
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setAuthLoading(true);
    try {
      const me = await adminGetMe();
      const user = me?.admin || me?.user;
      if (user) {
        setIsAuthenticated(true);
        setAdminUser(user.username || 'admin');
        loadAdminRecords();
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadAdminRecords = async () => {
    setDataLoading(true);
    try {
      const data = await adminGetAllData();
      setAllData(data);
    } catch (e: any) {
      flashMessage(e.message || 'Failed to fetch admin data', 'error');
    } finally {
      setDataLoading(false);
    }
  };

  const flashMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // 1. Password Step
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await adminLogin(username, password);
      if (res.requireMfa || res.challengeId || res.step?.startsWith('mfa')) {
        setMfaChallengeId(res.challengeId);
        setMfaQrCode(res.qrCodeDataUrl || null);
        setMfaSecret(res.secret || null);
      } else if (res.success) {
        setIsAuthenticated(true);
        const adminName = res.admin?.username || res.user?.username || 'admin';
        setAdminUser(adminName);
        loadAdminRecords();
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials or locked.');
    } finally {
      setLoginLoading(false);
    }
  };

  // 2. TOTP MFA Step
  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaChallengeId) return;
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await adminVerifyMfa(mfaChallengeId, totpCode);
      if (res.success) {
        setIsAuthenticated(true);
        const adminName = res.admin?.username || res.user?.username || 'admin';
        setAdminUser(adminName);
        setMfaChallengeId(null);
        loadAdminRecords();
        if (onDataRefresh) {
          onDataRefresh();
        }
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid 6-digit TOTP authentication code.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setIsAuthenticated(false);
    setAdminUser(null);
    setAllData(null);
  };

  // CRM actions
  const handleUpdateStatus = async (enquiryId: string, status: CandidateStatus) => {
    try {
      await adminUpdateEnquiry(enquiryId, { status });
      flashMessage(`Status updated to ${status}`);
      loadAdminRecords();
      if (onDataRefresh) onDataRefresh();
    } catch (e: any) {
      flashMessage(e.message, 'error');
    }
  };

  const handleAddNote = async (enquiryId: string) => {
    if (!newNoteText.trim()) return;
    try {
      await adminAddEnquiryNote(enquiryId, newNoteText.trim());
      setNewNoteText('');
      flashMessage('Candidate note added');
      loadAdminRecords();
    } catch (e: any) {
      flashMessage(e.message, 'error');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this candidate enquiry?')) return;
    try {
      await adminDeleteEnquiry(id);
      flashMessage('Enquiry deleted');
      loadAdminRecords();
      if (onDataRefresh) onDataRefresh();
    } catch (e: any) {
      flashMessage(e.message, 'error');
    }
  };

  // Image Upload Helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const uploadedUrl = await adminUploadImage(base64, file.name);
        callback(uploadedUrl);
        flashMessage('Image uploaded successfully');
      } catch (err: any) {
        flashMessage(err.message || 'Failed to upload image', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  // Logo Upload & Management Helper
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      flashMessage('Logo file size must be less than 5MB', 'error');
      return;
    }

    setLogoUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const uploadedUrl = await adminUploadImage(base64, file.name);
        setLogoUrlInput(uploadedUrl);
        const currentSettings = allData?.settings || {};
        await adminUpdateSettings({
          ...currentSettings,
          logoUrl: uploadedUrl,
        });
        flashMessage('Brand logo uploaded and updated live on the website!');
        loadAdminRecords();
        if (onDataRefresh) onDataRefresh();
      } catch (err: any) {
        flashMessage(err.message || 'Failed to upload logo image', 'error');
      } finally {
        setLogoUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = async () => {
    setLogoUrlInput('/logo.jpeg');
    const currentSettings = allData?.settings || {};
    try {
      await adminUpdateSettings({
        ...currentSettings,
        logoUrl: '/logo.jpeg',
      });
      flashMessage('Brand logo reset to official default logo (/logo.jpeg).');
      loadAdminRecords();
      if (onDataRefresh) onDataRefresh();
    } catch (err: any) {
      flashMessage(err.message || 'Failed to reset logo', 'error');
    }
  };

  const handleSetAsDefault = async () => {
    const targetUrl = (logoUrlInput || '/logo.jpeg').trim();
    const currentSettings = allData?.settings || {};
    try {
      await adminUpdateSettings({
        ...currentSettings,
        logoUrl: targetUrl,
      });
      setLogoUrlInput(targetUrl);
      flashMessage('This logo has been set and saved as the official default brand logo!');
      loadAdminRecords();
      if (onDataRefresh) onDataRefresh();
    } catch (err: any) {
      flashMessage(err.message || 'Failed to set default logo', 'error');
    }
  };

  if (authLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-white my-auto max-h-[92vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-white text-xs font-semibold"
          >
            Exit Portal
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">Admin Login</h2>
              <p className="text-xs text-slate-400">Athmanathan Study Abroad • /admin</p>
            </div>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {!mfaChallengeId ? (
            /* STEP 1: PASSWORD */
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Admin Username or Email
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username or email"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{loginLoading ? 'Verifying...' : 'Continue to Authenticator App TOTP 2FA'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center pt-2">
                Protected by rate-limiting & HMAC SHA-256 session integrity.
              </p>
            </form>
          ) : (
            /* STEP 2: TOTP 2FA */
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Authenticator App TOTP 2FA Verification</span>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/80 text-xs text-blue-200 leading-relaxed">
                Scan the QR code below using your mobile Authenticator app (Google Authenticator, Microsoft Authenticator, or 1Password), then enter the active 6-digit code.
              </div>

              {mfaQrCode ? (
                <div className="text-center p-3.5 bg-white rounded-2xl shadow-md border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block mb-1">
                    Scan with Authenticator App
                  </span>
                  <div className="flex justify-center p-1.5">
                    <img
                      src={mfaQrCode}
                      alt="TOTP 2FA QR Code"
                      className="w-36 h-36 object-contain rounded-lg"
                    />
                  </div>
                  {mfaSecret && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between px-2 bg-slate-50 rounded-lg py-1.5">
                      <div className="text-left overflow-hidden mr-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Secret Key
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-slate-700 select-all truncate block">
                          {mfaSecret}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (mfaSecret) {
                            navigator.clipboard.writeText(mfaSecret);
                            setCopiedKey(true);
                            setTimeout(() => setCopiedKey(false), 2000);
                          }
                        }}
                        className="text-[11px] px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                        title="Copy Secret Key"
                      >
                        {copiedKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-600" />}
                        <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-4 bg-slate-800/60 rounded-2xl border border-slate-700">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-blue-400 mb-1" />
                  <span className="text-xs text-slate-400">Loading Authenticator QR code...</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-center text-xl font-mono tracking-widest text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMfaChallengeId(null)}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loginLoading || totpCode.length !== 6}
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md disabled:opacity-50"
                >
                  {loginLoading ? 'Verifying...' : 'Verify & Enter'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  const enquiries: Enquiry[] = allData?.enquiries || [];
  const countries = allData?.countries || [];
  const courses = allData?.courses || [];
  const universities = allData?.universities || [];
  const posters = allData?.posters || [];
  const scholarships = allData?.scholarships || [];
  const faqs = allData?.faqs || [];
  const auditLogs = allData?.auditLogs || [];
  const settings = allData?.settings || {};
  const esimProducts = allData?.esimProducts || [];

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus = enquiryStatusFilter === 'All' || e.status === enquiryStatusFilter;
    const term = enquirySearch.toLowerCase();
    const matchesTerm =
      e.fullName.toLowerCase().includes(term) ||
      e.whatsappMobile.toLowerCase().includes(term) ||
      e.preferredCountry.toLowerCase().includes(term);
    return matchesStatus && matchesTerm;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            A
          </div>
          <div>
            <h1 className="font-bold text-sm text-white">Athmanathan Study Abroad — Control Hub</h1>
            <span className="text-[11px] text-emerald-400 font-mono">
              Authenticated Session: {adminUser}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {statusMsg && (
            <span
              className={`text-xs px-3 py-1 rounded-md font-semibold ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-red-950 text-red-300 border border-red-800'
              }`}
            >
              {statusMsg.text}
            </span>
          )}

          <button
            onClick={loadAdminRecords}
            disabled={dataLoading}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh All Records"
          >
            <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
          >
            Return to Site
          </button>
        </div>
      </div>

      {/* Main Layout (Sidebar + Content) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-slate-900/70 border-r border-slate-800 p-4 space-y-1 shrink-0 overflow-y-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-2">
            Operations & CRM
          </span>

          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
              activeAdminTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('enquiries')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
              activeAdminTab === 'enquiries'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Candidate CRM</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-900 text-blue-200 font-mono font-bold">
              {enquiries.length}
            </span>
          </button>

          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 block mt-5 mb-2">
            Content Management
          </span>

          {[
            { id: 'countries', label: 'Countries Directory', icon: Globe, count: countries.length },
            { id: 'courses', label: 'Courses & Programs', icon: BookOpen, count: courses.length },
            { id: 'universities', label: 'Universities', icon: Building2, count: universities.length },
            { id: 'posters', label: 'Posters & Drives', icon: ImageIcon, count: posters.length },
            { id: 'scholarships', label: 'Scholarships', icon: Star, count: scholarships.length },
            { id: 'faqs', label: 'FAQs Accordion', icon: HelpCircle, count: faqs.length },
            { id: 'esims', label: 'eSIM & Roaming Plans', icon: Smartphone, count: esimProducts.length },
            { id: 'settings', label: 'Brand, Logo & Site Settings', icon: Settings },
            { id: 'audit', label: 'Security Audit Logs', icon: Clock, count: auditLogs.length },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveAdminTab(item.id as any)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  activeAdminTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </span>
                {item.count !== undefined && (
                  <span className="text-[10px] font-mono text-slate-500">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {/* TAB 1: OVERVIEW METRICS */}
          {activeAdminTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white font-serif">Platform Performance Overview</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-xs text-slate-400">Total Enquiries</span>
                  <div className="text-3xl font-extrabold text-white mt-1 font-mono">{enquiries.length}</div>
                  <span className="text-[11px] text-emerald-400 mt-1 block">
                    {enquiries.filter((e) => e.status === 'New').length} pending review
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-xs text-slate-400">Active Destinations</span>
                  <div className="text-3xl font-extrabold text-blue-400 mt-1 font-mono">{countries.length}</div>
                  <span className="text-[11px] text-slate-500 mt-1 block">UK, USA, Canada, Germany...</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-xs text-slate-400">Programs & Courses</span>
                  <div className="text-3xl font-extrabold text-indigo-400 mt-1 font-mono">{courses.length}</div>
                  <span className="text-[11px] text-slate-500 mt-1 block">Academic, IELTS, Languages</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-xs text-slate-400">Universities Listed</span>
                  <div className="text-3xl font-extrabold text-amber-400 mt-1 font-mono">{universities.length}</div>
                  <span className="text-[11px] text-slate-500 mt-1 block">With official admission links</span>
                </div>
              </div>

              {/* Brand & Logo Quick Control Banner */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 flex items-center justify-center text-white border border-blue-700/40 shrink-0 overflow-hidden">
                    {(settings.logoUrl || '/logo.jpeg') ? (
                      <img src={settings.logoUrl || '/logo.jpeg'} alt="Logo" className="w-full h-full object-contain p-1" />
                    ) : (
                      <GraduationCap className="w-6 h-6 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white uppercase">{settings.businessName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        Default Logo Active
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{settings.tagline}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveAdminTab('settings')}
                  className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Manage / Upload Brand Logo</span>
                </button>
              </div>

              {/* Recent Enquiries Table Preview */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-white">Recent Candidate Registrations</h3>
                  <button
                    onClick={() => setActiveAdminTab('enquiries')}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    Open CRM →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Student</th>
                        <th className="pb-2">WhatsApp</th>
                        <th className="pb-2">Country</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {enquiries.slice(0, 5).map((e) => (
                        <tr key={e.id}>
                          <td className="py-2.5">{new Date(e.createdAt).toLocaleDateString()}</td>
                          <td className="py-2.5 font-bold text-white">{e.fullName}</td>
                          <td className="py-2.5 font-mono text-emerald-400">{e.whatsappMobile}</td>
                          <td className="py-2.5">{e.preferredCountry}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-900/60 text-blue-300">
                              {e.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-right">
                            <a
                              href={buildWhatsAppLink(
                                `Hello ${e.fullName}, this is Athmanathan Study Abroad regarding your enquiry.`,
                                e.whatsappMobile
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:underline"
                            >
                              WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CANDIDATE CRM & ENQUIRIES */}
          {activeAdminTab === 'enquiries' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-serif">Candidate Relationship Management (CRM)</h2>
                  <p className="text-xs text-slate-400">Track student status from initial enquiry to arrival abroad.</p>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search candidates by name, mobile, country..."
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <select
                    value={enquiryStatusFilter}
                    onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="All">All Pipeline Stages</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Counselling">Counselling</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Applied">Applied</option>
                    <option value="Offer">Offer Received</option>
                    <option value="Visa">Visa Applied</option>
                    <option value="Travel">Travel Booked</option>
                    <option value="Arrived">Arrived Abroad</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* CRM Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">WhatsApp / Mobile</th>
                      <th className="p-3">Country & Course</th>
                      <th className="p-3">Qualification</th>
                      <th className="p-3">Pipeline Stage</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredEnquiries.map((enq) => {
                      const waLink = buildWhatsAppLink(
                        `Hello ${enq.fullName}, this is Athmanathan Study Abroad following up on your application for ${enq.preferredCountry}.`,
                        enq.whatsappMobile
                      );

                      return (
                        <tr key={enq.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-bold text-white">
                            <div>{enq.fullName}</div>
                            {enq.currentLocation && (
                              <div className="text-[11px] text-blue-400 font-normal flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                <span>{enq.currentLocation}</span>
                              </div>
                            )}
                            <div className="text-[10px] text-slate-500 font-normal">
                              {new Date(enq.createdAt).toLocaleString()}
                            </div>
                          </td>
                          <td className="p-3 font-mono text-emerald-400">
                            {enq.whatsappMobile}
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-200">{enq.preferredCountry}</div>
                            <div className="text-slate-400 text-[11px]">{enq.preferredCourse || 'General'}</div>
                          </td>
                          <td className="p-3">
                            <div>{enq.highestQualification || 'Not specified'}</div>
                            <div className="text-slate-500 text-[11px]">{enq.englishTestStatus}</div>
                          </td>
                          <td className="p-3">
                            <select
                              value={enq.status}
                              onChange={(e) => handleUpdateStatus(enq.id, e.target.value as CandidateStatus)}
                              className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-bold text-blue-300 focus:outline-hidden"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Counselling">Counselling</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Applied">Applied</option>
                              <option value="Offer">Offer</option>
                              <option value="Visa">Visa</option>
                              <option value="Travel">Travel</option>
                              <option value="Arrived">Arrived</option>
                              <option value="Completed">Completed</option>
                              <option value="Archived">Archived</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 hover:bg-emerald-900 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => setSelectedEnquiry(enq)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
                              >
                                Notes ({enq.notes?.length || 0})
                              </button>
                              <button
                                onClick={() => handleDeleteEnquiry(enq.id)}
                                className="p-1.5 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS & PARTNER */}
          {activeAdminTab === 'settings' && (
            <div className="max-w-3xl bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white font-serif">Site, Brand & Partner Configurations</h2>
                <p className="text-xs text-slate-400">
                  Manage official brand logo upload, agency contact information, and Happy Journey Holidays integration.
                </p>
              </div>

              {/* BRAND LOGO UPLOAD & IDENTITY CONTROL */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400 shrink-0">
                      <GraduationCap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Brand Logo & Header Visual</h3>
                      <p className="text-[11px] text-slate-400">Upload or configure the official logo displayed on the website header and footer</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border inline-flex items-center gap-1.5 ${
                    logoUrlInput && logoUrlInput !== '/logo.jpeg'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {logoUrlInput && logoUrlInput !== '/logo.jpeg' ? 'Custom Logo Active' : 'Default Brand Logo Active'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                  {/* Visual Header Preview */}
                  <div className="space-y-2">
                    <span className="block text-slate-300 font-semibold text-xs">Live Brand Header Preview</span>
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 flex items-center justify-center text-white shadow-md shadow-blue-950/40 border border-blue-700/50 shrink-0 overflow-hidden relative">
                        {(logoUrlInput || '/logo.jpeg') ? (
                          <img
                            src={logoUrlInput || '/logo.jpeg'}
                            alt="Brand Logo Preview"
                            className="w-full h-full object-contain p-1 rounded-lg"
                            onError={() => flashMessage('Invalid logo image URL or image failed to load', 'error')}
                          />
                        ) : (
                          <GraduationCap className="w-6 h-6 text-amber-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="block font-serif text-sm font-bold text-white uppercase truncate">
                          {settings.businessName || 'ATHMANATHAN STUDY ABROAD'}
                        </span>
                        <span className="block text-[10px] font-semibold text-blue-400 uppercase truncate">
                          {settings.tagline || 'Your Dream. Our Guidance.'}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Changes made here instantly update across the website navigation and footer.
                    </p>
                  </div>

                  {/* Upload Controls */}
                  <div className="space-y-3">
                    <span className="block text-slate-300 font-semibold text-xs">Logo Upload Options</span>
                    <input
                      type="file"
                      id="admin-logo-upload"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
                      onChange={handleLogoUpload}
                      disabled={logoUploading}
                      className="hidden"
                    />
                    <label
                      htmlFor="admin-logo-upload"
                      className={`w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-blue-500/40 bg-blue-950/20 hover:bg-blue-900/30 hover:border-blue-400 text-blue-300 font-semibold text-xs cursor-pointer transition-all ${
                        logoUploading ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      {logoUploading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                          <span>Uploading & Processing Logo...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-blue-400" />
                          <span>Choose File (PNG, SVG, JPG, WEBP)</span>
                        </>
                      )}
                    </label>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={logoUrlInput}
                        onChange={(e) => setLogoUrlInput(e.target.value)}
                        placeholder="Or paste external image URL (e.g. https://...)"
                        className="flex-1 min-w-[180px] px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleSetAsDefault}
                        className="px-3 py-2 rounded-lg bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-700/50 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors shrink-0"
                        title="Set this logo as default"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Set as Default</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors shrink-0"
                        title="Reset to default brand logo"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <form
                onSubmit={async (e: any) => {
                  e.preventDefault();
                  const form = e.target;
                  try {
                    await adminUpdateSettings({
                      ...settings,
                      logoUrl: logoUrlInput.trim(),
                      phone: form.phone.value,
                      whatsapp: form.whatsapp.value,
                      email: form.email.value,
                      address: form.address.value,
                      googleMapsUrl: form.googleMapsUrl?.value || settings.googleMapsUrl || 'https://maps.app.goo.gl/pvmJsk8P65znkmt46?g_st=awb',
                      googleProfileUrl: form.googleProfileUrl?.value || settings.googleProfileUrl || 'https://share.google/s1ZUKgcqlCbMBB2zN',
                      facebookUrl: form.facebookUrl?.value || settings.facebookUrl || 'https://www.facebook.com/share/1HcacNz8FK/',
                      instagramUrl: form.instagramUrl?.value || settings.instagramUrl || 'https://www.instagram.com/athmanathanstudyabroad?utm_source=qr&stkn=bnFlajMyaHFpN2Z1',
                      registrationNumber: form.registrationNumber?.value || '',
                      partnerName: form.partnerName.value,
                      partnerUrl: form.partnerUrl.value,
                      esimPurchaseUrl: form.esimPurchaseUrl?.value || 'https://discover.airalo.com/happyjourneyholidays/',
                      workingHours: form.workingHours?.value || settings.workingHours,
                    });
                    flashMessage('Settings saved successfully');
                    loadAdminRecords();
                    if (onDataRefresh) onDataRefresh();
                  } catch (err: any) {
                    flashMessage(err.message, 'error');
                  }
                }}
                className="space-y-4 text-xs pt-2"
              >
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    name="phone"
                    defaultValue={settings.phone}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">WhatsApp Mobile</label>
                  <input
                    name="whatsapp"
                    defaultValue={settings.whatsapp}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Official Email</label>
                  <input
                    name="email"
                    defaultValue={settings.email}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Office Address</label>
                  <input
                    name="address"
                    defaultValue={settings.address}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Office Working Hours</label>
                  <input
                    name="workingHours"
                    defaultValue={settings.workingHours}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Government / Agency Registration Number</label>
                  <input
                    name="registrationNumber"
                    defaultValue={settings.registrationNumber || ''}
                    placeholder="e.g. Govt. Regd. (MSME UDYAM-TN-03-0134152)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Displayed on student enquiry & registration forms as official registration badge</span>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <h3 className="font-bold text-blue-400 mb-2">Google Profile & Social Media Links</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Google Business Profile Link</label>
                      <input
                        name="googleProfileUrl"
                        defaultValue={settings.googleProfileUrl || 'https://share.google/s1ZUKgcqlCbMBB2zN'}
                        placeholder="https://share.google/..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs"
                      />
                      <span className="text-[11px] text-slate-400 mt-0.5 block">ATHMANATHAN STUDY ABROAD Google Profile & Reviews link</span>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Google Maps Location Link</label>
                      <input
                        name="googleMapsUrl"
                        defaultValue={settings.googleMapsUrl || 'https://maps.app.goo.gl/pvmJsk8P65znkmt46?g_st=awb'}
                        placeholder="https://maps.app.goo.gl/..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs"
                      />
                      <span className="text-[11px] text-slate-400 mt-0.5 block">Direct Google Maps directions and pin link for office</span>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Facebook Page Link</label>
                      <input
                        name="facebookUrl"
                        defaultValue={settings.facebookUrl || 'https://www.facebook.com/share/1HcacNz8FK/'}
                        placeholder="https://www.facebook.com/..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Instagram Profile Link</label>
                      <input
                        name="instagramUrl"
                        defaultValue={settings.instagramUrl || 'https://www.instagram.com/athmanathanstudyabroad?utm_source=qr&stkn=bnFlajMyaHFpN2Z1'}
                        placeholder="https://www.instagram.com/..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <h3 className="font-bold text-blue-400 mb-2">Partner Integration: Happy Journey Holidays</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Partner Brand Name</label>
                      <input
                        name="partnerName"
                        defaultValue={settings.partnerName}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Partner Website Link</label>
                      <input
                        name="partnerUrl"
                        defaultValue={settings.partnerUrl}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        eSIM Purchase Store Link (Airalo Partner Portal)
                      </label>
                      <input
                        name="esimPurchaseUrl"
                        defaultValue={settings.esimPurchaseUrl || 'https://discover.airalo.com/happyjourneyholidays/'}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs"
                      />
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        Co-branded link where students purchase eSIMs online: https://discover.airalo.com/happyjourneyholidays/
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
                  >
                    Save All Settings & Brand Logo
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: AUDIT LOGS */}
          {activeAdminTab === 'audit' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-serif">Security & Modification Audit Trail</h2>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Admin</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Entity</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                    {auditLogs.map((log: any) => (
                      <tr key={log.id}>
                        <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="p-3 font-bold text-blue-400">{log.adminUser}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 text-amber-400">{log.entity}</td>
                        <td className="p-3 text-slate-400 font-sans text-xs">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: COUNTRIES CRUD */}
          {activeAdminTab === 'countries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-serif">Countries Management</h2>
                <button
                  onClick={async () => {
                    const name = prompt('Enter new Country Name (e.g. Netherlands):');
                    if (!name) return;
                    try {
                      await adminSaveCountry({
                        name,
                        code: name.slice(0, 3).toUpperCase(),
                        flag: '🌐',
                        coverImage: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200&auto=format&fit=crop&q=80',
                        description: `${name} is an attractive study abroad destination.`,
                        capital: 'Capital City',
                        majorCities: ['City A', 'City B'],
                        currency: 'EUR',
                        currencyCode: 'EUR',
                        timeZone: 'UTC+1',
                        mainLanguage: 'English',
                        studyLevels: ["Bachelor's", "Master's"],
                        intakes: ['September', 'February'],
                        entryRequirements: 'Minimum 60% in academic background.',
                        englishRequirements: 'IELTS 6.0 or equivalent.',
                        applicationProcess: 'Direct application through university portal.',
                        visaOverview: 'Standard student residence permit.',
                        scholarshipInfo: 'University merit discounts available.',
                        workOpportunities: 'Part-time student employment permitted.',
                        postStudyOptions: '1-Year post study orientation permit.',
                        generalSafety: 'High standard of student safety.',
                        drinkingWaterGuidance: 'Tap water safe.',
                        officialVisaLink: 'https://www.government.nl',
                        officialUniversityLink: 'https://www.studyin.nl',
                        published: true,
                        order: countries.length + 1,
                      });
                      flashMessage(`Created ${name}`);
                      loadAdminRecords();
                      if (onDataRefresh) onDataRefresh();
                    } catch (e: any) {
                      flashMessage(e.message, 'error');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Country</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {countries.map((c: any) => (
                  <div key={c.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <h4 className="font-bold text-white text-sm">{c.name}</h4>
                        <span className="text-xs text-slate-400">Capital: {c.capital}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          const newCapital = prompt('Update Capital:', c.capital);
                          if (newCapital === null) return;
                          await adminSaveCountry({ ...c, capital: newCapital }, c.id);
                          flashMessage('Updated country');
                          loadAdminRecords();
                          if (onDataRefresh) onDataRefresh();
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Edit Capital"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete ${c.name}?`)) {
                            await adminDeleteCountry(c.id);
                            flashMessage('Deleted country');
                            loadAdminRecords();
                            if (onDataRefresh) onDataRefresh();
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-950 text-red-400 hover:bg-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: POSTERS CRUD */}
          {activeAdminTab === 'posters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-serif">Posters & Drives Management</h2>
                <button
                  onClick={async () => {
                    const title = prompt('Poster Title:');
                    if (!title) return;
                    const description = prompt('Description:');
                    await adminSavePoster({
                      title,
                      description: description || 'Upcoming study abroad admission drive.',
                      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
                      category: 'Admissions',
                      date: new Date().toLocaleDateString(),
                      ctaText: 'Enquire on WhatsApp',
                      customWhatsAppMsg: `Hello Athmanathan Study Abroad, I am interested in ${title}.`,
                      published: true,
                      order: posters.length + 1,
                    });
                    flashMessage('Poster published');
                    loadAdminRecords();
                    if (onDataRefresh) onDataRefresh();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Poster</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {posters.map((p: any) => (
                  <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
                    <div>
                      <img src={p.imageUrl} alt={p.title} className="h-40 w-full object-cover" />
                      <div className="p-4">
                        <span className="text-[10px] font-bold text-blue-400 uppercase">{p.category}</span>
                        <h4 className="font-bold text-white text-sm mt-1">{p.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                      </div>
                    </div>
                    <div className="p-3 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={async () => {
                          if (window.confirm('Delete this poster?')) {
                            await adminDeletePoster(p.id);
                            flashMessage('Poster deleted');
                            loadAdminRecords();
                            if (onDataRefresh) onDataRefresh();
                          }
                        }}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Delete Poster
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: COURSES, UNIVERSITIES, FAQS, SCHOLARSHIPS QUICK VIEWS */}
          {['courses', 'universities', 'scholarships', 'faqs'].includes(activeAdminTab) && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-serif capitalize">{activeAdminTab} Directory Management</h2>
              <p className="text-xs text-slate-400">
                All records stored with atomic persistence in the production JSON database.
              </p>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <p className="text-xs text-slate-300">
                  Total entries currently configured: {
                    activeAdminTab === 'courses' ? courses.length :
                    activeAdminTab === 'universities' ? universities.length :
                    activeAdminTab === 'scholarships' ? scholarships.length : faqs.length
                  }.
                </p>
                <div className="mt-3 space-y-2 max-h-[60vh] overflow-y-auto">
                  {(activeAdminTab === 'courses' ? courses :
                    activeAdminTab === 'universities' ? universities :
                    activeAdminTab === 'scholarships' ? scholarships : faqs
                  ).map((item: any) => (
                    <div key={item.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{item.name || item.title || item.question}</span>
                        <p className="text-slate-400 line-clamp-1">{item.description || item.answer || item.eligibility}</p>
                      </div>
                      <button
                        onClick={async () => {
                          if (!window.confirm('Delete item?')) return;
                          if (activeAdminTab === 'courses') await adminDeleteCourse(item.id);
                          if (activeAdminTab === 'universities') await adminDeleteUniversity(item.id);
                          if (activeAdminTab === 'scholarships') await adminDeleteScholarship(item.id);
                          if (activeAdminTab === 'faqs') await adminDeleteFaq(item.id);
                          flashMessage('Item deleted');
                          loadAdminRecords();
                          if (onDataRefresh) onDataRefresh();
                        }}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ESIM & ROAMING DATA PLANS */}
          {activeAdminTab === 'esims' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-teal-400" />
                    <span>International eSIM & Roaming Packages</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage student data packages, validity, and verified INR pricing displayed on the public eSIM portal.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-xl font-semibold">
                    {esimProducts.length} Destinations Configured
                  </span>
                </div>
              </div>

              {/* Partner Store Status Card */}
              <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Online eSIM Partner Store</span>
                      <span className="text-[10px] bg-teal-900/60 text-teal-300 border border-teal-700/60 px-2 py-0.5 rounded font-mono">Airalo Co-Branded Portal</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5 break-all">
                      {settings.esimPurchaseUrl || 'https://discover.airalo.com/happyjourneyholidays/'}
                    </p>
                  </div>
                </div>
                <a
                  href={settings.esimPurchaseUrl || 'https://discover.airalo.com/happyjourneyholidays/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <span>Test Partner Store Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* eSIM Cards */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {esimProducts.map((product: any) => (
                  <div
                    key={product.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{product.flag}</span>
                        <div>
                          <h3 className="font-bold text-white text-base font-serif">
                            {product.destination}
                          </h3>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Country Code: {product.countryCode} • {product.plans?.length || 0} Plans Active
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        product.published !== false
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {product.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    {/* Plans List with Explicit Prices */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-blue-400" />
                        <span>Configured Plans & Current Prices:</span>
                      </span>

                      {(product.plans || []).map((plan: any) => (
                        <div
                          key={plan.id}
                          className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs sm:text-sm">
                                {plan.dataAmount}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-semibold">
                                {plan.validity}
                              </span>
                            </div>
                            {plan.description && (
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                {plan.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {/* Prominent Price Tag */}
                            <div className="text-right">
                              <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">Price</span>
                              <span className="font-black text-emerald-400 font-mono text-sm sm:text-base leading-tight">
                                ₹{typeof plan.priceInr === 'number' ? plan.priceInr.toLocaleString('en-IN') : plan.priceInr || 1450}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingEsimPlan({
                                  productId: product.id,
                                  destination: product.destination,
                                  planId: plan.id,
                                  dataAmount: plan.dataAmount || '',
                                  validity: plan.validity || '',
                                  priceInr: Number(plan.priceInr) || 1450,
                                  description: plan.description || '',
                                });
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Edit Price"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit Price</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Features list */}
                    {product.features && product.features.length > 0 && (
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap gap-2">
                        {product.features.map((feat: string, idx: number) => (
                          <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit eSIM Plan Price Dialog */}
      {editingEsimPlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-teal-400" />
                  <span>Edit Plan Price</span>
                </h3>
                <span className="text-xs text-slate-400">
                  {editingEsimPlan.destination} — {editingEsimPlan.dataAmount}
                </span>
              </div>
              <button
                onClick={() => setEditingEsimPlan(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Price in Indian Rupees (₹ INR) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={editingEsimPlan.priceInr}
                    onChange={(e) =>
                      setEditingEsimPlan({
                        ...editingEsimPlan,
                        priceInr: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white font-mono font-bold text-base focus:border-blue-500 focus:outline-none"
                    placeholder="1450"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Students will see: ₹{editingEsimPlan.priceInr.toLocaleString('en-IN')} (All inclusive)
                </span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Data Allowance Label
                </label>
                <input
                  type="text"
                  value={editingEsimPlan.dataAmount}
                  onChange={(e) =>
                    setEditingEsimPlan({
                      ...editingEsimPlan,
                      dataAmount: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. 10 GB High Speed Data"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Validity Period
                </label>
                <input
                  type="text"
                  value={editingEsimPlan.validity}
                  onChange={(e) =>
                    setEditingEsimPlan({
                      ...editingEsimPlan,
                      validity: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. 30 Days"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Plan Description / Features
                </label>
                <input
                  type="text"
                  value={editingEsimPlan.description}
                  onChange={(e) =>
                    setEditingEsimPlan({
                      ...editingEsimPlan,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Includes local phone number + free incoming calls"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingEsimPlan(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdatingPrice || editingEsimPlan.priceInr <= 0}
                onClick={async () => {
                  try {
                    setIsUpdatingPrice(true);
                    const prod = esimProducts.find((p: any) => p.id === editingEsimPlan.productId);
                    if (!prod) throw new Error('Product not found');

                    const updatedPlans = (prod.plans || []).map((pl: any) => {
                      if (pl.id === editingEsimPlan.planId) {
                        return {
                          ...pl,
                          priceInr: Number(editingEsimPlan.priceInr),
                          dataAmount: editingEsimPlan.dataAmount,
                          validity: editingEsimPlan.validity,
                          description: editingEsimPlan.description,
                        };
                      }
                      return pl;
                    });

                    await adminSaveEsim({
                      ...prod,
                      plans: updatedPlans,
                    }, prod.id);

                    flashMessage(`Updated price for ${editingEsimPlan.destination} (${editingEsimPlan.dataAmount}) to ₹${editingEsimPlan.priceInr}`);
                    setEditingEsimPlan(null);
                    await loadAdminRecords();
                    if (onDataRefresh) onDataRefresh();
                  } catch (err: any) {
                    flashMessage(err.message || 'Failed to update price', 'error');
                  } finally {
                    setIsUpdatingPrice(false);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isUpdatingPrice ? 'Saving Price...' : 'Save Updated Price'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Notes Dialog */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base">
                Notes for: {selectedEnquiry.fullName}
              </h3>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto mb-4 text-xs">
              {selectedEnquiry.notes && selectedEnquiry.notes.length > 0 ? (
                selectedEnquiry.notes.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span>{n.author}</span>
                      <span>{new Date(n.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-200">{n.note}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic">No notes recorded yet.</p>
              )}
            </div>

            <div className="space-y-2">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Type counsellor remark or follow-up note..."
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                rows={2}
              ></textarea>
              <button
                onClick={() => {
                  handleAddNote(selectedEnquiry.id);
                  setSelectedEnquiry(null);
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold"
              >
                Add Candidate Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
