import React, { useState } from 'react';
import {
  Globe,
  Search,
  ExternalLink,
  MessageCircle,
  X,
  Clock,
  Coins,
  ShieldCheck,
  Building2,
  Droplet,
  Compass,
  ArrowRight,
  Scale,
} from 'lucide-react';
import { Country, SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';

interface CountriesPageProps {
  countries: Country[];
  settings: SiteSettings;
  selectedCountryId?: string | null;
  onClearSelectedCountry?: () => void;
  onSelectCountry?: (id: string) => void;
  onOpenEnquiry: (context?: string) => void;
  onOpenCompare: () => void;
}

export const CountriesPage: React.FC<CountriesPageProps> = ({
  countries,
  settings,
  selectedCountryId,
  onClearSelectedCountry,
  onSelectCountry,
  onOpenEnquiry,
  onOpenCompare,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCountryModal, setActiveCountryModal] = useState<Country | null>(
    selectedCountryId ? countries.find((c) => c.id === selectedCountryId) || null : null
  );

  const filteredCountries = countries.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.capital.toLowerCase().includes(term) ||
      c.currency.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term)
    );
  });

  const openCountryDetail = (c: Country) => {
    setActiveCountryModal(c);
  };

  const closeCountryDetail = () => {
    setActiveCountryModal(null);
    if (onClearSelectedCountry) onClearSelectedCountry();
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
              Destination Directory
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              Study Abroad Countries
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl">
              Compare immigration rules, post-study work rights, living expenses, and official visa requirements across world-leading study destinations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCompare}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 transition-colors shadow-xs"
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Compare Countries</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by country, capital or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCountries.map((c) => {
            const countryWa = buildWhatsAppLink(
              `Hello Athmanathan Study Abroad, I am interested in studying in ${c.name}. Please provide details on admissions and requirements.`,
              settings.whatsapp
            );

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-900">
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
                        <h3 className="font-bold text-lg font-serif">{c.name}</h3>
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

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Capital:</span>
                        <span className="font-semibold">{c.capital}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Intakes:</span>
                        <span className="font-semibold">{c.intakes.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openCountryDetail(c)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-blue-900 bg-blue-100/70 hover:bg-blue-200/70 rounded-lg transition-colors"
                  >
                    Country Guide
                  </button>
                  <a
                    href={countryWa}
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

        {filteredCountries.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Globe className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No countries match your search</h3>
            <p className="text-xs text-slate-500 mt-1">Try searching with a different term.</p>
          </div>
        )}
      </div>

      {/* Comprehensive Country Detail Modal (as required by Section 8) */}
      {activeCountryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="relative h-48 sm:h-60 bg-slate-900 shrink-0">
              <img
                src={activeCountryModal.coverImage}
                alt={activeCountryModal.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <button
                onClick={closeCountryDetail}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-2 rounded-full backdrop-blur-xs"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activeCountryModal.flag}</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
                      Study in {activeCountryModal.name}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1">
                    Capital: {activeCountryModal.capital} • Currency: {activeCountryModal.currency} ({activeCountryModal.currencyCode}) • Time Zone: {activeCountryModal.timeZone}
                  </p>
                </div>

                <a
                  href={buildWhatsAppLink(
                    `Hello Athmanathan Study Abroad, I am reviewing the ${activeCountryModal.name} Country Guide and would like to ask questions about universities and visas.`,
                    settings.whatsapp
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Ask a Counsellor</span>
                </a>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-2">Overview</h4>
                <p className="text-slate-600 leading-relaxed">{activeCountryModal.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-800 mb-1">
                    Major Cities for Higher Education
                  </h5>
                  <p className="text-slate-700">{activeCountryModal.majorCities.join(', ')}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-800 mb-1">
                    Available Study Levels
                  </h5>
                  <p className="text-slate-700">{activeCountryModal.studyLevels.join(' • ')}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-800 mb-1">
                    Key Intakes
                  </h5>
                  <p className="text-slate-700">{activeCountryModal.intakes.join(', ')}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-800 mb-1">
                    Post-Study Work Visa
                  </h5>
                  <p className="text-slate-700 font-semibold text-emerald-800">
                    {activeCountryModal.postStudyOptions}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Academic & Entry Requirements</h4>
                  <p className="text-slate-600 leading-relaxed">{activeCountryModal.entryRequirements}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">English Language Standards</h4>
                  <p className="text-slate-600 leading-relaxed">{activeCountryModal.englishRequirements}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Student Visa & Immigration Overview</h4>
                  <p className="text-slate-600 leading-relaxed">{activeCountryModal.visaOverview}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Part-Time Student Work Opportunities</h4>
                  <p className="text-slate-600 leading-relaxed">{activeCountryModal.workOpportunities}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Scholarships & Financial Aid</h4>
                  <p className="text-slate-600 leading-relaxed">{activeCountryModal.scholarshipInfo}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
                    <h5 className="font-bold text-blue-900 text-xs mb-1">General Safety & Student Life</h5>
                    <p className="text-xs text-slate-700">{activeCountryModal.generalSafety}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-100">
                    <h5 className="font-bold text-cyan-900 text-xs mb-1 flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Drinking Water Guidance</span>
                    </h5>
                    <p className="text-xs text-slate-700">{activeCountryModal.drinkingWaterGuidance}</p>
                  </div>
                </div>
              </div>

              {/* Official Government & University Links */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={activeCountryModal.officialVisaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                  >
                    <span>Official Government Visa Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>

                  {activeCountryModal.officialUniversityLink && (
                    <a
                      href={activeCountryModal.officialUniversityLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                    >
                      <span>Official University Body</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => {
                    closeCountryDetail();
                    onOpenEnquiry(`Country: ${activeCountryModal.name}`);
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs"
                >
                  Apply for {activeCountryModal.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
