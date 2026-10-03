import React, { useState } from 'react';
import {
  GraduationCap,
  Menu,
  X,
  Phone,
  MessageCircle,
  Globe,
  BookOpen,
  Building2,
  Compass,
  Award,
  Smartphone,
  Image as ImageIcon,
  HelpCircle,
  Mail,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Luggage,
  Facebook,
  Instagram,
  MapPin,
} from 'lucide-react';
import { SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';

interface NavbarProps {
  settings: SiteSettings;
  activePage?: string;
  activeTab?: string;
  onNavigate?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  onOpenEnquiry: (context?: string) => void;
  onOpenGuidance?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activePage,
  activeTab,
  onNavigate,
  setActiveTab,
  onOpenEnquiry,
  onOpenGuidance,
}) => {
  const currentActive = activePage || activeTab || 'home';
  const handleNavChange = (id: string) => {
    if (onNavigate) onNavigate(id);
    if (setActiveTab) setActiveTab(id);
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const allNavLinks = [
    { id: 'home', label: 'Home', icon: GraduationCap },
    { id: 'countries', label: 'Countries', icon: Globe },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'universities', label: 'Universities', icon: Building2 },
    { id: 'irs', label: 'IRS Hub', icon: Sparkles },
    { id: 'services', label: 'Services', icon: Compass },
    { id: 'ielts-languages', label: 'IELTS & Languages', icon: Award },
    { id: 'scholarships', label: 'Scholarships', icon: Sparkles },
    { id: 'student-essentials', label: 'Student Essentials', icon: Luggage },
    { id: 'esims', label: 'eSIM', icon: Smartphone },
    { id: 'posters', label: 'Posters', icon: ImageIcon },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'about', label: 'About Us', icon: ShieldCheck },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const handleNavClick = (id: string) => {
    handleNavChange(id);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsAppUrl = buildWhatsAppLink(
    'Hello Athmanathan Study Abroad, I am interested in overseas education guidance and would like to explore my study options.',
    settings.whatsapp
  );

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top emergency / advisory & direct contact strip */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Admissions Open for 2026 Intakes
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">
              Personalised Guidance for Indian Students & Parents
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{settings.phone}</span>
            </a>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-2.5">
              <a
                href={settings.googleMapsUrl || 'https://maps.app.goo.gl/pvmJsk8P65znkmt46?g_st=awb'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 hover:text-emerald-200 transition-colors flex items-center gap-1 text-[11px]"
                title="Office Location on Google Maps"
              >
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span className="hidden lg:inline">Maps</span>
              </a>
              <a
                href={settings.googleProfileUrl || 'https://share.google/s1ZUKgcqlCbMBB2zN'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1 text-[11px]"
                title="ATHMANATHAN STUDY ABROAD on Google"
              >
                <Globe className="w-3 h-3 text-blue-400" />
                <span className="hidden md:inline">Google</span>
              </a>
              <a
                href={settings.facebookUrl || 'https://www.facebook.com/share/1HcacNz8FK/'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-blue-400 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-3 h-3" />
              </a>
              <a
                href={settings.instagramUrl || 'https://www.instagram.com/athmanathanstudyabroad?utm_source=qr&stkn=bnFlajMyaHFpN2Z1'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-pink-400 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand & Action bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo / Brand */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-hidden group cursor-pointer"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 flex items-center justify-center text-white shadow-md shadow-blue-950/20 group-hover:scale-105 transition-transform border border-blue-700/50 shrink-0 overflow-hidden relative">
              {(settings.logoUrl || '/logo.jpeg') ? (
                <img
                  src={settings.logoUrl || '/logo.jpeg'}
                  alt={settings.businessName}
                  className="w-full h-full object-contain p-1 rounded-lg"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
              )}
            </div>
            <div>
              <span className="block font-serif tracking-tight text-base sm:text-xl font-bold text-slate-900 uppercase leading-tight">
                {settings.businessName}
              </span>
              <span className="block text-[11px] sm:text-xs font-semibold tracking-wider text-blue-700 uppercase">
                {settings.tagline}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main Navigation">
            {allNavLinks.slice(0, 6).map((link) => {
              const isActive = currentActive === link.id;
              const isIrs = link.id === 'irs';
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isIrs
                      ? isActive
                        ? 'text-white bg-indigo-900 font-bold shadow-xs border border-indigo-700'
                        : 'text-indigo-900 bg-indigo-50/80 hover:bg-indigo-100/90 font-bold border border-indigo-200'
                      : isActive
                      ? 'text-blue-900 bg-blue-50 font-bold'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100/80'
                  }`}
                >
                  {isIrs ? (
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{link.label}</span>
                    </span>
                  ) : (
                    link.label
                  )}
                </button>
              );
            })}

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs xl:text-sm font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-100/80 rounded-lg transition-colors cursor-pointer"
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  {allNavLinks.slice(6).map((link) => {
                    const Icon = link.icon;
                    const isActive = currentActive === link.id;
                    return (
                      <button
                        key={link.id}
                        onClick={() => {
                          handleNavClick(link.id);
                          setMoreDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs sm:text-sm flex items-center gap-2.5 hover:bg-slate-50 cursor-pointer ${
                          isActive ? 'text-blue-700 font-semibold bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{link.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Action CTAs & Drawer Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenGuidance && (
              <button
                onClick={() => onOpenGuidance()}
                className="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100/80 rounded-lg transition-colors border border-blue-200 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-blue-700" />
                <span>Course Matcher</span>
              </button>
            )}

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-950" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => onOpenEnquiry('Top Navigation Bar')}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <span>Enquire Now</span>
            </button>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 max-h-[85vh] overflow-y-auto shadow-2xl">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {onOpenGuidance && (
              <button
                onClick={() => {
                  onOpenGuidance();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 p-2.5 text-xs font-semibold text-blue-900 bg-blue-50 rounded-lg border border-blue-200"
              >
                <Compass className="w-4 h-4 text-blue-700" />
                <span>Course Matcher</span>
              </button>
            )}

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 p-2.5 text-xs font-semibold text-emerald-950 bg-emerald-400 rounded-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat WhatsApp</span>
            </a>
          </div>

          <div className="space-y-1">
            {allNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentActive === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-3 ${
                    isActive
                      ? 'text-blue-900 bg-blue-50 font-bold border-l-4 border-blue-900'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-900' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-700" />
              <span>{settings.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-700" />
              <span>{settings.email}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
