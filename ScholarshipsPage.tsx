import React, { useState } from 'react';
import {
  Award,
  Search,
  ExternalLink,
  Calendar,
  Coins,
  ShieldAlert,
  MessageCircle,
  FileCheck,
} from 'lucide-react';
import { Scholarship, Country, SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';

interface ScholarshipsPageProps {
  scholarships: Scholarship[];
  countries: Country[];
  settings: SiteSettings;
  onOpenEnquiry: (context?: string) => void;
}

export const ScholarshipsPage: React.FC<ScholarshipsPageProps> = ({
  scholarships,
  countries,
  settings,
  onOpenEnquiry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountryId, setSelectedCountryId] = useState<string>('All');

  const getCountry = (id: string) => countries.find((c) => c.id === id);

  const filteredScholarships = scholarships.filter((s) => {
    const matchesCountry = selectedCountryId === 'All' || s.countryId === selectedCountryId;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(term) ||
      s.eligibility.toLowerCase().includes(term) ||
      s.notes.toLowerCase().includes(term);
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
            Funding Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-serif">
            Scholarships & Financial Grants
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Discover premier government scholarships, merit awards, and university tuition reductions available to Indian students.
          </p>
        </div>

        {/* Mandatory Transparency & Policy Notice */}
        <div className="mb-10 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 max-w-4xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Important Scholarship Award Transparency Notice:</span>
            <p className="text-amber-800 leading-relaxed">
              Scholarships, grants, and bursaries are awarded solely at the discretion of government bodies, university academic senates, and independent trust boards based on academic merit and eligibility. Athmanathan Study Abroad provides guidance on application preparation and deadlines, but cannot guarantee scholarship approval.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search scholarships by name or criteria..."
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
                <option value="All">All Countries</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Scholarships List */}
        <div className="space-y-6">
          {filteredScholarships.map((s) => {
            const country = getCountry(s.countryId);
            const wa = buildWhatsAppLink(
              `Hello Athmanathan Study Abroad, I am reviewing the scholarship "${s.name}" for ${country?.name}. Can you evaluate my eligibility?`,
              settings.whatsapp
            );

            return (
              <div
                key={s.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100 flex items-center gap-1">
                      <span>{country?.flag}</span>
                      <span>{country?.name || 'Global'}</span>
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      Amount: {s.amount}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 font-serif">
                    {s.name}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 pt-1">
                    <div>
                      <span className="font-bold text-slate-900 block mb-0.5">Eligibility:</span>
                      <p className="text-slate-600">{s.eligibility}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-0.5">Application Deadline:</span>
                      <p className="text-slate-600 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{s.deadline}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 pt-1">
                    <span className="font-bold text-slate-900">Application Process: </span>
                    <span>{s.applicationProcess}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center gap-2.5 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <a
                    href={s.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>

                  <button
                    onClick={() => onOpenEnquiry(`Scholarship: ${s.name}`)}
                    className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs"
                  >
                    Assess My Eligibility
                  </button>

                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Award className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No scholarships match your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search keyword.</p>
          </div>
        )}
      </div>
    </div>
  );
};
