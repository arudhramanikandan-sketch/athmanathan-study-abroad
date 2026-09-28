import React from 'react';
import {
  Compass,
  MapPin,
  MessageSquare,
  FileCheck,
  Coins,
  ShieldCheck,
  Package,
  Plane,
  Home,
  BookOpen,
  HeartHandshake,
} from 'lucide-react';

export const JourneyRoadmap: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Explore',
      desc: 'Discover countries, universities, tuition fees, post-study work rights, and living costs.',
      icon: Compass,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      num: '02',
      title: 'Choose',
      desc: 'Select programs matching your career ambition, grades, academic background, and budget.',
      icon: MapPin,
      color: 'from-indigo-600 to-blue-700',
    },
    {
      num: '03',
      title: 'Counselling',
      desc: 'Personalised one-on-one session with senior overseas counsellors with parent participation.',
      icon: MessageSquare,
      color: 'from-blue-700 to-cyan-700',
    },
    {
      num: '04',
      title: 'Apply',
      desc: 'Document verification, SOP framing, academic transcripts, and official university portal submission.',
      icon: FileCheck,
      color: 'from-cyan-700 to-teal-700',
    },
    {
      num: '05',
      title: 'Funding',
      desc: 'Merit scholarship applications and collateral/non-collateral education loan sanction support.',
      icon: Coins,
      color: 'from-teal-700 to-emerald-700',
    },
    {
      num: '06',
      title: 'Visa',
      desc: 'CAS / I-20 review, 28-day financial fund verification, blocked accounts, and mock interviews.',
      icon: ShieldCheck,
      color: 'from-emerald-700 to-emerald-800',
    },
    {
      num: '07',
      title: 'Prepare',
      desc: 'Pre-departure briefing, packing checklist, Forex card setup, and health insurance guidelines.',
      icon: Package,
      color: 'from-emerald-800 to-amber-700',
    },
    {
      num: '08',
      title: 'Travel',
      desc: 'Discounted student flights, extra baggage coordination with Happy Journey Holidays, and eSIM setup.',
      icon: Plane,
      color: 'from-amber-700 to-orange-700',
    },
    {
      num: '09',
      title: 'Arrive',
      desc: 'Airport transit, verified student accommodation check-in, and local transit navigation.',
      icon: Home,
      color: 'from-orange-700 to-rose-700',
    },
    {
      num: '10',
      title: 'Study',
      desc: 'Campus orientation, semester course registration, library setup, and part-time job search advice.',
      icon: BookOpen,
      color: 'from-rose-700 to-purple-800',
    },
    {
      num: '11',
      title: 'Support',
      desc: 'Continued on-ground guidance for bank account opening, NI number, and ongoing student welfare.',
      icon: HeartHandshake,
      color: 'from-purple-800 to-blue-900',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
            The Athmanathan Pathway
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
            Our Journey With You
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            From your initial consultation in India to your graduation and settling-in abroad, we accompany every student with step-by-step transparency.
          </p>
        </div>

        {/* 11 Steps Grid / Chain */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-400 group-hover:text-blue-700 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                    <span>{step.title}</span>
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Step {idx + 1} of 11</span>
                  <span className="text-blue-700 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
