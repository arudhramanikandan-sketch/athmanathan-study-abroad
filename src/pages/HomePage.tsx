import React, { useState } from 'react';
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
  X,
  ZoomIn,
  Check,
  GraduationCap,
  Clock,
  Coins,
  FileCheck,
} from 'lucide-react';
import { PublicBootstrapData } from '../types';
import { buildWhatsAppLink } from '../api';
import { JourneyRoadmap } from '../components/JourneyRoadmap';
import { LiveCurrencyBar } from '../components/LiveCurrencyBar';
import { LiveWeatherCard } from '../components/LiveWeatherCard';

const VIBE_CERTIFICATE_SRC = '/assets/aistudio/WhatsApp_Image_2026-11-02_at_11.25.26_5f65da4f.jpeg';

interface HomePageProps {
  data: PublicBootstrapData;
  onNavigate?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  onOpenEnquiry: (context?: string) => void;
  onOpenGuidance?: () => void;
  onSelectCountry?: (id: string) => void;
  onSelectCourse?: (id: string) => void;
  onSelectUniversity?: (id: string) => void;
  onSelectVibeCourse?: (id: string) => void;
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
  onSelectVibeCourse,
}) => {
  const navigate = onNavigate || setActiveTab || (() => {});
  const { settings, countries, courses, universities, services, posters, testimonials, events } = data;

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const mainWhatsAppUrl = buildWhatsAppLink(
    'Hello Athmanathan Study Abroad, I would like to explore my study abroad options and book a counselling session.',
    settings.whatsapp
  );

  const vibeGeneralWhatsAppUrl = buildWhatsAppLink(
    'Hello Athmanathan Study Abroad, I would like to enquire about admission for VIBE Education Dubai programmes.',
    settings.whatsapp
  );

  const featuredVibeProgrammes = [
    {
      id: 'vibe-l45-business-mgmt',
      title: 'Business Management',
      level: 'Level 4 & 5 Extended Diploma',
      awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
      duration: '12 Months (Fast Track) / 24 Months (Regular)',
      credits: '240 Credits',
      fee: 'Fast Track: USD 6,050 | Regular: USD 4,750 / level',
      entryRequirements: 'Level 3 qualification or 10+2 high school completion. Age 18+.',
      overview: 'Strategic marketing, organizational leadership, operational management, and UK Bachelor’s degree top-up pathway.',
    },
    {
      id: 'vibe-l45-accounting',
      title: 'Accounting & Business',
      level: 'Level 4 & 5 Extended Diploma',
      awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
      duration: '12 Months (Fast Track) / 24 Months (Regular)',
      credits: '240 Credits',
      fee: 'Fast Track: USD 6,050 | Regular: USD 4,750 / level',
      entryRequirements: 'Level 3 qualification or 10+2 high school completion. Age 18+.',
      overview: 'Financial accounting, corporate taxation, managerial audit, and financial reporting for international commerce.',
    },
    {
      id: 'vibe-l45-it',
      title: 'Information Technology',
      level: 'Level 4 & 5 Extended Diploma',
      awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
      duration: '12 Months (Fast Track) / 24 Months (Regular)',
      credits: '240 Credits',
      fee: 'Fast Track: USD 6,050 | Regular: USD 4,750 / level',
      entryRequirements: 'Level 3 in IT / Science / Business or 10+2 with IT background. Age 18+.',
      overview: 'Software engineering, database architecture, network administration, and cyber essentials in Dubai’s digital hub.',
    },
    {
      id: 'vibe-l45-tourism-hospitality',
      title: 'Tourism & Hospitality Management',
      level: 'Level 4 & 5 Extended Diploma',
      awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
      duration: '12 Months (Fast Track) / 24 Months (Regular)',
      credits: '240 Credits',
      fee: 'Fast Track: USD 6,050 | Regular: USD 4,750 / level',
      entryRequirements: 'Level 3 qualification or 10+2 high school completion. Age 18+.',
      overview: 'Front office management, international resort operations, guest experience design, and event governance.',
    },
    {
      id: 'vibe-l45-health-social-care',
      title: 'Health & Social Care Management',
      level: 'Level 4 & 5 Extended Diploma',
      awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
      duration: '12 Months (Fast Track) / 24 Months (Regular)',
      credits: '240 Credits',
      fee: 'Fast Track: USD 6,050 | Regular: USD 4,750 / level',
      entryRequirements: 'Level 3 qualification or 10+2 academic background. Age 18+.',
      overview: 'Healthcare leadership, clinical governance, ethical care standards, health policy, and facility administration.',
    },
    {
      id: 'vibe-l5-psychology',
      title: 'Psychology',
      level: 'Level 5 Diploma',
      awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
      duration: '12 Months Intensive (Fast Track Only)',
      credits: '240 Credits',
      fee: 'Fast Track Only: USD 6,050',
      entryRequirements: 'Level 3 qualification or 10+2 with humanities / science and verified English proficiency. Age 18+.',
      overview: 'Cognitive psychology, developmental behavior, research methods, and clinical case analysis. (Strictly Fast Track).',
    },
    {
      id: 'vibe-l5-education-training',
      title: 'Education & Training',
      level: 'Level 5 Diploma',
      awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
      duration: '12 Months',
      credits: '120 Credits',
      fee: 'Regular Track: USD 4,750',
      entryRequirements: 'Level 4 diploma, teaching experience, or equivalent educational background. Age 19+.',
      overview: 'Curriculum design, pedagogical delivery, modern instructional technology, and professional learner assessment.',
    },
  ];

  const handleOpenCourse = (courseId: string) => {
    if (onSelectVibeCourse) {
      onSelectVibeCourse(courseId);
    } else {
      navigate('vibe-dubai');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mainPageMenuItems = [
    { id: 'countries', label: 'Countries', desc: `${countries?.length || 15}+ Global Hubs`, icon: Globe, highlight: 'border-blue-500/30 bg-blue-950/40 hover:border-blue-400' },
    { id: 'courses', label: 'Courses', desc: `${courses?.length || 100}+ Disciplines`, icon: BookOpen, highlight: 'border-indigo-500/30 bg-indigo-950/40 hover:border-indigo-400' },
    { id: 'vibe-dubai', label: 'VIBE Dubai', desc: '11 Diplomas & Pathways', icon: Award, highlight: 'border-amber-500/40 bg-amber-950/30 hover:border-amber-400' },
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
      {/* ============================================================== */}
      {/* VIBE EDUCATION APPROVED PARTNER ANNOUNCEMENT (TOP OF HOMEPAGE) */}
      {/* ============================================================== */}
      <section
        id="vibe-education-announcement"
        aria-label="VIBE Education Approved Partner Announcement"
        className="relative bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white border-b-2 border-amber-500/40 shadow-2xl pt-6 pb-12 sm:pt-8 sm:pb-16"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top Institutional Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Official Institutional Partnership • Dubai, UAE
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-300 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Verified Certificate of Representation
            </span>
          </div>

          {/* Main 2-Column Banner: Text + Official Certificate */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-serif uppercase leading-tight sm:leading-tight">
                PROUD TO BE AN APPROVED PARTNER OF VIBE EDUCATION
              </h1>

              <p className="text-base sm:text-xl font-semibold text-amber-300 tracking-wide font-sans">
                Explore International Education Opportunities in Dubai, UAE
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Athmanathan Study Abroad has been officially appointed as an <strong className="text-white font-semibold">Approved Partner</strong> of <strong className="text-white font-semibold">Vibe Education LLC, Dubai</strong>. The appointed partner is authorized to promote the institution's programmes internationally, provide prospective students with verified academic information and promotional support, and assist candidates throughout the application and enrolment process.
              </p>

              {/* Key Highlights Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="bg-slate-900/80 border border-slate-750 p-2.5 rounded-lg flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Official Partner</span>
                    <span className="text-slate-400 text-[11px]">Authorized Agent</span>
                  </div>
                </div>
                <div className="bg-slate-900/80 border border-slate-750 p-2.5 rounded-lg flex items-start gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">British Diplomas</span>
                    <span className="text-slate-400 text-[11px]">OTHM Regulated</span>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-slate-900/80 border border-slate-750 p-2.5 rounded-lg flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Dubai Campus</span>
                    <span className="text-slate-400 text-[11px]">On-Campus Study</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: EXPLORE COURSES + ENQUIRE ABOUT ADMISSION */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                {/* EXPLORE COURSES Button */}
                <button
                  type="button"
                  onClick={() => {
                    navigate('vibe-dubai');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-lg shadow-amber-500/25 cursor-pointer uppercase tracking-wider"
                >
                  <BookOpen className="w-5 h-5 text-slate-950" />
                  <span>EXPLORE COURSES</span>
                </button>

                {/* ENQUIRE ABOUT ADMISSION Button (WhatsApp Only) */}
                <a
                  href={vibeGeneralWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-lg shadow-emerald-500/25 uppercase tracking-wider cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>ENQUIRE ABOUT ADMISSION</span>
                </a>
              </div>

              {/* No False Promises Reassurance */}
              <p className="text-[11px] sm:text-xs text-slate-400 italic">
                * Zero hidden charges. Public student enquiries are handled directly on official WhatsApp. Admission and visa approval are subject to institution criteria and Dubai immigration regulations.
              </p>
            </div>

            {/* Right Column: Authentic Certificate Display with Click-to-Enlarge */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-md bg-slate-900/90 rounded-2xl p-3 sm:p-4 border-2 border-amber-400/50 shadow-2xl shadow-blue-950/80">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Official Approved Partner Certificate</span>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                    Dubai, UAE
                  </span>
                </div>

                {/* Certificate Image Frame */}
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(true)}
                  className="group relative block w-full bg-white rounded-xl overflow-hidden border border-slate-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-zoom-in"
                  title="Click to view full-size official certificate"
                >
                  <img
                    src={VIBE_CERTIFICATE_SRC}
                    alt="Official VIBE Education Approved Partner Certificate awarded to Athmanathan Study Abroad"
                    loading="eager"
                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/90 text-amber-300 text-xs font-bold shadow-lg border border-amber-400/50">
                      <ZoomIn className="w-4 h-4" />
                      Click to Enlarge
                    </span>
                  </div>
                </button>

                {/* Certificate Footer Meta */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="truncate">Issued by: Director – Operations, Vibe Education LLC</span>
                  <button
                    type="button"
                    onClick={() => setIsCertModalOpen(true)}
                    className="text-amber-400 hover:text-amber-300 font-semibold underline text-xs shrink-0 cursor-pointer ml-2"
                  >
                    View Full Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* AVAILABLE PROGRAMMES QUICK SHOWCASE                            */}
          {/* ============================================================== */}
          <div className="mt-12 pt-10 border-t border-slate-800">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Verified Academic Portfolio • Dubai Campus
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                  Available VIBE Education Dubai Programmes
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  British-regulated diplomas (Level 3 to Level 5) with international university degree top-up pathways (Level 6). All duration and fee structures are verified against official institutional agreements.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigate('vibe-dubai');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors shrink-0 cursor-pointer"
              >
                <span>View Full Dubai Course Catalogue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Responsive Course Grid: 7 key verified programmes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {featuredVibeProgrammes.map((prog) => {
                const courseWhatsAppLink = buildWhatsAppLink(
                  `Hello Athmanathan Study Abroad, I would like to enquire about admission for the ${prog.title} programme at VIBE Education Dubai.`,
                  settings.whatsapp
                );

                return (
                  <div
                    key={prog.id}
                    className="flex flex-col justify-between bg-slate-900/90 rounded-xl p-4 border border-slate-800 hover:border-amber-400/50 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-950/60"
                  >
                    <div>
                      {/* Level & Awarding Body Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wide bg-amber-500/15 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded">
                          {prog.level}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {prog.credits}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-white mb-2 leading-snug">
                        {prog.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
                        {prog.overview}
                      </p>

                      {/* Key Verified Specs */}
                      <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-2 mb-3">
                        <div className="flex items-start gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">
                            <strong className="text-slate-200">Duration:</strong> {prog.duration}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">
                            <strong className="text-slate-200">Verified Fee:</strong> {prog.fee}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] text-slate-400 leading-tight">
                            <strong className="text-slate-300">Entry:</strong> {prog.entryRequirements}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Course Card Action Buttons */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenCourse(prog.id)}
                        className="flex-1 py-2 px-2.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/30 text-xs font-semibold text-center transition-colors cursor-pointer"
                      >
                        Course Details
                      </button>
                      <a
                        href={courseWhatsAppLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-xs font-semibold inline-flex items-center justify-center gap-1 transition-colors"
                        title="Enquire on WhatsApp about this course"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>Enquire</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 7: Trust, Transparency & Ethical Disclosure */}
          <div className="mt-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Trust & Transparency Disclosure (Institutional Representation)</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-400">
              Athmanathan Study Abroad is officially appointed as an Approved Partner of Vibe Education LLC based on the official Certificate of Representation. We provide student counselling, verified course outlines, and application coordination.
              <strong className="text-slate-300"> Transparency Commitment:</strong> We do not claim guaranteed university admission, guaranteed UAE student visa approval, or guaranteed employment/internship placements. Programmes are vocational and higher diplomas awarded by OTHM Qualifications (UK Ofqual regulated), with university progression pathways to recognized Bachelor’s degrees. Course fees and entry criteria are subject to official offer letters and institutional confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MODAL: CLICK-TO-ENLARGE OFFICIAL PARTNER CERTIFICATE           */}
      {/* ============================================================== */}
      {isCertModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Official VIBE Education Approved Partner Certificate"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsCertModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-serif">
                    VIBE Education Approved Partner Certificate
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Official Certificate of Representation • Athmanathan Study Abroad
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCertModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close certificate modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Authentic, Unedited Certificate Image */}
            <div className="p-3 sm:p-6 bg-slate-100 overflow-y-auto flex items-center justify-center">
              <img
                src={VIBE_CERTIFICATE_SRC}
                alt="Official Certificate of Representation: Athmanathan Study Abroad has been officially appointed as an Approved Partner of Vibe Education LLC"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-md border border-slate-300 bg-white"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs">
              <span className="text-slate-600 text-[11px]">
                Authorized by Director – Operations, Vibe Education LLC, Dubai, UAE.
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={vibeGeneralWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Enquire on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
