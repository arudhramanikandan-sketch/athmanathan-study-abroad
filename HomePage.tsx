import React from 'react';
import {
  Globe,
  BookOpen,
  Building2,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle,
  Sparkles,
  Plane,
  ExternalLink,
  ChevronRight,
  Star,
  Calendar,
  Compass,
  Smartphone,
  Image as ImageIcon,
  HelpCircle,
  Mail,
  Luggage,
} from 'lucide-react';
import { PublicBootstrapData } from '../types';
import { buildWhatsAppLink } from '../api';
import { JourneyRoadmap } from '../components/JourneyRoadmap';
import { LiveCurrencyBar } from '../components/LiveCurrencyBar';
import { LiveWeatherCard } from '../components/LiveWeatherCard';

interface HomePageProps {
  data: PublicBootstrapData;
  onNavigate?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  onOpenEnquiry: (context?: string) => void;
  onOpenGuidance?: () => void;
  onSelectCountry?: (id: string) => void;
  onSelectCourse?: (id: string) => void;
  onSelectUniversity?: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  data,
  onNavigate,
  setActiveTab,
  onOpenEnquiry,
  onOpenGuidance,
  onSelectCountry,
  onSelectCourse,
  onSelectUniversity,
}) => {
  const navigate = onNavigate || setActiveTab || (() => {});
  const { settings, countries, courses, universities, services, posters, testimonials, events } = data;

  const mainWhatsAppUrl = buildWhatsAppLink(
    'Hello Athmanathan Study Abroad, I would like to explore my study abroad options and book a counselling session.',
    settings.whatsapp
  );

  const mainPageMenuItems = [
    { id: 'countries', label: 'Countries', desc: `${countries?.length || 15}+ Global Hubs`, icon: Globe, highlight: 'border-blue-500/30 bg-blue-950/40 hover:border-blue-400' },
    { id: 'courses', label: 'Courses', desc: `${courses?.length || 100}+ Disciplines`, icon: BookOpen, highlight: 'border-indigo-500/30 bg-indigo-950/40 hover:border-indigo-400' },
    { id: 'universities', label: 'Universities', desc: `${universities?.length || 40}+ Verified`, icon: Building2, highlight: 'border-cyan-500/30 bg-cyan-950/40 hover:border-cyan-400' },
    { id: 'services', label: 'Admissions & Visa', desc: 'A-Z Guidance', icon: Compass, highlight: 'border-sky-500/30 bg-sky-950/40 hover:border-sky-400' },
    { id: 'ielts-languages', label: 'IELTS & Languages', desc: 'Expert Training', icon: Award, highlight: 'border-amber-500/30 bg-amber-950/40 hover:border-amber-400' },
    { id: 'scholarships', label: 'Scholarships', desc: 'Grants & Funding', icon: Sparkles, highlight: 'border-purple-500/30 bg-purple-950/40 hover:border-purple-400' },
    { id: 'student-essentials', label: 'Student Essentials', desc: 'Forex & Insurance', icon: Luggage, highlight: 'border-emerald-500/30 bg-emerald-950/40 hover:border-emerald-400' },
    { id: 'esims', label: 'eSIM Data', desc: 'Airalo Partner (200+)', icon: Smartphone, highlight: 'border-teal-500/30 bg-teal-950/40 hover:border-teal-400' },
    { id: 'posters', label: 'Noticeboard', desc: 'Upcoming Intakes', icon: ImageIcon, highlight: 'border-rose-500/30 bg-rose-950/40 hover:border-rose-400' },
    { id: 'faqs', label: 'FAQ Guide', desc: 'Visa & Entry Rules', icon: HelpCircle, highlight: 'border-slate-600/30 bg-slate-900/60 hover:border-slate-400' },
    { id: 'about', label: 'About Us', desc: 'Govt. Regd. (MSME)', icon: ShieldCheck, highlight: 'border-blue-500/30 bg-blue-950/40 hover:border-blue-400' },
    { id: 'contact', label: 'Contact Office', desc: 'Coimbatore HQ', icon: Mail, highlight: 'border-slate-600/30 bg-slate-900/60 hover:border-slate-400' },
  ];

  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Subtle geometric backdrop */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{settings.tagline}</span>
            </div>

            {/* Business Name */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-serif uppercase">
              {settings.businessName}
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-2xl font-medium text-blue-200 tracking-wide font-sans max-w-3xl mx-auto">
              {settings.heroSubheadline}
            </p>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Ethical, transparent, and personalised overseas education guidance designed primarily for Indian students and parents. Real admissions support from course selection through post-arrival welfare.
            </p>

            {/* 3 Main CTAs specified in Section 4 */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {/* Primary CTA: Explore Countries */}
              <button
                onClick={() => {
                  navigate('countries');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base transition-all shadow-lg shadow-blue-900/40 hover:scale-105"
              >
                <Globe className="w-5 h-5 text-blue-200" />
                <span>Explore Countries</span>
              </button>

              {/* Secondary CTA: Explore Courses */}
              <button
                onClick={() => {
                  navigate('courses');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 transition-all hover:scale-105"
              >
                <BookOpen className="w-5 h-5 text-amber-300" />
                <span>Explore Courses</span>
              </button>

              {/* Third CTA: Chat on WhatsApp */}
              <a
                href={mainWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-lg shadow-emerald-950/40 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/80 max-w-2xl mx-auto">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Zero Misleading Guarantees
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Official University Portals
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Complete Pre & Post Departure Care
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN PAGE MENU BAR (Interactive Quick Directory Bar) */}
      <section id="main-page-menu-bar" className="bg-slate-950 text-white py-6 border-y border-slate-800 shadow-xl relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner shrink-0">
                <Compass className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-serif">
                    Main Portal Menu & Directories
                  </h2>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-mono font-semibold">
                    12 Sections
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Instant one-click navigation to all programs, countries, coaching, essentials & admissions tools
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs shrink-0">
              {onOpenGuidance && (
                <button
                  type="button"
                  onClick={() => onOpenGuidance()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-400/30 font-medium transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Course Matcher</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onOpenEnquiry('Main Page Menu Bar')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium transition-colors cursor-pointer"
              >
                <span>Book Consultation</span>
              </button>
            </div>
          </div>

          {/* Quick Menu Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {mainPageMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    navigate(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`group relative flex flex-col p-3 rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-950/60 cursor-pointer ${item.highlight}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-blue-500 group-hover:text-white text-blue-300 flex items-center justify-center transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-200 transition-colors leading-snug">
                    {item.label}
                  </span>
                  <span className="text-[11px] text-slate-400 group-hover:text-slate-200 transition-colors mt-0.5 truncate">
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MAIN JOURNEY (SECTION 5) */}
      <JourneyRoadmap />

      {/* 4. FEATURED COUNTRIES SECTION */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
                Global Study Destinations
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
                Explore Top Countries
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-xl">
                Compare post-study work permits, living costs, intakes, and official embassy visa rules for premier education hubs.
              </p>
            </div>

            <button
              onClick={() => {
                navigate('countries');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-blue-700 transition-colors"
            >
              <span>View All {countries.length} Countries</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {countries.slice(0, 8).map((c) => {
              const countryWaLink = buildWhatsAppLink(
                `Hello Athmanathan Study Abroad, I am interested in studying in ${c.name}. Please guide me on admissions and visa requirements.`,
                settings.whatsapp
              );

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover Photo with flag */}
                    <div className="relative h-44 overflow-hidden bg-slate-800">
                      <img
                        src={c.coverImage}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{c.flag}</span>
                          <span className="font-bold text-lg font-serif">{c.name}</span>
                        </div>
                        <span className="text-xs font-mono bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md">
                          {c.currencyCode}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Major Intakes:</span>
                          <span className="font-semibold">{c.intakes[0] || 'Autumn'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Post-Study Visa:</span>
                          <span className="font-semibold text-emerald-700">{c.postStudyOptions.slice(0, 20)}...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectCountry?.(c.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-900 hover:bg-blue-100/70 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                    <a
                      href={countryWaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. COURSE FINDER HIGHLIGHTS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
              Extensive Program Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              Dynamic Course Finder
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Explore IELTS & English proficiency test prep, European foreign language training, and global university degree streams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Category 1: English & Test Prep */}
            <div className="bg-gradient-to-b from-blue-50/60 to-white p-6 rounded-2xl border border-blue-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  IELTS & English Test Prep
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  IELTS Academic & General, PTE, TOEFL iBT, Duolingo, and OET training with certified trainers and regular timed mock sessions.
                </p>
                <div className="space-y-2">
                  {courses
                    .filter((c) => c.category === 'English / Test Preparation')
                    .slice(0, 4)
                    .map((crs) => (
                      <button
                        key={crs.id}
                        onClick={() => onSelectCourse?.(crs.id)}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-blue-100/50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between group"
                      >
                        <span>{crs.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-900 transition-colors" />
                      </button>
                    ))}
                </div>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => {
                    navigate('ielts-languages');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 text-xs font-bold text-center text-blue-900 bg-blue-100/80 hover:bg-blue-200/80 rounded-xl transition-colors"
                >
                  Explore IELTS & English Prep
                </button>
              </div>
            </div>

            {/* Category 2: Foreign Languages */}
            <div className="bg-gradient-to-b from-amber-50/50 to-white p-6 rounded-2xl border border-amber-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Foreign Languages
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  German (A1–B2 levels for tuition-free German universities), French (DELF), Spanish, and Japanese language programs.
                </p>
                <div className="space-y-2">
                  {courses
                    .filter((c) => c.category === 'Foreign Languages')
                    .map((crs) => (
                      <button
                        key={crs.id}
                        onClick={() => onSelectCourse?.(crs.id)}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-amber-100/50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between group"
                      >
                        <span>{crs.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-800 transition-colors" />
                      </button>
                    ))}
                </div>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => {
                    navigate('ielts-languages');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 text-xs font-bold text-center text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 rounded-xl transition-colors"
                >
                  Explore Language Batches
                </button>
              </div>
            </div>

            {/* Category 3: Academic Degrees */}
            <div className="bg-gradient-to-b from-indigo-50/60 to-white p-6 rounded-2xl border border-indigo-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-900 text-white flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-indigo-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Overseas Academic Degrees
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Computer Science, AI & Data Science, MBA Finance, Nursing, Cyber Security, and Engineering across UK, USA, Germany & Australia.
                </p>
                <div className="space-y-2">
                  {courses
                    .filter((c) => c.category === 'Overseas Academic Courses')
                    .slice(0, 4)
                    .map((crs) => (
                      <button
                        key={crs.id}
                        onClick={() => onSelectCourse?.(crs.id)}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-indigo-100/50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between group"
                      >
                        <span className="truncate pr-2">{crs.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-900 shrink-0 transition-colors" />
                      </button>
                    ))}
                </div>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => {
                    navigate('courses');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 text-xs font-bold text-center text-indigo-900 bg-indigo-100/80 hover:bg-indigo-200/80 rounded-xl transition-colors"
                >
                  View All Academic Courses
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Profiler banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="max-w-xl">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Course & Country Matcher
              </span>
              <h3 className="text-2xl font-bold font-serif">
                Not sure which course or country fits your career?
              </h3>
              <p className="text-sm text-blue-200 mt-2">
                Use our simple 5-step questionnaire to receive personalised suggestions from our senior education counsellors.
              </p>
            </div>
            <button
              onClick={() => onOpenGuidance?.()}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md shrink-0"
            >
              <span>Launch Matcher Tool</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. REAL-TIME DESTINATION CLIMATE & LIVE INFO */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <LiveWeatherCard />
        </div>
      </section>

      {/* 7. RECENT POSTERS & UPDATES */}
      {posters && posters.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
                  Announcements & Drives
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
                  Posters & Latest Updates
                </h2>
                <p className="text-sm text-slate-600 mt-2 max-w-xl">
                  Intake openings, special test prep batches, and university admission sessions published by our consultancy.
                </p>
              </div>

              <button
                onClick={() => {
                  navigate('posters');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-blue-700"
              >
                <span>View All Posters</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posters.slice(0, 3).map((p) => {
                const posterWa = buildWhatsAppLink(
                  p.customWhatsAppMsg || `Hello Athmanathan Study Abroad, I saw your poster "${p.title}" and would like more details.`,
                  settings.whatsapp
                );

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-52 overflow-hidden bg-slate-900">
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span className="font-semibold text-blue-700">{p.category}</span>
                          <span>{p.date}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base mb-2 font-serif">
                          {p.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {p.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={posterWa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{p.ctaText || 'Chat on WhatsApp'}</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 8. STUDENT TESTIMONIALS */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
                Real Student Stories
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
                What Our Students Say
              </h2>
              <p className="mt-2 text-slate-600 text-sm">
                Authentic experiences from students guided by Athmanathan Study Abroad to universities worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                    <img
                      src={t.photoUrl}
                      alt={t.studentName}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{t.studentName}</h4>
                      <p className="text-xs text-blue-700 font-medium">{t.course}</p>
                      <p className="text-[11px] text-slate-500">
                        {t.university}, {t.country} ({t.intake})
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. TRAVEL & SUPPORT PARTNER BANNER (RULE 23) */}
      <section className="py-14 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/30">
                <Plane className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 block mb-1">
                  Associated With / Our Travel & Support Partner
                </span>
                <h3 className="text-2xl font-bold tracking-tight">
                  {settings.partnerName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Providing verified student flight deals, complimentary extra baggage allowances for departures, co-branded student eSIM data packages (Airalo Partner), and travel insurance.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={settings.esimPurchaseUrl || 'https://discover.airalo.com/happyjourneyholidays/'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm transition-all shadow-md shrink-0"
              >
                <span>Airalo eSIM Store</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={settings.partnerUrl || 'https://happyjourneyholidays.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md shrink-0"
              >
                <span>Visit Happy Journey Holidays</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FREE CONSULTATION BOTTOM CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
            Begin Your International Journey
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-serif">
            Ready to Explore Your Study Abroad Dreams?
          </h2>
          <p className="text-sm sm:text-base text-blue-200 max-w-2xl mx-auto leading-relaxed">
            No registration or candidate account required. Book a free initial consultation with Athmanathan Study Abroad to discuss universities, scholarships, and visa requirements.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenEnquiry?.('Home Bottom CTA')}
              className="px-8 py-4 rounded-xl bg-white text-blue-950 font-extrabold text-sm sm:text-base shadow-xl hover:bg-blue-50 hover:scale-105 transition-all"
            >
              Request Profile Assessment
            </button>
            <a
              href={mainWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl hover:bg-emerald-400 hover:scale-105 transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>WhatsApp: {settings.whatsapp || '+91 99949 86650'}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
