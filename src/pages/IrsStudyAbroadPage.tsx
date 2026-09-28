import React, { useState, useMemo } from 'react';
import {
  Globe,
  BookOpen,
  Building2,
  Search,
  ExternalLink,
  MessageCircle,
  Phone,
  ShieldCheck,
  Award,
  Sparkles,
  GraduationCap,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Filter,
  X,
  FileCheck,
  Compass,
  ArrowRight,
  Briefcase,
  Layers,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Country, Course, University, SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';

interface IrsStudyAbroadPageProps {
  settings: SiteSettings;
  countries: Country[];
  courses: Course[];
  universities: University[];
  onOpenEnquiry: (context?: string) => void;
  onSelectCountry?: (id: string) => void;
  onSelectCourse?: (id: string) => void;
  onSelectUniversity?: (id: string) => void;
  onNavigate?: (page: string) => void;
}

export const IrsStudyAbroadPage: React.FC<IrsStudyAbroadPageProps> = ({
  settings,
  countries,
  courses,
  universities,
  onOpenEnquiry,
  onSelectCountry,
  onSelectCourse,
  onSelectUniversity,
  onNavigate,
}) => {
  // Navigation tabs within IRS Hub
  const [activeSection, setActiveSection] = useState<'overview' | 'destinations' | 'courses' | 'universities' | 'admissions'>('overview');

  // Search & Filter state for Destinations
  const [destinationSearch, setDestinationSearch] = useState('');
  const [destinationRegion, setDestinationRegion] = useState<string>('All');
  const [activeCountryModal, setActiveCountryModal] = useState<Country | null>(null);

  // Search & Filter state for Courses
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedCourseCategory, setSelectedCourseCategory] = useState<string>('All');
  const [selectedCourseCountry, setSelectedCourseCountry] = useState<string>('All');
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);

  // Search & Filter state for Universities
  const [uniSearch, setUniSearch] = useState('');
  const [selectedUniCountry, setSelectedUniCountry] = useState<string>('All');
  const [activeUniModal, setActiveUniModal] = useState<University | null>(null);

  const whatsAppUrl = buildWhatsAppLink(
    'Hello IRS Study Abroad, I am visiting the IRS Study Abroad Hub and would like guidance on courses, destinations, and university admissions.',
    settings.whatsapp
  );

  // Filtered Destinations
  const filteredCountries = useMemo(() => {
    return countries.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(destinationSearch.toLowerCase()) ||
        c.capital.toLowerCase().includes(destinationSearch.toLowerCase()) ||
        (c.majorCities && c.majorCities.some((city) => city.toLowerCase().includes(destinationSearch.toLowerCase())));

      let matchesRegion = true;
      if (destinationRegion === 'Europe') {
        matchesRegion = ['United Kingdom', 'Germany', 'France', 'Ireland', 'Italy', 'Netherlands', 'Sweden'].some((name) =>
          c.name.toLowerCase().includes(name.toLowerCase())
        );
      } else if (destinationRegion === 'North America') {
        matchesRegion = ['United States', 'Canada'].some((name) => c.name.toLowerCase().includes(name.toLowerCase()));
      } else if (destinationRegion === 'Asia-Pacific') {
        matchesRegion = ['Australia', 'New Zealand', 'Singapore', 'Malaysia', 'Japan'].some((name) =>
          c.name.toLowerCase().includes(name.toLowerCase())
        );
      }

      return matchesSearch && matchesRegion;
    });
  }, [countries, destinationSearch, destinationRegion]);

  // Course categories
  const courseCategories = ['All', 'Overseas Academic Courses', 'English / Test Preparation', 'Foreign Languages'];

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesCat = selectedCourseCategory === 'All' || c.category === selectedCourseCategory;
      const matchesCountry =
        selectedCourseCountry === 'All' ||
        (c.countryIds && c.countryIds.includes(selectedCourseCountry)) ||
        c.countryIds.length === 0;

      const term = courseSearch.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(term) ||
        c.subCategory.toLowerCase().includes(term) ||
        c.studyLevel.toLowerCase().includes(term) ||
        c.careerInformation.toLowerCase().includes(term);

      return matchesCat && matchesCountry && matchesSearch;
    });
  }, [courses, courseSearch, selectedCourseCategory, selectedCourseCountry]);

  // Filtered Universities
  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      const matchesCountry = selectedUniCountry === 'All' || u.countryId === selectedUniCountry;
      const term = uniSearch.toLowerCase();
      const matchesSearch =
        u.name.toLowerCase().includes(term) ||
        u.city.toLowerCase().includes(term) ||
        u.description.toLowerCase().includes(term);

      return matchesCountry && matchesSearch;
    });
  }, [universities, uniSearch, selectedUniCountry]);

  const getCountryName = (id: string) => {
    const found = countries.find((c) => c.id === id);
    return found ? found.name : id;
  };

  const getCountryFlag = (id: string) => {
    const found = countries.find((c) => c.id === id);
    return found ? found.flag : '🌐';
  };

  const scrollToSection = (id: 'overview' | 'destinations' | 'courses' | 'universities' | 'admissions') => {
    setActiveSection(id);
    const element = document.getElementById(`irs-section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans">
      {/* 1. IRS Distinct Brand Banner & Identity Header */}
      <header className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/40 overflow-hidden">
        {/* Subtle geometric background grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              {/* Dedicated IRS Brand Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-indigo-900/60 border border-indigo-500/30 text-indigo-200 text-xs font-semibold backdrop-blur-xs shadow-inner">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="tracking-widest uppercase font-mono text-[11px] font-bold text-indigo-300">
                  IRS STUDY ABROAD
                </span>
                <span className="text-indigo-400/60">|</span>
                <span className="text-slate-300">International Education & Admissions Hub</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif text-white">
                Global Admissions. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-teal-200 to-indigo-100">
                  Precision Direction.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                Welcome to the dedicated <strong className="text-white font-semibold">IRS Study Abroad Hub</strong>. Explore verified international academic pathways, premier global universities, destination guides, and structured application counsel.
              </p>

              {/* Key Quick Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-900/50 backdrop-blur-xs">
                  <div className="text-lg sm:text-xl font-bold text-indigo-300 font-mono">30+</div>
                  <div className="text-slate-400 text-[11px]">Global Destinations</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-900/50 backdrop-blur-xs">
                  <div className="text-lg sm:text-xl font-bold text-teal-300 font-mono">850+</div>
                  <div className="text-slate-400 text-[11px]">Accredited Universities</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-900/50 backdrop-blur-xs">
                  <div className="text-lg sm:text-xl font-bold text-indigo-300 font-mono">5,000+</div>
                  <div className="text-slate-400 text-[11px]">Degree Programs</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-900/50 backdrop-blur-xs">
                  <div className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">100%</div>
                  <div className="text-slate-400 text-[11px]">Ethical Adherence</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onOpenEnquiry('IRS Study Abroad Hub: Primary Enquiry')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-950/50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-teal-200" />
                  <span>Enquire for IRS Admissions</span>
                </button>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-teal-300 border border-teal-500/30 hover:border-teal-400 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-teal-400" />
                  <span>WhatsApp IRS Counsellor</span>
                </a>
              </div>
            </div>

            {/* Hub Identity Crest & Quick Index */}
            <div className="w-full lg:w-80 p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-indigo-950/80 border border-indigo-500/20 shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-indigo-900/40">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center font-serif text-xl font-black text-white shadow-md">
                  IRS
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">IRS STUDY ABROAD</h2>
                  <p className="text-[11px] text-indigo-300">Public Knowledge & Admissions Portal</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Explore organized overseas directories verified for upcoming Fall, Spring, and Rolling academic intakes.
                </p>
                <div className="pt-2 space-y-1.5">
                  <button
                    onClick={() => scrollToSection('destinations')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-indigo-900/40 text-slate-200 hover:text-white transition-all text-left text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Study Destinations</span>
                    </span>
                    <span className="text-[10px] text-indigo-400 font-mono">({countries.length})</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('courses')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-indigo-900/40 text-slate-200 hover:text-white transition-all text-left text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                      <span>Curated Courses</span>
                    </span>
                    <span className="text-[10px] text-teal-400 font-mono">({courses.length})</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('universities')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-indigo-900/40 text-slate-200 hover:text-white transition-all text-left text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Partner Universities</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">({universities.length})</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-indigo-900/40 text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Zero service markups. Clear institutional facts.</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Sub-Navigation Bar within IRS Hub */}
      <nav className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur-md border-b border-indigo-900/40 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto py-2.5 gap-2 no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => scrollToSection('overview')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeSection === 'overview'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Overview & Ethos
            </button>
            <button
              onClick={() => scrollToSection('destinations')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeSection === 'destinations'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Destinations</span>
              <span className="px-1.5 py-0.2 rounded-md bg-indigo-950 text-[10px] text-indigo-300">
                {filteredCountries.length}
              </span>
            </button>
            <button
              onClick={() => scrollToSection('courses')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeSection === 'courses'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Courses</span>
              <span className="px-1.5 py-0.2 rounded-md bg-teal-950 text-[10px] text-teal-300">
                {filteredCourses.length}
              </span>
            </button>
            <button
              onClick={() => scrollToSection('universities')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeSection === 'universities'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Universities</span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-950 text-[10px] text-emerald-300">
                {filteredUniversities.length}
              </span>
            </button>
            <button
              onClick={() => scrollToSection('admissions')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeSection === 'admissions'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Admissions Roadmap
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => onOpenEnquiry('IRS Hub Bar: Request Counselling')}
              className="px-3 py-1.5 rounded-lg bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 text-xs font-semibold transition-colors"
            >
              Request Advisory
            </button>
          </div>
        </div>
      </nav>

      {/* 3. Section: Overview & Ethos */}
      <section id="irs-section-overview" className="py-14 sm:py-16 px-4 sm:px-6 border-b border-slate-850 bg-slate-900/60">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider">
              IRS Global Standards
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif">
              A Direct Pathway to World-Class Academia
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              The IRS Study Abroad framework is structured around three foundational pillars: academic fit, financial transparency, and sovereign visa compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-indigo-900/40 hover:border-indigo-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-900/50 flex items-center justify-center text-indigo-400">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Unbiased Course Fit</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We assess your undergraduate GPA, research ambitions, budget bandwidth, and post-study career goals before proposing institutional recommendations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-teal-900/40 hover:border-teal-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-900/50 flex items-center justify-center text-teal-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Complete Application Portfolio</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Detailed Statement of Purpose (SOP) refinement, Letters of Recommendation (LOR) guidance, transcript verification, and resume structuring.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-900/40 hover:border-emerald-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/50 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Ethical Visa Facilitation</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Rigorous financial document auditing, blocked account guidance (Germany), GIC preparation (Canada), CAS issuance (UK), and embassy mock interviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: Destinations (Required) */}
      <section id="irs-section-destinations" className="py-16 px-4 sm:px-6 border-b border-slate-850">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <Globe className="w-3.5 h-3.5" />
                <span>IRS Destinations Directory</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif">
                Global Study Destinations
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl">
                Explore visa regulations, post-study work opportunities, top academic cities, and entry requirements for leading education hubs.
              </p>
            </div>

            {/* Region Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Europe', 'North America', 'Asia-Pacific'].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setDestinationRegion(reg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    destinationRegion === reg
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              value={destinationSearch}
              onChange={(e) => setDestinationSearch(e.target.value)}
              placeholder="Search by country, capital, or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            {destinationSearch && (
              <button
                onClick={() => setDestinationSearch('')}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCountries.map((country) => (
              <div
                key={country.id}
                className="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col overflow-hidden shadow-lg shadow-black/40 hover:-translate-y-1"
              >
                {/* Image / Header strip */}
                <div className="relative h-44 overflow-hidden bg-slate-800">
                  <img
                    src={country.coverImage || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80'}
                    alt={country.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/50 text-xs font-bold text-white">
                    <span className="text-base">{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-xs text-indigo-300 font-medium">Capital: {country.capital}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {country.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Major Intakes:</span>
                      <span className="text-slate-200 font-semibold font-mono text-[11px]">
                        {country.intakes && country.intakes.length > 0 ? country.intakes.join(', ') : 'Fall / Spring'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Currency:</span>
                      <span className="text-slate-200 font-semibold">
                        {country.currency} ({country.currencyCode})
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => setActiveCountryModal(country)}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all text-center"
                    >
                      Quick Dossier
                    </button>
                    <button
                      onClick={() => onOpenEnquiry(`IRS Destination Enquiry: ${country.name}`)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      title="Enquire specifically for this destination"
                    >
                      Apply
                    </button>
                    {country.officialVisaLink && (
                      <a
                        href={country.officialVisaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Official Government Visa Portal"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCountries.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
              <Globe className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No destinations found matching your search.</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting region filters or searching another keyword.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. Section: Courses (Required) */}
      <section id="irs-section-courses" className="py-16 px-4 sm:px-6 border-b border-slate-850 bg-slate-900/40">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>IRS Academic Directory</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif">
                Curated Courses & Programs
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl">
                Explore popular degrees across STEM, Management, Healthcare, Data Science, and English/Foreign Language coaching.
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {courseCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCourseCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCourseCategory === cat
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Country Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="Search courses, disciplines, keywords (e.g. Master of Science, MBA, IELTS)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              {courseSearch && (
                <button
                  onClick={() => setCourseSearch('')}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="w-full sm:w-64">
              <select
                value={selectedCourseCountry}
                onChange={(e) => setSelectedCourseCountry(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-hidden focus:border-teal-500"
              >
                <option value="All">All Study Destinations</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg shadow-black/30"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-teal-950/80 border border-teal-500/30 text-teal-300 text-[11px] font-semibold">
                      {course.studyLevel || course.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{course.duration}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-teal-300">
                    {course.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {course.description || course.careerInformation}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Intakes:</span>
                    </span>
                    <span className="text-slate-300 font-mono text-[11px]">
                      {course.intakes && course.intakes.length > 0 ? course.intakes.join(', ') : 'Fall / Spring'}
                    </span>
                  </div>

                  {course.countryIds && course.countryIds.length > 0 && (
                    <div className="flex items-center gap-1 pt-1 flex-wrap">
                      <span className="text-[11px] text-slate-500">Available in:</span>
                      {course.countryIds.slice(0, 3).map((cId) => (
                        <span
                          key={cId}
                          className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700"
                        >
                          {getCountryFlag(cId)} {getCountryName(cId)}
                        </span>
                      ))}
                      {course.countryIds.length > 3 && (
                        <span className="text-[10px] text-slate-400">+{course.countryIds.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setActiveCourseModal(course)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors text-center"
                  >
                    View Curriculum & Criteria
                  </button>
                  <button
                    onClick={() => onOpenEnquiry(`IRS Course Enquiry: ${course.name}`)}
                    className="py-2 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors"
                  >
                    Enquire
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No courses match your query.</p>
              <p className="text-xs text-slate-500 mt-1">Try selecting 'All' categories or modifying search text.</p>
            </div>
          )}
        </div>
      </section>

      {/* 6. Section: Universities (Required) */}
      <section id="irs-section-universities" className="py-16 px-4 sm:px-6 border-b border-slate-850">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>IRS Institution Showcase</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif">
                Featured Partner Universities & Colleges
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl">
                Explore globally ranked autonomous universities, state institutions, and accredited higher education colleges across UK, US, Canada, Europe, and Australia.
              </p>
            </div>

            <div className="w-full md:w-64">
              <select
                value={selectedUniCountry}
                onChange={(e) => setSelectedUniCountry(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500"
              >
                <option value="All">Filter by Destination</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              value={uniSearch}
              onChange={(e) => setUniSearch(e.target.value)}
              placeholder="Search university name, city, or programs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            {uniSearch && (
              <button
                onClick={() => setUniSearch('')}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Universities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((uni) => {
              const country = countries.find((c) => c.id === uni.countryId);
              return (
                <div
                  key={uni.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-lg shadow-black/30 group"
                >
                  <div className="relative h-40 overflow-hidden bg-slate-800">
                    <img
                      src={uni.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'}
                      alt={uni.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-xs font-semibold text-white">
                      <span>{country?.flag || '🌐'}</span>
                      <span>{country?.name || 'International'}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{uni.city}</span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug group-hover:text-emerald-300">
                        {uni.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {uni.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Intake Cycles:</span>
                        <span className="text-slate-300 font-mono text-[11px]">
                          {uni.intakes && uni.intakes.length > 0 ? uni.intakes.join(', ') : 'Fall / Spring'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => setActiveUniModal(uni)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors text-center"
                      >
                        Prospectus & Entry
                      </button>
                      <button
                        onClick={() => onOpenEnquiry(`IRS University Admission: ${uni.name}`)}
                        className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                      >
                        Apply
                      </button>
                      {uni.officialWebsite && (
                        <a
                          href={uni.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                          title="Official University Website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredUniversities.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
              <Building2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No institutions match your selection.</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting destination filter or searching by city name.</p>
            </div>
          )}
        </div>
      </section>

      {/* 7. Section: Admissions Roadmap */}
      <section id="irs-section-admissions" className="py-16 px-4 sm:px-6 border-b border-slate-850 bg-slate-900/60">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-teal-400 text-xs font-mono font-semibold uppercase tracking-wider">
              Systematic Protocol
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif">
              The IRS 6-Stage Application Pathway
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every international scholar is guided step-by-step through our structured admissions workflow to minimize errors and secure timely offer letters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Profile Audit & Shortlisting',
                desc: 'In-depth assessment of academics, budget constraints, language scores, and career goals with safe, realistic, and ambitious university tiers.',
              },
              {
                step: '02',
                title: 'Document Engineering',
                desc: 'Structuring statement of purpose (SOP), academic curriculum vitae, reference letters (LOR), and official transcript apostilles.',
              },
              {
                step: '03',
                title: 'Direct Application Filing',
                desc: 'Submitting applications via authorized university partner portals, tracking reference numbers, and securing unconditional offer letters.',
              },
              {
                step: '04',
                title: 'Funding & Merit Scholarships',
                desc: 'Filing institutional scholarship essays, tuition fee discount claims, and bank education loan sanction documentation.',
              },
              {
                step: '05',
                title: 'Sovereign Visa File Preparation',
                desc: 'CAS/I-20/GIC verification, blocked account transfers, biometrics appointment scheduling, and embassy mock interviews.',
              },
              {
                step: '06',
                title: 'Pre-Departure, SIM & On-Ground Care',
                desc: 'International student travel bookings with Happy Journey Holidays, eSIM activations, airport transfers, and housing confirmations.',
              },
            ].map((st) => (
              <div key={st.step} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden">
                <div className="text-3xl font-black font-mono text-indigo-500/30 absolute right-4 top-4">
                  {st.step}
                </div>
                <div className="w-8 h-8 rounded-lg bg-indigo-900/60 flex items-center justify-center text-xs font-bold text-indigo-300 font-mono">
                  {st.step}
                </div>
                <h4 className="text-base font-bold text-white">{st.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Direct Consultation Callout */}
      <section className="py-14 px-4 sm:px-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-teal-950 border-b border-indigo-900/40">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 bg-slate-900/90 border border-indigo-500/30 text-center space-y-6 shadow-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Guidance Session</span>
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif">
            Ready to Chart Your Global Academic Journey?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Speak directly with an overseas education advisor to review your eligibility, clarify university admission deadlines, and receive personalized country shortlists.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenEnquiry('IRS Study Abroad Hub: Consultation CTA')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-indigo-950/60 transition-all cursor-pointer"
            >
              Book Free Profile Evaluation
            </button>
            <a
              href={`tel:${settings.phone}`}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4 text-indigo-400" />
              <span>Call: {settings.phone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. MANDATORY DISCLAIMER AT BOTTOM (Strict Compliance Requirement) */}
      <footer className="py-12 px-4 sm:px-6 bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                  Mandatory Legal & Sovereign Visa Authority Disclaimer
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Academic Admission Authority:</strong> University, college, and course admission approvals, offer letters, conditions, and transfer credits are granted exclusively by the respective academic institutions according to their independent enrollment standards.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Sovereign Visa Authority Notice:</strong> Student visa decisions (approvals, refusals, interviews, or processing timelines) are the absolute legal prerogative of official sovereign government immigration authorities (including UK Visas and Immigration, US Department of State, Immigration Refugees and Citizenship Canada, Australian Department of Home Affairs, German Federal Foreign Office, and other sovereign departments). Neither IRS Study Abroad nor ATHMANATHAN Study Abroad can influence sovereign visa adjudications.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Ethical Advisory Commitment:</strong> We provide transparent informational guidance, document verification, application coordination, and exam preparation. We strictly repudiate false promises, guaranteed visa claims, back-door admissions, or fraudulent documentation.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900 text-[11px] text-slate-500">
            <div>
              IRS Study Abroad Hub • Dedicated International Education Directory
            </div>
            <div className="flex items-center gap-4">
              <span>{settings.businessName}</span>
              <span>•</span>
              <span>{settings.registrationNumber}</span>
              <span>•</span>
              <button
                onClick={() => onNavigate?.('about')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                About Brand
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Destination Quick Modal */}
      {activeCountryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeCountryModal.flag}</span>
                <h3 className="text-xl font-bold font-serif">{activeCountryModal.name}</h3>
              </div>
              <button
                onClick={() => setActiveCountryModal(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div>
                <strong className="text-white block mb-1">Academic Overview:</strong>
                <p className="leading-relaxed">{activeCountryModal.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block">Currency:</span>
                  <span className="text-slate-200 font-bold">{activeCountryModal.currency} ({activeCountryModal.currencyCode})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Capital:</span>
                  <span className="text-slate-200 font-bold">{activeCountryModal.capital}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Intakes:</span>
                  <span className="text-slate-200 font-bold">{activeCountryModal.intakes?.join(', ') || 'Fall, Spring'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Language:</span>
                  <span className="text-slate-200 font-bold">{activeCountryModal.mainLanguage}</span>
                </div>
              </div>

              <div>
                <strong className="text-white block mb-1">Post-Study Work & Settlement:</strong>
                <p className="text-xs text-slate-300 leading-relaxed">{activeCountryModal.postStudyOptions}</p>
              </div>

              <div>
                <strong className="text-white block mb-1">Entry & English Standards:</strong>
                <p className="text-xs text-slate-300 leading-relaxed">{activeCountryModal.entryRequirements} {activeCountryModal.englishRequirements}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveCountryModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const name = activeCountryModal.name;
                  setActiveCountryModal(null);
                  onOpenEnquiry(`IRS Study Abroad: ${name} Consultation`);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Book {activeCountryModal.name} Advisory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Quick Modal */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-teal-400 text-xs font-semibold uppercase tracking-wider block">
                  {activeCourseModal.category}
                </span>
                <h3 className="text-xl font-bold font-serif">{activeCourseModal.name}</h3>
              </div>
              <button
                onClick={() => setActiveCourseModal(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block">Duration:</span>
                  <span className="text-slate-200 font-bold">{activeCourseModal.duration}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Level:</span>
                  <span className="text-slate-200 font-bold">{activeCourseModal.studyLevel}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Indicative Fee:</span>
                  <span className="text-slate-200 font-bold">{activeCourseModal.indicativeFee}</span>
                </div>
              </div>

              <div>
                <strong className="text-white block mb-1">Academic Curriculum & Description:</strong>
                <p className="leading-relaxed">{activeCourseModal.description}</p>
              </div>

              <div>
                <strong className="text-white block mb-1">Entry & Eligibility Standards:</strong>
                <p className="leading-relaxed text-slate-300">{activeCourseModal.entryRequirements}</p>
              </div>

              <div>
                <strong className="text-white block mb-1">English Proficiency Requirements:</strong>
                <p className="leading-relaxed text-slate-300">{activeCourseModal.englishRequirements}</p>
              </div>

              <div>
                <strong className="text-white block mb-1">Career & Post-Graduation Opportunities:</strong>
                <p className="leading-relaxed text-slate-300">{activeCourseModal.careerInformation}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveCourseModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const name = activeCourseModal.name;
                  setActiveCourseModal(null);
                  onOpenEnquiry(`IRS Course Application: ${name}`);
                }}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
              >
                Apply for this Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* University Quick Modal */}
      {activeUniModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider block">
                  {getCountryName(activeUniModal.countryId)} • {activeUniModal.city}
                </span>
                <h3 className="text-xl font-bold font-serif">{activeUniModal.name}</h3>
              </div>
              <button
                onClick={() => setActiveUniModal(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <p className="leading-relaxed">{activeUniModal.description}</p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block">Intakes:</span>
                  <span className="text-slate-200 font-bold">{activeUniModal.intakes?.join(', ') || 'Fall, Spring'}</span>
                </div>
              </div>

              <div>
                <strong className="text-white block mb-1">Scholarship & Grant Opportunities:</strong>
                <p className="leading-relaxed text-slate-300">{activeUniModal.scholarshipInfo || 'Merit waivers and international student bursaries available on application.'}</p>
              </div>

              <div>
                <strong className="text-white block mb-1">Academic & Language Criteria:</strong>
                <p className="leading-relaxed text-slate-300">{activeUniModal.entryRequirements} {activeUniModal.englishRequirements}</p>
              </div>

              {activeUniModal.officialWebsite && (
                <div className="pt-2">
                  <a
                    href={activeUniModal.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline"
                  >
                    <span>Visit Official University Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveUniModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const name = activeUniModal.name;
                  setActiveUniModal(null);
                  onOpenEnquiry(`IRS University Shortlist: ${name}`);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Enquire for {activeUniModal.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
