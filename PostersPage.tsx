import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Calendar,
  MessageCircle,
  Sparkles,
  ExternalLink,
  Share2,
  X,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Poster, SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';

interface PostersPageProps {
  posters: Poster[];
  settings: SiteSettings;
  onOpenEnquiry: (context?: string) => void;
}

export const PostersPage: React.FC<PostersPageProps> = ({
  posters,
  settings,
  onOpenEnquiry,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewPoster, setPreviewPoster] = useState<Poster | null>(null);

  const categories = ['All', 'Admissions', 'Language Coaching', 'Webinar / Drive', 'Visa Update'];

  const filteredPosters = posters.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
            Official Announcements & Campaigns
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-serif">
            Posters & Latest Updates
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Stay updated with upcoming university spot admissions, new batch starts for IELTS & German language classes, and overseas education seminars.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 justify-start sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosters.map((p) => {
            const waLink = buildWhatsAppLink(
              p.customWhatsAppMsg ||
                `Hello Athmanathan Study Abroad, I saw the poster "${p.title}" and want to get more information.`,
              settings.whatsapp
            );

            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => setPreviewPoster(p)}
                    className="h-64 sm:h-72 overflow-hidden bg-slate-950 relative cursor-pointer group"
                    title="Click to view full poster"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-xs border border-white/20">
                        {p.category}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs backdrop-blur-[2px]">
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span>View Full Poster</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-blue-700" />
                      <span>{p.date}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 font-serif">
                      {p.title}
                    </h3>

                    {p.id === 'pst_malaysia_hospitality' && (
                      <div className="flex flex-wrap gap-1.5 py-1">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                          🏨 Hostel &amp; Food FREE
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                          💰 ₹35,000+ Stipend
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                          📈 100% Placement
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                          🎓 Age Up to 25
                        </span>
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onOpenEnquiry(`Poster: ${p.title}`)}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
                  >
                    Quick Enquiry
                  </button>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{p.ctaText || 'Chat on WhatsApp'}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPosters.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No posters found in this category</h3>
            <p className="text-xs text-slate-500 mt-1">Check back soon for new announcements.</p>
          </div>
        )}

        {/* Fullscreen Poster Lightbox Modal */}
        {previewPoster && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8">
              <button
                onClick={() => setPreviewPoster(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src={previewPoster.imageUrl}
                  alt={previewPoster.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {previewPoster.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    {previewPoster.date}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                    {previewPoster.title}
                  </h2>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    {previewPoster.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      const title = previewPoster.title;
                      setPreviewPoster(null);
                      onOpenEnquiry(`Poster: ${title}`);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Apply / Quick Enquiry
                  </button>

                  <a
                    href={buildWhatsAppLink(
                      previewPoster.customWhatsAppMsg || `Hello Athmanathan Study Abroad, I am interested in ${previewPoster.title}.`,
                      settings.whatsapp
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{previewPoster.ctaText || 'Chat on WhatsApp'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
