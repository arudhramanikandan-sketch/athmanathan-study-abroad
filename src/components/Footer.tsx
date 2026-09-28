import React from 'react';
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Plane,
  Facebook,
  Instagram,
  Globe,
} from 'lucide-react';
import { SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';

interface FooterProps {
  settings: SiteSettings;
  setActiveTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  onOpenLegal?: (topic: string) => void;
  onOpenLegalModal?: (topic: string) => void;
  onOpenEnquiry?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  setActiveTab,
  onNavigate,
  onOpenLegal,
  onOpenLegalModal,
  onOpenEnquiry,
}) => {
  const currentYear = new Date().getFullYear();

  const handleNav = (tab: string) => {
    if (onNavigate) onNavigate(tab);
    if (setActiveTab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLegal = (topic: string) => {
    if (onOpenLegalModal) onOpenLegalModal(topic);
    if (onOpenLegal) onOpenLegal(topic);
  };

  const whatsAppUrl = buildWhatsAppLink(
    'Hello Athmanathan Study Abroad, I would like to book a free initial profile consultation.',
    settings.whatsapp
  );

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Travel & Support Partner Association Section (Cleanly separated as required by Rule 23) */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400 shrink-0">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase block mb-1">
                Associated With / Our Travel & Support Partner
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {settings.partnerName}
              </h3>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Assisting our overseas students with international flight itineraries, extra baggage allowances, student transit, and travel insurance.
              </p>
            </div>
          </div>

          <a
            href={settings.partnerUrl || 'https://happyjourneyholidays.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 hover:border-slate-600 transition-colors shrink-0"
          >
            <span>Visit Happy Journey Holidays</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white border border-blue-500/30 overflow-hidden relative">
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
                  <GraduationCap className="w-6 h-6 text-amber-400" />
                )}
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight block uppercase">
                  {settings.businessName}
                </span>
                <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase block">
                  {settings.tagline}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A student-focused overseas education consultancy dedicated to helping Indian students and parents make informed, ethical, and responsible decisions about global university education.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition-colors">
                  WhatsApp: {settings.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span>{settings.address}</span>
                  <a
                    href={settings.googleMapsUrl || 'https://maps.app.goo.gl/pvmJsk8P65znkmt46?g_st=awb'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium hover:underline mt-0.5"
                  >
                    <span>View Location on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{settings.workingHours}</span>
              </div>
            </div>

            {/* Official Profiles & Social Channels */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Official Profiles & Socials
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={settings.googleProfileUrl || 'https://share.google/s1ZUKgcqlCbMBB2zN'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/70 hover:bg-blue-900 border border-blue-600/40 text-blue-300 text-xs font-semibold transition-colors"
                  title="ATHMANATHAN STUDY ABROAD on Google"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Google Profile</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
                <a
                  href={settings.googleMapsUrl || 'https://maps.app.goo.gl/pvmJsk8P65znkmt46?g_st=awb'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300 text-xs font-semibold transition-colors"
                  title="Google Maps Location"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400/70" />
                </a>
                <a
                  href={settings.facebookUrl || 'https://www.facebook.com/share/1HcacNz8FK/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors"
                  title="Follow on Facebook"
                >
                  <Facebook className="w-3.5 h-3.5 text-blue-400" />
                  <span>Facebook</span>
                </a>
                <a
                  href={settings.instagramUrl || 'https://www.instagram.com/athmanathanstudyabroad?utm_source=qr&stkn=bnFlajMyaHFpN2Z1'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-pink-600 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors"
                  title="Follow on Instagram"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('countries')} className="hover:text-white transition-colors">
                  Study Abroad Countries
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('courses')} className="hover:text-white transition-colors">
                  Course Finder
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('universities')} className="hover:text-white transition-colors">
                  Universities & Colleges
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('irs')} className="text-teal-400 hover:text-teal-300 font-semibold transition-colors flex items-center gap-1">
                  <span>IRS Study Abroad Hub</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950 border border-indigo-500/40 text-indigo-300">Dedicated</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors">
                  Our Services
                </button>
              </li>
            </ul>
          </div>

          {/* Student Solutions */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Student Solutions
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => handleNav('ielts-languages')} className="hover:text-white transition-colors">
                  IELTS & Languages
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('scholarships')} className="hover:text-white transition-colors">
                  Scholarship Guidance
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('student-essentials')} className="hover:text-white transition-colors">
                  Student Essentials
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('esim')} className="hover:text-white transition-colors">
                  International eSIM
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('posters')} className="hover:text-white transition-colors">
                  Posters & Updates
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faqs')} className="hover:text-white transition-colors">
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Trust, Disclaimers & Transparency */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Transparency</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => handleLegal('no-guarantee')} className="hover:text-white text-left transition-colors">
                  No Admission Guarantee
                </button>
              </li>
              <li>
                <button onClick={() => handleLegal('no-visa-guarantee')} className="hover:text-white text-left transition-colors">
                  No Visa Guarantee
                </button>
              </li>
              <li>
                <button onClick={() => handleLegal('scholarship-disclaimer')} className="hover:text-white text-left transition-colors">
                  Scholarship Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleLegal('parent-notice')} className="hover:text-white text-left transition-colors">
                  Parent / Guardian Notice
                </button>
              </li>
              <li>
                <button onClick={() => handleLegal('privacy')} className="hover:text-white text-left transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleLegal('terms')} className="hover:text-white text-left transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Transparency & Regulatory Disclaimer Notice */}
        <div className="my-8 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1">
            Important Transparency & Responsible Guidance Commitment:
          </p>
          <p>
            {settings.disclaimerNotice} Requirements and immigration regulations may change. Students are encouraged to verify current criteria through relevant official university and government authorities.
          </p>
        </div>

        {/* Copyright and Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {currentYear} {settings.businessName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href={settings.googleMapsUrl || 'https://maps.app.goo.gl/pvmJsk8P65znkmt46?g_st=awb'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Google Maps
            </a>
            <span>•</span>
            <a
              href={settings.googleProfileUrl || 'https://share.google/s1ZUKgcqlCbMBB2zN'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-300 transition-colors"
            >
              Google Profile
            </a>
            <span>•</span>
            <a
              href={settings.facebookUrl || 'https://www.facebook.com/share/1HcacNz8FK/'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-300 transition-colors"
            >
              Facebook
            </a>
            <span>•</span>
            <a
              href={settings.instagramUrl || 'https://www.instagram.com/athmanathanstudyabroad?utm_source=qr&stkn=bnFlajMyaHFpN2Z1'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-pink-300 transition-colors"
            >
              Instagram
            </a>
            <span>•</span>
            <button
              onClick={() => onOpenEnquiry && onOpenEnquiry()}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Request Free Consultation
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
