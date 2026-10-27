import React, { useState, useMemo, useEffect } from 'react';
import {
  GraduationCap,
  Clock,
  Coins,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  Filter,
  Search,
  BookOpen,
  Building2,
  FileCheck,
  Plane,
  Home,
  Briefcase,
  AlertTriangle,
  HelpCircle,
  Award,
  ChevronRight,
  Layers,
  Sparkles,
  Info,
  Calendar,
  X,
  Share2,
} from 'lucide-react';
import { SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';
import {
  VibeCourse,
  VibeStudyTrack,
  VIBE_COURSES,
  VIBE_VISA_INFO,
} from '../data/vibeCoursesData';
import { VibeApplyModal } from '../components/VibeApplyModal';

interface VibeDubaiPageProps {
  settings: SiteSettings;
  initialCourseId?: string | null;
  onNavigate?: (page: string) => void;
}

export const VibeDubaiPage: React.FC<VibeDubaiPageProps> = ({
  settings,
  initialCourseId,
  onNavigate,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<VibeCourse | null>(() => {
    if (initialCourseId) {
      return VIBE_COURSES.find((c) => c.id === initialCourseId) || null;
    }
    return null;
  });

  const [activeTrackId, setActiveTrackId] = useState<'regular' | 'fast_track' | 'progression'>('regular');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>('all');

  // Apply Now Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyCourse, setApplyCourse] = useState<VibeCourse | null>(null);
  const [applyTrackName, setApplyTrackName] = useState<string | null>(null);

  // Sync initialCourseId if prop changes
  useEffect(() => {
    if (initialCourseId) {
      const crs = VIBE_COURSES.find((c) => c.id === initialCourseId);
      if (crs) {
        setSelectedCourse(crs);
        setActiveTrackId(crs.defaultTrackId);
      }
    }
  }, [initialCourseId]);

  // Update page title dynamically for SEO and clear user awareness
  useEffect(() => {
    if (selectedCourse) {
      document.title = `${selectedCourse.title} in Dubai | VIBE Education | ${settings.businessName}`;
    } else {
      document.title = `Study in Dubai with VIBE Education | Diploma & Degree Pathways | ${settings.businessName}`;
    }
  }, [selectedCourse, settings.businessName]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return VIBE_COURSES.filter((course) => {
      // Level filter
      if (selectedLevelFilter !== 'all' && course.levelCategory !== selectedLevelFilter) {
        return false;
      }

      // Track filter
      if (selectedTrackFilter !== 'all') {
        const hasTrack = course.availableTracks.some((t) => t.id === selectedTrackFilter);
        if (!hasTrack) return false;
      }

      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = course.title.toLowerCase().includes(q);
        const matchesCode = course.code?.toLowerCase().includes(q) || false;
        const matchesLevel = course.level.toLowerCase().includes(q);
        const matchesOverview = course.overview.toLowerCase().includes(q);
        const matchesQual = course.qualificationTitle.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCode && !matchesLevel && !matchesOverview && !matchesQual) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedLevelFilter, selectedTrackFilter]);

  // Grouped courses for the central catalogue view
  const level3Courses = useMemo(
    () => filteredCourses.filter((c) => c.levelCategory === 'level3'),
    [filteredCourses]
  );
  const level45Courses = useMemo(
    () => filteredCourses.filter((c) => c.levelCategory === 'level45'),
    [filteredCourses]
  );
  const level5Courses = useMemo(
    () => filteredCourses.filter((c) => c.levelCategory === 'level5'),
    [filteredCourses]
  );
  const level6Courses = useMemo(
    () => filteredCourses.filter((c) => c.levelCategory === 'level6'),
    [filteredCourses]
  );

  const handleOpenCourseDetail = (course: VibeCourse) => {
    setSelectedCourse(course);
    setActiveTrackId(course.defaultTrackId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseCourseDetail = () => {
    setSelectedCourse(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenApplyModal = (course: VibeCourse, trackName?: string) => {
    setApplyCourse(course);
    setApplyTrackName(trackName || null);
    setApplyModalOpen(true);
  };

  // Direct quick WhatsApp enquiry for a course
  const handleQuickWhatsAppEnquiry = (course: VibeCourse, track?: VibeStudyTrack) => {
    const activeTrack = track || course.availableTracks.find((t) => t.id === course.defaultTrackId) || course.availableTracks[0];
    const message = [
      'Hello Athmanathan Study Abroad,',
      '',
      `I would like to enquire about the ${course.title} (${course.level}) at VIBE Education, Dubai.`,
      `Track: ${activeTrack.name} (${activeTrack.feeLabel})`,
      `Duration: ${activeTrack.duration}`,
      '',
      'Please share the entry requirements, tuition payment schedule, visa process, and current intake availability.',
      '',
      'Thank you.',
    ].join('\n');

    const link = buildWhatsAppLink(message, settings.whatsapp);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20">
      {/* ============================================================== */}
      {/* 1. HERO BANNER: STUDY IN DUBAI WITH VIBE EDUCATION             */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white pt-12 pb-16 px-4 sm:px-6 relative overflow-hidden border-b border-blue-900/40">
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-blue-200 mb-4" aria-label="Breadcrumb">
            <button
              onClick={() => {
                if (onNavigate) onNavigate('home');
              }}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
            <button
              onClick={() => {
                if (selectedCourse) handleCloseCourseDetail();
              }}
              className={`hover:text-white transition-colors cursor-pointer ${
                !selectedCourse ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              VIBE Education Dubai
            </button>
            {selectedCourse && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-amber-400 font-semibold truncate max-w-xs">{selectedCourse.title}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  Official Education Partner
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-blue-200 border border-white/10">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  Dubai, UAE Campus
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-blue-200 border border-white/10">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  UK Regulated Diplomas (OTHM)
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight text-white leading-tight">
                Study in Dubai with VIBE Education
              </h1>
              <p className="text-base sm:text-lg text-blue-100/90 mt-3 font-normal leading-relaxed">
                Explore diploma programmes, course fees, entry requirements, and university progression options with Athmanathan Study Abroad.
              </p>

              {/* Notice pill */}
              <div className="mt-5 p-3 sm:p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-3 text-xs text-blue-200">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Transparency Notice:</strong> {VIBE_VISA_INFO.institutionNatureNotice} All course details, fees, entry permit processing, and admissions are subject to confirmation by VIBE Education.
                </p>
              </div>
            </div>

            {/* Quick Stat Pill Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-96 shrink-0">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <span className="block text-2xl font-black font-serif text-amber-400">11</span>
                <span className="block text-xs font-semibold text-slate-200 mt-0.5">Verified Courses</span>
                <span className="block text-[11px] text-blue-200 mt-1">Foundation, Diplomas & Degree Top-Up</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <span className="block text-2xl font-black font-serif text-emerald-400">USD 4,750</span>
                <span className="block text-xs font-semibold text-slate-200 mt-0.5">Starting Course Fee</span>
                <span className="block text-[11px] text-blue-200 mt-1">As stated in official partner agreement</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <span className="block text-2xl font-black font-serif text-blue-300">USD 1,500</span>
                <span className="block text-xs font-semibold text-slate-200 mt-0.5">UAE Student Visa Fee</span>
                <span className="block text-[11px] text-blue-200 mt-1">3–7 working days est. processing</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <span className="block text-2xl font-black font-serif text-teal-300">60%</span>
                <span className="block text-xs font-semibold text-slate-200 mt-0.5">Visa Rejection Refund</span>
                <span className="block text-[11px] text-blue-200 mt-1">Stated in Partnership Agreement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. CONDITIONAL VIEW: INDIVIDUAL COURSE DETAIL OR CATALOGUE     */}
      {/* ============================================================== */}
      {selectedCourse ? (
        /* ============================================================ */
        /* INDIVIDUAL COURSE DETAIL VIEW                                */
        /* ============================================================ */
        <article className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-200">
          {/* Back & Close Navigation Row */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <button
              onClick={handleCloseCourseDetail}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-blue-900 hover:border-blue-300 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Back to VIBE Course Catalogue</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Course Code: <strong className="text-slate-800">{selectedCourse.code || 'VIBE-DXB'}</strong>
              </span>

              <button
                type="button"
                onClick={handleCloseCourseDetail}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-rose-700 hover:border-rose-300 hover:bg-rose-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Close course details"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-slate-500" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* A. Course Banner */}
          <header className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 relative">
            <button
              type="button"
              onClick={handleCloseCourseDetail}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              title="Close course details"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
                {selectedCourse.level}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                {selectedCourse.credits} Credits {selectedCourse.creditsNote ? '*' : ''}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                Campus: Dubai, UAE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif leading-tight">
              {selectedCourse.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              {selectedCourse.overview}
            </p>

            {/* Track Selector Tab Switcher */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                Select Study Track & View Fees:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedCourse.availableTracks.map((track) => {
                  const isSelected = activeTrackId === track.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setActiveTrackId(track.id)}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-slate-900">{track.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black font-serif text-blue-950">
                          {track.feeLabel}
                        </span>
                        <span className="text-xs text-slate-500">• {track.duration}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-snug">{track.feeNote}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const trackObj = selectedCourse.availableTracks.find((t) => t.id === activeTrackId);
                  handleOpenApplyModal(selectedCourse, trackObj?.name);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Apply Now for {selectedCourse.title}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const trackObj = selectedCourse.availableTracks.find((t) => t.id === activeTrackId);
                  handleQuickWhatsAppEnquiry(selectedCourse, trackObj);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enquire on WhatsApp</span>
              </button>
            </div>
          </header>

          {/* B & C. Course Details Grid */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-700" />
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Course Specifications & Academic Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Course Level
                </span>
                <span className="block text-sm font-bold text-slate-900 mt-1">
                  {selectedCourse.level}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Credits
                </span>
                <span className="block text-sm font-bold text-slate-900 mt-1">
                  {selectedCourse.credits} Credits
                </span>
                {selectedCourse.creditsNote && (
                  <span className="block text-[11px] text-slate-500 mt-0.5 leading-tight">
                    {selectedCourse.creditsNote}
                  </span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Study Mode
                </span>
                <span className="block text-sm font-bold text-slate-900 mt-1">
                  {selectedCourse.studyMode}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Assessment Method
                </span>
                <span className="block text-sm font-semibold text-slate-800 mt-1">
                  {selectedCourse.assessmentMethod}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Awarding Body
                </span>
                <span className="block text-sm font-semibold text-slate-800 mt-1">
                  {selectedCourse.awardingBody}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Upcoming Intakes
                </span>
                <span className="block text-sm font-semibold text-slate-800 mt-1">
                  {selectedCourse.intakes.join(' • ')}
                </span>
              </div>
            </div>

            {/* Qualification Title */}
            <div className="mt-4 p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <span className="block text-xs font-bold text-blue-900 uppercase tracking-wider">
                Official Qualification Title
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {selectedCourse.qualificationTitle}
              </p>
            </div>

            {/* Entry Requirements */}
            <div className="mt-4 p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <span className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                Entry Requirements
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                {selectedCourse.entryRequirements}
              </p>
            </div>

            {/* Progression */}
            <div className="mt-4 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
              <span className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                Progression Opportunities
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                {selectedCourse.progressionOpportunities}
              </p>
            </div>
          </section>

          {/* D. Course Fees Breakdown */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-emerald-700" />
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Course Fee Structure & Transparent Pricing
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Fees are stated exactly as confirmed in the signed Partnership Agreement and VIBE Education Academics PDF in USD.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                    <th className="py-3 px-4 rounded-l-xl">Study Track</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Fee in USD</th>
                    <th className="py-3 px-4 rounded-r-xl">Fee Terms & Invoicing Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedCourse.availableTracks.map((tr) => (
                    <tr key={tr.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{tr.name}</td>
                      <td className="py-3.5 px-4 text-slate-700">{tr.duration}</td>
                      <td className="py-3.5 px-4 font-black font-serif text-base text-blue-950">
                        {tr.feeLabel}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 leading-relaxed">
                        {tr.feeNote}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <p>
                • <strong>No Hidden Fees:</strong> No arbitrary service fees, registration charges, or hidden taxes are added.
              </p>
              <p>
                • <strong>Currency:</strong> Fees are shown in United States Dollars (USD). Payments are invoiced in accordance with official VIBE Education invoices.
              </p>
              <p>
                • <strong>Payment Timing:</strong> Tuition fee is payable <strong>after</strong> the student entry permit is issued and verified.
              </p>
            </div>
          </section>

          {/* F & E. Visa Process, Fees and Important Information */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-2">
              <FileCheck className="w-5 h-5 text-blue-700" />
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Visa Process, Fees and Important Information
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Complete 10-step student visa and admission process for studying in Dubai through VIBE Education:
            </p>

            {/* Key Visa Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                <span className="block text-xs font-bold text-blue-900 uppercase">Visa Fee</span>
                <span className="block text-xl font-bold font-serif text-blue-950 mt-1">USD 1,500</span>
                <span className="block text-[11px] text-blue-800/80 mt-1 leading-tight">
                  {VIBE_VISA_INFO.feeNotice}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="block text-xs font-bold text-emerald-900 uppercase">Entry Permit Timeline</span>
                <span className="block text-xl font-bold font-serif text-emerald-950 mt-1">3–7 Working Days</span>
                <span className="block text-[11px] text-emerald-800/80 mt-1 leading-tight">
                  Subject to UAE government procedures and approval.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <span className="block text-xs font-bold text-indigo-900 uppercase">Overall Admission Timeline</span>
                <span className="block text-xl font-bold font-serif text-indigo-950 mt-1">2–3 Weeks</span>
                <span className="block text-[11px] text-indigo-800/80 mt-1 leading-tight">
                  {VIBE_VISA_INFO.overallTimeNotice}
                </span>
              </div>
            </div>

            {/* 10 Step Visa Workflow */}
            <div className="space-y-3">
              {VIBE_VISA_INFO.steps.map((st) => (
                <div
                  key={st.step}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5"
                >
                  <span className="w-7 h-7 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {st.step}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{st.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{st.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Important Distinctions */}
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Important Visa Disclaimers:</span>
              </div>
              <p>• Neither Athmanathan Study Abroad nor VIBE Education guarantees visa approval. Sovereign entry decisions rest strictly with UAE immigration authorities.</p>
              <p>• Timelines are estimates. Processing may vary based on document verification, background checks, and embassy protocols.</p>
              <p>• Students should wait for the official offer letter and verified payment instructions before remitting any visa fee.</p>
            </div>
          </section>

          {/* G. Visa Rejection Refund Policy */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Visa Rejection Refund Policy
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-emerald-950 leading-relaxed space-y-2">
              <p className="font-semibold">
                According to the Partnership Agreement provided by VIBE Education, <strong>60% of the visa fee is refundable</strong> if a visa application is rejected.
              </p>
              <p>
                The applicable refund procedure, eligibility, required documents, and processing timeline must be confirmed directly with VIBE Education before payment.
              </p>
              <p className="text-xs text-emerald-800">
                Refund eligibility is subject to the official agreement and applicable VIBE Education policies. Note: 100% refund is not promised, and this policy is strictly separate from the student tuition refund policy.
              </p>
            </div>
          </section>

          {/* H. Tuition Fee Refund Policy */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Coins className="w-5 h-5 text-blue-700" />
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Tuition Fee Refund Policy
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                Official VIBE Education refund policy is published at{' '}
                <a
                  href="https://www.vibeedu.com/refund-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>vibeedu.com/refund-policy</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                .
              </p>
              <p>
                The official website contains a tuition withdrawal refund schedule. However, the applicable policy may differ depending on the programme, student category, and batch commencement date.
              </p>
              <p>
                Students must review the applicable official refund policy and obtain written confirmation from VIBE Education before making payment. Please confirm the applicable tuition fee refund terms with VIBE Education before making payment.
              </p>
            </div>
          </section>

          {/* I. Accommodation and Airport Pickup */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Plane className="w-5 h-5 text-indigo-700" />
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Accommodation and Arrival Support
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                  <Home className="w-4 h-4 text-blue-600" />
                  <span>Student Accommodation</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {VIBE_VISA_INFO.accommodationNotice}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                  <Plane className="w-4 h-4 text-indigo-600" />
                  <span>Dubai Airport Pickup</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {VIBE_VISA_INFO.airportPickupNotice}
                </p>
              </div>
            </div>
          </section>

          {/* K. Placement and Career Support Disclaimer */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-5 h-5 text-slate-700" />
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Placement & Career Support Disclaimer
              </h2>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>{VIBE_VISA_INFO.careerSupportDisclaimer}</p>
            </div>
          </section>

          {/* L. Dedicated Terms and Conditions (13 Points) */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-slate-800" />
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Terms and Conditions
              </h2>
            </div>

            <ol className="list-decimal pl-5 space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {VIBE_VISA_INFO.termsAndConditionsList.map((term, idx) => (
                <li key={idx} className="pl-1">
                  {term}
                </li>
              ))}
            </ol>

            {/* Verified External Links */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                Official VIBE Education Reference Links:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {VIBE_VISA_INFO.officialLinks.map((lnk) => (
                  <a
                    key={lnk.url}
                    href={lnk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-700 text-xs font-semibold transition-colors border border-slate-200"
                  >
                    <span>{lnk.label}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Sticky / Floating Action Bar on Detail View */}
          <div className="sticky bottom-4 z-30 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="block text-xs text-blue-200">Enquiring for:</span>
              <span className="font-bold text-sm text-white">{selectedCourse.title}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleCloseCourseDetail}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                title="Close course details"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const trackObj = selectedCourse.availableTracks.find((t) => t.id === activeTrackId);
                  handleQuickWhatsAppEnquiry(selectedCourse, trackObj);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Enquiry</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const trackObj = selectedCourse.availableTracks.find((t) => t.id === activeTrackId);
                  handleOpenApplyModal(selectedCourse, trackObj?.name);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </article>
      ) : (
        /* ============================================================ */
        /* CENTRAL COURSE CATALOGUE LISTING VIEW                        */
        /* ============================================================ */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Filter Bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-10 space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by course title, subject, or code..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Action Buttons: Reset filter & Close Page button */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                {(selectedLevelFilter !== 'all' || selectedTrackFilter !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedLevelFilter('all');
                      setSelectedTrackFilter('all');
                      setSearchQuery('');
                    }}
                    className="text-xs text-blue-700 hover:text-blue-900 font-semibold cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Reset all filters
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('home');
                    } else if (typeof window !== 'undefined' && window.history.length > 1) {
                      window.history.back();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all border border-slate-200 shadow-2xs cursor-pointer group shrink-0"
                  title="Close course catalogue and return to Home"
                  aria-label="Close VIBE catalogue"
                >
                  <X className="w-4 h-4 text-slate-500 group-hover:text-slate-800 transition-colors" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* Filter pills: Level */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Level:</span>
              </span>
              {[
                { id: 'all', label: 'All Levels (11)' },
                { id: 'level3', label: 'Level 3 Foundation (3)' },
                { id: 'level45', label: 'Level 4 & 5 Diploma (5)' },
                { id: 'level5', label: 'Level 5 Diplomas (2)' },
                { id: 'level6', label: 'Level 6 University Progression (1)' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevelFilter(lvl.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedLevelFilter === lvl.id
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>

            {/* Filter pills: Track */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Study Track:</span>
              </span>
              {[
                { id: 'all', label: 'All Tracks' },
                { id: 'regular', label: 'Regular Track (Paced)' },
                { id: 'fast_track', label: 'Fast Track (Accelerated)' },
              ].map((trk) => (
                <button
                  key={trk.id}
                  onClick={() => setSelectedTrackFilter(trk.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedTrackFilter === trk.id
                      ? 'bg-indigo-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {trk.label}
                </button>
              ))}
            </div>
          </div>

          {/* Group 1: Level 3 Foundation Programmes */}
          {level3Courses.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                    Level 3 Foundation Programmes
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-semibold">{level3Courses.length} Courses</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {level3Courses.map((crs) => (
                  <CourseCard
                    key={crs.id}
                    course={crs}
                    onOpenDetail={() => handleOpenCourseDetail(crs)}
                    onApply={() => handleOpenApplyModal(crs)}
                    onWhatsApp={() => handleQuickWhatsAppEnquiry(crs)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Group 2: Level 4 & 5 Diploma Programmes */}
          {level45Courses.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                    Level 4 & 5 Diploma Programmes
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-semibold">{level45Courses.length} Courses</span>
              </div>
              <p className="text-xs text-slate-600 mb-5">
                Offered in both Regular Track (24 months, USD 4,750 × 2 levels) and Fast Track (12 months, USD 6,050).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {level45Courses.map((crs) => (
                  <CourseCard
                    key={crs.id}
                    course={crs}
                    onOpenDetail={() => handleOpenCourseDetail(crs)}
                    onApply={() => handleOpenApplyModal(crs)}
                    onWhatsApp={() => handleQuickWhatsAppEnquiry(crs)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Group 3: Level 5 Programmes */}
          {level5Courses.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-600"></span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                    Level 5 Specialized Programmes
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-semibold">{level5Courses.length} Courses</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {level5Courses.map((crs) => (
                  <CourseCard
                    key={crs.id}
                    course={crs}
                    onOpenDetail={() => handleOpenCourseDetail(crs)}
                    onApply={() => handleOpenApplyModal(crs)}
                    onWhatsApp={() => handleQuickWhatsAppEnquiry(crs)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Group 4: Level 6 University Progression */}
          {level6Courses.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                    Level 6 University Progression
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-semibold">{level6Courses.length} Pathway</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {level6Courses.map((crs) => (
                  <CourseCard
                    key={crs.id}
                    course={crs}
                    onOpenDetail={() => handleOpenCourseDetail(crs)}
                    onApply={() => handleOpenApplyModal(crs)}
                    onWhatsApp={() => handleQuickWhatsAppEnquiry(crs)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Zero Results State */}
          {filteredCourses.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No VIBE Education courses found</h3>
              <p className="text-xs text-slate-600 mt-1">
                Try clearing your search term or selecting a different level or track filter.
              </p>
              <button
                onClick={() => {
                  setSelectedLevelFilter('all');
                  setSelectedTrackFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-900 text-white font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Institutional Partner Banner & Verification Notice */}
          <section className="mt-16 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  Admissions Counselling & Partner Support
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900">
                  Ready to Plan Your Study Journey in Dubai?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Our certified education counsellors provide profile assessment, course track guidance, visa fee clarification, document review, and interview preparation for Indian students.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={buildWhatsAppLink(
                    'Hello Athmanathan Study Abroad, I would like to schedule a 1-on-1 counseling session for VIBE Education Dubai programmes.',
                    settings.whatsapp
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Specialized VIBE Apply Now & WhatsApp Enquiry Modal */}
      <VibeApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        settings={settings}
        selectedCourse={applyCourse}
        selectedTrackName={applyTrackName}
      />
    </div>
  );
};

// ==============================================================
// SUB-COMPONENT: COURSE CARD FOR CENTRAL CATALOGUE
// ==============================================================
interface CourseCardProps {
  course: VibeCourse;
  onOpenDetail: () => void;
  onApply: () => void;
  onWhatsApp: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onOpenDetail,
  onApply,
  onWhatsApp,
}) => {
  const defaultTrack = course.availableTracks.find((t) => t.id === course.defaultTrackId) || course.availableTracks[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-5 sm:p-6">
        {/* Level Tag & Code */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-900 border border-blue-200/60">
            {course.level}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {course.code || 'VIBE'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold font-serif text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
          {course.overview}
        </p>

        {/* Key Attributes */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Duration:</span>
            </span>
            <span className="font-semibold text-slate-800">
              {course.availableTracks.map((t) => t.duration.split(' ')[0] + ' ' + t.duration.split(' ')[1]).join(' / ')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-slate-400" />
              <span>Tuition Fee:</span>
            </span>
            <span className="font-bold text-blue-950">
              {defaultTrack.feeLabel}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Available Tracks:</span>
            </span>
            <span className="font-medium text-slate-700 text-[11px]">
              {course.availableTracks.map((t) => (t.id === 'regular' ? 'Regular' : t.id === 'fast_track' ? 'Fast Track' : 'Degree Top-Up')).join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onOpenDetail}
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-blue-900 hover:bg-blue-50 font-bold text-xs transition-colors cursor-pointer"
        >
          View Course Details
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onWhatsApp}
            title="Enquire on WhatsApp"
            className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
            aria-label="Enquire on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onApply}
            className="px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};
