import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  GraduationCap,
  Clock,
  Coins,
  MessageCircle,
  X,
  ChevronRight,
  Scale,
  Award,
  Globe,
} from 'lucide-react';
import { Course, Country, SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';

interface CoursesPageProps {
  courses: Course[];
  countries: Country[];
  settings: SiteSettings;
  selectedCourseId?: string | null;
  onClearSelectedCourse?: () => void;
  onOpenEnquiry: (context?: string) => void;
  onOpenCompare: () => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  courses,
  countries,
  settings,
  selectedCourseId,
  onClearSelectedCourse,
  onOpenEnquiry,
  onOpenCompare,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCountryId, setSelectedCountryId] = useState<string>('All');
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(
    selectedCourseId ? courses.find((c) => c.id === selectedCourseId) || null : null
  );

  const categories = [
    'All',
    'Overseas Academic Courses',
    'English / Test Preparation',
    'Foreign Languages',
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesCountry =
      selectedCountryId === 'All' ||
      (c.countryIds && c.countryIds.includes(selectedCountryId)) ||
      c.countryIds.length === 0;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(term) ||
      c.subCategory.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term);

    return matchesCategory && matchesCountry && matchesSearch;
  });

  const openCourseDetail = (crs: Course) => {
    setActiveCourseModal(crs);
  };

  const closeCourseDetail = () => {
    setActiveCourseModal(null);
    if (onClearSelectedCourse) onClearSelectedCourse();
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
              Program Directory
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              Explore Courses & Test Prep
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl">
              From global undergraduate & master's degrees to rigorous IELTS, PTE, and European language training batches.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCompare}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 transition-colors shadow-xs"
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Compare Courses</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by course name or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Filter (Rule 17: Filter by Country) */}
            <div>
              <select
                value={selectedCountryId}
                onChange={(e) => setSelectedCountryId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-blue-500"
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
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((crs) => {
            const courseWa = buildWhatsAppLink(
              `Hello Athmanathan Study Abroad, I am interested in enrolling for the course "${crs.name}". Please share details regarding eligibility and fees.`,
              settings.whatsapp
            );

            return (
              <div
                key={crs.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-100">
                      {crs.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {crs.studyLevel}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 font-serif">
                    {crs.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {crs.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Duration:
                      </span>
                      <span className="font-semibold">{crs.duration}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-slate-400" />
                        Indicative Fee:
                      </span>
                      <span className="font-bold text-emerald-700">{crs.indicativeFee}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Intakes:</span>
                      <span className="font-medium text-slate-800">{crs.intakes.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openCourseDetail(crs)}
                    className="px-3.5 py-2 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100/80 rounded-xl transition-colors"
                  >
                    View Details
                  </button>

                  <a
                    href={courseWa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Enquire</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No courses match your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try changing the category or destination country.</p>
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                onClick={closeCourseDetail}
                className="absolute top-5 right-5 text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>

              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 mb-2">
                {activeCourseModal.category} • {activeCourseModal.studyLevel}
              </span>
              <h3 className="text-2xl font-bold font-serif">
                {activeCourseModal.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Duration: {activeCourseModal.duration} • Indicative Fee: {activeCourseModal.indicativeFee}
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Course Description</h4>
                <p className="text-slate-600 leading-relaxed">{activeCourseModal.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block">Intakes:</span>
                  <span className="text-slate-600">{activeCourseModal.intakes.join(', ')}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">Tuition / Fee:</span>
                  <span className="text-emerald-700 font-bold">{activeCourseModal.indicativeFee}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Academic Entry Requirements</h4>
                <p className="text-slate-600 leading-relaxed">{activeCourseModal.entryRequirements}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">English Proficiency Requirements</h4>
                <p className="text-slate-600 leading-relaxed">{activeCourseModal.englishRequirements}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Career Scope & Opportunities</h4>
                <p className="text-slate-600 leading-relaxed">{activeCourseModal.careerInformation}</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    closeCourseDetail();
                    onOpenEnquiry(`Course: ${activeCourseModal.name}`);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition-colors"
                >
                  Submit Application Profile
                </button>

                <a
                  href={buildWhatsAppLink(
                    `Hello Athmanathan Study Abroad, I am reviewing ${activeCourseModal.name} and would like to ask questions.`,
                    settings.whatsapp
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Counsellor</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
