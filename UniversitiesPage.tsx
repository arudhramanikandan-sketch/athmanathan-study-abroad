import React, { useState } from 'react';
import {
  Building2,
  Search,
  ExternalLink,
  MessageCircle,
  X,
  MapPin,
  Coins,
  Calendar,
  Award,
  Home,
  Scale,
} from 'lucide-react';
import { University, Country, SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';

interface UniversitiesPageProps {
  universities: University[];
  countries: Country[];
  settings: SiteSettings;
  selectedUniId?: string | null;
  onClearSelectedUni?: () => void;
  onOpenEnquiry: (context?: string) => void;
  onOpenCompare: () => void;
}

export const UniversitiesPage: React.FC<UniversitiesPageProps> = ({
  universities,
  countries,
  settings,
  selectedUniId,
  onClearSelectedUni,
  onOpenEnquiry,
  onOpenCompare,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountryId, setSelectedCountryId] = useState<string>('All');
  const [activeUniModal, setActiveUniModal] = useState<University | null>(
    selectedUniId ? universities.find((u) => u.id === selectedUniId) || null : null
  );

  const getCountry = (countryId: string) => countries.find((c) => c.id === countryId);

  const filteredUnis = universities.filter((u) => {
    const matchesCountry = selectedCountryId === 'All' || u.countryId === selectedCountryId;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(term) ||
      u.city.toLowerCase().includes(term) ||
      u.description.toLowerCase().includes(term);
    return matchesCountry && matchesSearch;
  });

  const openUniDetail = (u: University) => {
    setActiveUniModal(u);
  };

  const closeUniDetail = () => {
    setActiveUniModal(null);
    if (onClearSelectedUni) onClearSelectedUni();
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
              Global Higher Education Institutions
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              Universities & Colleges
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl">
              Explore reputable universities across the UK, USA, Germany, Canada, Australia, and Ireland with tuition fee guidelines, scholarships, and official admission links.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCompare}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 transition-colors shadow-xs"
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Compare Universities</span>
            </button>
          </div>
        </div>

        {/* Filter Controls (Rule 17: Filter by Country) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search university by name, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <select
                value={selectedCountryId}
                onChange={(e) => setSelectedCountryId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">Filter by Destination Country: All</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnis.map((u) => {
            const country = getCountry(u.countryId);
            const uniWa = buildWhatsAppLink(
              `Hello Athmanathan Study Abroad, I am interested in applying to ${u.name} in ${u.city}. Please guide me on course options and requirements.`,
              settings.whatsapp
            );

            return (
              <div
                key={u.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 relative bg-slate-900 overflow-hidden">
                    <img
                      src={u.image}
                      alt={u.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                        <MapPin className="w-3 h-3 text-blue-400" />
                        {u.city}, {country?.name}
                      </span>
                      {country && <span className="text-xl">{country.flag}</span>}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 font-serif line-clamp-1">
                      {u.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {u.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Indicative Fee:</span>
                        <span className="font-bold text-emerald-700">{u.indicativeFee}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Intakes:</span>
                        <span className="font-semibold">{u.intakes.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openUniDetail(u)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-blue-900 bg-blue-100/70 hover:bg-blue-200/70 rounded-lg transition-colors"
                  >
                    View Details
                  </button>

                  <a
                    href={uniWa}
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

        {filteredUnis.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No universities match your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try selecting another country or clearing your search.</p>
          </div>
        )}
      </div>

      {/* University Detail Modal */}
      {activeUniModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="relative h-48 sm:h-56 bg-slate-900 shrink-0">
              <img
                src={activeUniModal.image}
                alt={activeUniModal.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
              <button
                onClick={closeUniDetail}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-2 rounded-full backdrop-blur-xs"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-xs font-semibold bg-blue-600 px-2 py-0.5 rounded-md">
                  {getCountry(activeUniModal.countryId)?.name}
                </span>
                <h3 className="text-2xl font-bold font-serif mt-1">{activeUniModal.name}</h3>
                <p className="text-xs text-slate-200">{activeUniModal.city}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">About the University</h4>
                <p className="text-slate-600 leading-relaxed">{activeUniModal.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-700 block">Indicative Tuition Fee:</span>
                  <span className="font-bold text-emerald-700 text-sm">{activeUniModal.indicativeFee}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">Academic Intakes:</span>
                  <span className="text-slate-800">{activeUniModal.intakes.join(', ')}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Entry & Grade Requirements</h4>
                <p className="text-slate-600 leading-relaxed">{activeUniModal.entryRequirements}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">English Language Standards</h4>
                <p className="text-slate-600 leading-relaxed">{activeUniModal.englishRequirements}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Scholarship Availability</h4>
                <p className="text-slate-600 leading-relaxed">{activeUniModal.scholarshipInfo}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Student Accommodation & Housing</h4>
                <p className="text-slate-600 leading-relaxed">{activeUniModal.accommodationInfo}</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={activeUniModal.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                >
                  <span>Official University Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      closeUniDetail();
                      onOpenEnquiry(`University: ${activeUniModal.name}`);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold"
                  >
                    Apply for this University
                  </button>
                  <a
                    href={buildWhatsAppLink(
                      `Hello Athmanathan Study Abroad, I am interested in applying to ${activeUniModal.name}. Please guide me on next steps.`,
                      settings.whatsapp
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
