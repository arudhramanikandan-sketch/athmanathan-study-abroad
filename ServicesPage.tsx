import React from 'react';
import {
  Compass,
  Building2,
  FileCheck,
  ShieldCheck,
  Award,
  BookOpen,
  Plane,
  HeartHandshake,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { ServiceItem, SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';

interface ServicesPageProps {
  services: ServiceItem[];
  settings: SiteSettings;
  onOpenEnquiry: (context?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  settings,
  onOpenEnquiry,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return Compass;
      case 'Building2':
        return Building2;
      case 'FileCheck':
        return FileCheck;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Award':
        return Award;
      case 'BookOpen':
        return BookOpen;
      case 'Plane':
        return Plane;
      default:
        return HeartHandshake;
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
            Comprehensive Guidance Architecture
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-serif">
            Our Overseas Education Services
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            From initial career assessment to post-arrival support, we deliver end-to-end guidance with zero misleading promises and complete parental transparency.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s, idx) => {
            const Icon = getIcon(s.icon);
            const waLink = buildWhatsAppLink(
              `Hello Athmanathan Study Abroad, I would like to enquire about your service: ${s.title}.`,
              settings.whatsapp
            );

            return (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-900 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-400">
                      0{idx + 1}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
                    {s.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">
                    {s.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {s.fullDescription}
                  </p>

                  <div className="space-y-2 mb-6">
                    <span className="text-xs font-bold text-slate-700 block">
                      What is included:
                    </span>
                    {s.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onOpenEnquiry(`Service: ${s.title}`)}
                    className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold transition-colors"
                  >
                    Request Consultation
                  </button>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
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
