import React, { useState } from 'react';
import {
  Home,
  Coins,
  Utensils,
  Bus,
  Wifi,
  HeartPulse,
  CreditCard,
  CheckSquare,
  MessageCircle,
  FileText,
} from 'lucide-react';
import { StudentEssential, SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';

interface StudentEssentialsPageProps {
  essentials: StudentEssential[];
  settings: SiteSettings;
  onOpenEnquiry: (context?: string) => void;
}

export const StudentEssentialsPage: React.FC<StudentEssentialsPageProps> = ({
  essentials,
  settings,
  onOpenEnquiry,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Accommodation',
    'Living Costs',
    'Food & Groceries',
    'Transport',
    'SIM & Internet',
    'Healthcare & Insurance',
    'Banking & Forex',
    'Checklist',
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Accommodation':
        return Home;
      case 'Living Costs':
        return Coins;
      case 'Food & Groceries':
        return Utensils;
      case 'Transport':
        return Bus;
      case 'SIM & Internet':
        return Wifi;
      case 'Healthcare & Insurance':
        return HeartPulse;
      case 'Banking & Forex':
        return CreditCard;
      default:
        return CheckSquare;
    }
  };

  const filteredEssentials = essentials.filter(
    (e) => activeCategory === 'All' || e.category === activeCategory
  );

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
            Practical Student Guides
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-serif">
            Student Essentials & Life Abroad
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Essential advice for Indian students on living expenses, finding safe housing, cooking, student discounts, local banking, and pre-departure preparation.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 justify-start sm:justify-center">
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

        {/* Essentials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEssentials.map((item) => {
            const Icon = getCategoryIcon(item.category);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.category}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-serif mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line mb-4">
                    {item.details}
                  </div>

                  {item.checklists && item.checklists.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-xs font-bold text-slate-800 block">
                        Key Checklist:
                      </span>
                      {item.checklists.map((chk, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckSquare className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{chk}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onOpenEnquiry(`Student Essential: ${item.title}`)}
                    className="text-xs font-semibold text-blue-900 hover:text-blue-700"
                  >
                    Request Support on this Topic
                  </button>

                  <a
                    href={buildWhatsAppLink(
                      `Hello Athmanathan Study Abroad, I need help with "${item.title}". Please guide me.`,
                      settings.whatsapp
                    )}
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
    </div>
  );
};
