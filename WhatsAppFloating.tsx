import React, { useState } from 'react';
import { MessageCircle, X, ArrowRight, HelpCircle, GraduationCap, Plane, FileCheck } from 'lucide-react';
import { buildWhatsAppLink } from '../api';
import { SiteSettings } from '../types';

interface WhatsAppFloatingProps {
  whatsappNumber?: string;
  settings?: SiteSettings;
}

export const WhatsAppFloating: React.FC<WhatsAppFloatingProps> = ({ whatsappNumber, settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activePhone = whatsappNumber || settings?.whatsapp || '919994986650';

  const quickOptions = [
    {
      label: 'Free Profile Assessment',
      msg: 'Hello Athmanathan Study Abroad, I would like to get my academic profile evaluated for 2026 intakes.',
      icon: GraduationCap,
    },
    {
      label: 'IELTS / PTE Test Prep Enquiry',
      msg: 'Hello, I want to know about upcoming IELTS and Language training batch schedules and fees.',
      icon: HelpCircle,
    },
    {
      label: 'Visa & Financial Rules Query',
      msg: 'Hello, I need guidance regarding student visa requirements and proof of funds.',
      icon: FileCheck,
    },
    {
      label: 'eSIM & Travel Support',
      msg: 'Hello, I am interested in ordering an international student eSIM before departure.',
      icon: Plane,
    },
  ];

  const handleLaunch = (msg: string) => {
    const url = buildWhatsAppLink(msg, activePhone);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Quick popup options */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Athmanathan Study Abroad</h4>
                  <p className="text-xs text-emerald-100">Usually responds within a few minutes</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
                aria-label="Close WhatsApp options"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-3 space-y-2 bg-slate-50/50">
            <p className="text-xs text-slate-500 px-1 font-medium">
              Select a quick enquiry topic or type directly:
            </p>
            {quickOptions.map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleLaunch(opt.msg)}
                  className="w-full text-left p-2.5 bg-white hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100/60 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-950">
                      {opt.label}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Direct WhatsApp: {settings?.whatsapp || '+91 99949 86650'}</span>
            <button
              onClick={() => handleLaunch('Hello Athmanathan Study Abroad, I would like to speak with a counsellor.')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline"
            >
              Open Custom Chat
            </button>
          </div>
        </div>
      )}

      {/* Main floating trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all focus:outline-hidden"
        aria-label="Chat on WhatsApp with Athmanathan Study Abroad"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline font-semibold text-sm tracking-wide">
          {isOpen ? 'Close' : 'Chat on WhatsApp'}
        </span>
      </button>
    </div>
  );
};
