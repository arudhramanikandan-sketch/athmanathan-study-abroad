import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import { FAQ, SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';

interface FaqPageProps {
  faqs: FAQ[];
  settings: SiteSettings;
  onOpenEnquiry: (context?: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({
  faqs,
  settings,
  onOpenEnquiry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIds, setOpenIds] = useState<string[]>([faqs[0]?.id || 'faq_1']);

  const categories = [
    'All',
    'General Admissions',
    'IELTS & Tests',
    'Student Visa',
    'Finances & Loans',
    'Gap & Profile',
    'eSIM & Travel',
  ];

  const toggleAccordion = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((x) => x !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const filteredFaqs = faqs.filter((f) => {
    const matchesCat = activeCategory === 'All' || f.category === activeCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      f.question.toLowerCase().includes(term) || f.answer.toLowerCase().includes(term);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
            Frequently Answered Queries
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-serif">
            Student & Parent FAQs
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Factual answers to common questions about admissions, language waivers, visa funds, and post-study opportunities.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);

            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
                      {faq.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No matching questions found</h3>
            <p className="text-xs text-slate-500 mt-1">Have a specific question? Ask our counsellor directly on WhatsApp.</p>
          </div>
        )}

        {/* Ask Question Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-blue-900 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="font-bold text-base font-serif">Have a question not listed here?</h4>
            <p className="text-xs text-blue-200 mt-1">
              Speak directly with an Athmanathan Study Abroad counsellor for personal advice.
            </p>
          </div>
          <a
            href={buildWhatsAppLink(
              'Hello Athmanathan Study Abroad, I have a specific question about studying abroad that was not in the FAQs.',
              settings.whatsapp
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Ask on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
