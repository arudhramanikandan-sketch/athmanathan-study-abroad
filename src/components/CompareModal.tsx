import React, { useState } from 'react';
import { X, Scale, Plus, Trash2 } from 'lucide-react';
import { Country, Course, University } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  countries: Country[];
  courses: Course[];
  universities: University[];
  initialType?: 'countries' | 'courses' | 'universities';
  onOpenEnquiry?: (context?: string) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  countries,
  courses,
  universities,
  initialType = 'countries',
}) => {
  const [compareType, setCompareType] = useState<'countries' | 'courses' | 'universities'>(initialType);
  const [selectedCountryIds, setSelectedCountryIds] = useState<string[]>(['cnt_uk', 'cnt_germany']);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>(['crs_msc_cs_uk', 'crs_ms_ai_ds_usa']);
  const [selectedUniIds, setSelectedUniIds] = useState<string[]>(['uni_manchester', 'uni_birmingham']);

  if (!isOpen) return null;

  const handleCountryToggle = (id: string) => {
    if (selectedCountryIds.includes(id)) {
      if (selectedCountryIds.length > 1) {
        setSelectedCountryIds(selectedCountryIds.filter((x) => x !== id));
      }
    } else if (selectedCountryIds.length < 3) {
      setSelectedCountryIds([...selectedCountryIds, id]);
    }
  };

  const handleCourseToggle = (id: string) => {
    if (selectedCourseIds.includes(id)) {
      if (selectedCourseIds.length > 1) {
        setSelectedCourseIds(selectedCourseIds.filter((x) => x !== id));
      }
    } else if (selectedCourseIds.length < 3) {
      setSelectedCourseIds([...selectedCourseIds, id]);
    }
  };

  const handleUniToggle = (id: string) => {
    if (selectedUniIds.includes(id)) {
      if (selectedUniIds.length > 1) {
        setSelectedUniIds(selectedUniIds.filter((x) => x !== id));
      }
    } else if (selectedUniIds.length < 3) {
      setSelectedUniIds([...selectedUniIds, id]);
    }
  };

  const activeCountries = countries.filter((c) => selectedCountryIds.includes(c.id));
  const activeCourses = courses.filter((c) => selectedCourseIds.includes(c.id));
  const activeUnis = universities.filter((u) => selectedUniIds.includes(u.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        {/* Header with Close Window on Top */}
        <div className="bg-slate-900 text-white p-6 relative shrink-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Side-by-Side Fact Sheet</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold transition-all border border-white/20 shadow-xs cursor-pointer"
              aria-label="Close window"
            >
              <span>Close Window</span>
              <X className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif">
            Factual Comparison Tool
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Compare 2 to 3 countries, courses, or universities objectively. No algorithmic rankings or winners.
          </p>

          {/* Type Selector Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setCompareType('countries')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                compareType === 'countries'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Compare Countries
            </button>
            <button
              onClick={() => setCompareType('courses')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                compareType === 'courses'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Compare Courses
            </button>
            <button
              onClick={() => setCompareType('universities')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                compareType === 'universities'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Compare Universities
            </button>
          </div>
        </div>

        {/* Scrollable comparison area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Countries Comparison */}
          {compareType === 'countries' && (
            <div>
              {/* Selector pills */}
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Select up to 3 countries to compare (click to toggle):
                </span>
                <div className="flex flex-wrap gap-2">
                  {countries.map((c) => {
                    const isSelected = selectedCountryIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleCountryToggle(c.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-blue-900 border-blue-900 text-white'
                            : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {c.flag} {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200 bg-slate-50">
                      <th className="p-3 text-left font-bold text-slate-800 w-44">Aspect</th>
                      {activeCountries.map((c) => (
                        <th key={c.id} className="p-3 text-left font-bold text-slate-900 text-base">
                          <span className="mr-1.5">{c.flag}</span>
                          <span>{c.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Currency & Capital</td>
                      {activeCountries.map((c) => (
                        <td key={c.id} className="p-3 text-slate-800 font-medium">
                          {c.currency} | Capital: {c.capital}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Major Intakes</td>
                      {activeCountries.map((c) => (
                        <td key={c.id} className="p-3 text-slate-800">
                          {c.intakes.join(', ')}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Post-Study Work Visa</td>
                      {activeCountries.map((c) => (
                        <td key={c.id} className="p-3 text-slate-800 font-medium">
                          {c.postStudyOptions}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Part-Time Work Rights</td>
                      {activeCountries.map((c) => (
                        <td key={c.id} className="p-3 text-slate-800">
                          {c.workOpportunities}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Entry & Academics</td>
                      {activeCountries.map((c) => (
                        <td key={c.id} className="p-3 text-slate-700">
                          {c.entryRequirements}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">English Requirements</td>
                      {activeCountries.map((c) => (
                        <td key={c.id} className="p-3 text-slate-700">
                          {c.englishRequirements}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Visa Requirements</td>
                      {activeCountries.map((c) => (
                        <td key={c.id} className="p-3 text-slate-700">
                          {c.visaOverview}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Official Portal</td>
                      {activeCountries.map((c) => (
                        <td key={c.id} className="p-3">
                          <a
                            href={c.officialVisaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:underline font-semibold"
                          >
                            Official Government Visa Page ↗
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. Courses Comparison */}
          {compareType === 'courses' && (
            <div>
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Select up to 3 courses to compare:
                </span>
                <div className="flex flex-wrap gap-2">
                  {courses.map((crs) => {
                    const isSelected = selectedCourseIds.includes(crs.id);
                    return (
                      <button
                        key={crs.id}
                        onClick={() => handleCourseToggle(crs.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-blue-900 border-blue-900 text-white'
                            : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {crs.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200 bg-slate-50">
                      <th className="p-3 text-left font-bold text-slate-800 w-44">Aspect</th>
                      {activeCourses.map((crs) => (
                        <th key={crs.id} className="p-3 text-left font-bold text-slate-900 text-base">
                          {crs.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Category & Level</td>
                      {activeCourses.map((crs) => (
                        <td key={crs.id} className="p-3 text-slate-800">
                          {crs.category} ({crs.studyLevel})
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Program Duration</td>
                      {activeCourses.map((crs) => (
                        <td key={crs.id} className="p-3 text-slate-800 font-medium">
                          {crs.duration}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Indicative Tuition Fee</td>
                      {activeCourses.map((crs) => (
                        <td key={crs.id} className="p-3 text-emerald-700 font-bold">
                          {crs.indicativeFee}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Intakes</td>
                      {activeCourses.map((crs) => (
                        <td key={crs.id} className="p-3 text-slate-800">
                          {crs.intakes.join(', ')}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Entry Requirements</td>
                      {activeCourses.map((crs) => (
                        <td key={crs.id} className="p-3 text-slate-700">
                          {crs.entryRequirements}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">English Standard</td>
                      {activeCourses.map((crs) => (
                        <td key={crs.id} className="p-3 text-slate-700">
                          {crs.englishRequirements}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Career Scope</td>
                      {activeCourses.map((crs) => (
                        <td key={crs.id} className="p-3 text-slate-700">
                          {crs.careerInformation}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Universities Comparison */}
          {compareType === 'universities' && (
            <div>
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Select up to 3 universities to compare:
                </span>
                <div className="flex flex-wrap gap-2">
                  {universities.map((u) => {
                    const isSelected = selectedUniIds.includes(u.id);
                    return (
                      <button
                        key={u.id}
                        onClick={() => handleUniToggle(u.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-blue-900 border-blue-900 text-white'
                            : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {u.name} ({u.city})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200 bg-slate-50">
                      <th className="p-3 text-left font-bold text-slate-800 w-44">Aspect</th>
                      {activeUnis.map((u) => (
                        <th key={u.id} className="p-3 text-left font-bold text-slate-900 text-base">
                          {u.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Location</td>
                      {activeUnis.map((u) => (
                        <td key={u.id} className="p-3 text-slate-800 font-medium">
                          {u.city}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Indicative Fee</td>
                      {activeUnis.map((u) => (
                        <td key={u.id} className="p-3 text-emerald-700 font-bold">
                          {u.indicativeFee}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Intakes</td>
                      {activeUnis.map((u) => (
                        <td key={u.id} className="p-3 text-slate-800">
                          {u.intakes.join(', ')}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Scholarships</td>
                      {activeUnis.map((u) => (
                        <td key={u.id} className="p-3 text-slate-700">
                          {u.scholarshipInfo}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Accommodation</td>
                      {activeUnis.map((u) => (
                        <td key={u.id} className="p-3 text-slate-700">
                          {u.accommodationInfo}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-600">Official Website</td>
                      {activeUnis.map((u) => (
                        <td key={u.id} className="p-3">
                          <a
                            href={u.officialWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:underline font-semibold"
                          >
                            Visit Official Site ↗
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Close Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Comparing verified institutional data side-by-side
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <X className="w-4 h-4" />
            <span>Close Comparison</span>
          </button>
        </div>
      </div>
    </div>
  );
};
