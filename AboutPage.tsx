import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Users,
  Compass,
  Award,
  HeartHandshake,
  CheckCircle2,
  FileCheck,
  FileText,
  Phone,
  MessageCircle,
  ExternalLink,
  Plane,
  Globe,
  Building2,
  Sparkles,
  Home,
  Smartphone,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';
import { JourneyRoadmap } from '../components/JourneyRoadmap';

interface AboutPageProps {
  settings: SiteSettings;
  onOpenEnquiry: (context?: string) => void;
  onOpenLegalModal?: (topic: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onOpenEnquiry, onOpenLegalModal }) => {
  const whatsAppUrl = buildWhatsAppLink(
    'Hello Athmanathan Study Abroad, I read about your consultancy and would like to consult with you for my higher education.',
    settings.whatsapp
  );

  const whatWeHelpWith = [
    { title: 'Study Abroad Counselling', desc: 'One-on-one profile evaluation with students and parents', icon: Users, tag: 'Foundation' },
    { title: 'Country & Course Selection', desc: 'Selecting programs that match academic goals, budget and PR rights', icon: Globe, tag: 'Selection' },
    { title: 'University / College Shortlisting', desc: 'Targeting ambitious, realistic, and safe globally accredited institutions', icon: Building2, tag: 'Shortlisting' },
    { title: 'Admission & Application Guidance', desc: 'End-to-end support with university portal submissions and deadlines', icon: FileCheck, tag: 'Admissions' },
    { title: 'IELTS & English Language Training', desc: 'Comprehensive coaching for IELTS, TOEFL, PTE & Duolingo exams', icon: Award, tag: 'Test Prep' },
    { title: 'Foreign Language Training', desc: 'German, French and destination-specific language proficiency prep', icon: GraduationCap, tag: 'Languages' },
    { title: 'Scholarship & Education Loan Guidance', desc: 'Institutional grants, merit waivers, and bank loan sanction support', icon: Sparkles, tag: 'Financial' },
    { title: 'Document Guidance', desc: 'SOP review, LOR framing, resume curation and academic transcripts', icon: FileText, tag: 'Documentation' },
    { title: 'Visa Guidance', desc: 'Financial proofs, visa filing, blocked accounts and embassy mock interviews', icon: ShieldCheck, tag: 'Visa Filing' },
    { title: 'Pre-Departure Support', desc: 'Briefings on packing, student culture, flight ticketing and baggage allowances', icon: Plane, tag: 'Pre-Departure' },
    { title: 'Accommodation & Travel Guidance', desc: 'Verified student housing, homestays, airport transfers and bookings', icon: Home, tag: 'Travel & Stay' },
    { title: 'eSIM & Connectivity Support', desc: 'Instant international data eSIMs activated prior to departure', icon: Smartphone, tag: 'Connectivity' },
    { title: 'Post-Arrival Student Support', desc: 'Local registration, bank accounts, healthcare setup and community support', icon: HeartHandshake, tag: 'On-Ground Care' },
  ];

  const journeySteps = [
    'Explore',
    'Choose',
    'Counselling',
    'Apply',
    'Funding',
    'Visa',
    'Prepare',
    'Travel',
    'Arrive',
    'Study',
    'Support',
  ];

  return (
    <div className="space-y-0">
      {/* 1. Page Header (## About Us / ### Your Dream. Our Guidance.) */}
      <section className="bg-slate-950 text-white py-16 sm:py-20 px-4 sm:px-6 border-b border-slate-850">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <span>About Us</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-white tracking-tight">
            Your Dream. Our Guidance.
          </h1>

          <p className="text-base sm:text-xl text-blue-100 max-w-3xl mx-auto font-medium leading-relaxed">
            <strong className="text-white font-bold">ATHMANATHAN STUDY ABROAD</strong> is a student-focused overseas education consultancy dedicated to helping students make informed decisions about their international education journey.
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We provide guidance from the initial stage of <strong className="text-white font-semibold">course and country selection</strong> through <strong className="text-white font-semibold">university shortlisting, application support, visa guidance, pre-departure preparation and travel assistance</strong>.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenEnquiry('About Us Header')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
            >
              Book Free Counselling Session
            </button>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          <div className="pt-4 text-xs text-slate-400">
            {settings.registrationNumber && (
              <span className="font-mono bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                {settings.registrationNumber}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 2. The Guiding Conviction of ATHMANATHAN Study Abroad */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              The Guiding Conviction
            </span>
            <blockquote className="text-2xl sm:text-4xl font-extrabold font-serif text-white tracking-tight leading-snug">
              “A guidance once given can guide many lives.”
            </blockquote>
            <p className="text-sm sm:text-base font-semibold text-blue-300 font-serif tracking-wide">
              The Guiding Conviction of ATHMANATHAN Study Abroad
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-blue-500/20 backdrop-blur-xs space-y-6 shadow-2xl shadow-blue-950/50">
            <div className="space-y-4 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              <p>
                The name <strong className="text-white font-bold">ATHMANATHAN</strong> is drawn from profound respect and gratitude for a mentor, guide, and well-wisher whose practical wisdom, steady courage, and unflinching sense of responsibility left an indelible mark.
              </p>
              <p>
                In our formative years, receiving clear, unvarnished advice from someone who genuinely cares about your long-term welfare alters the course of life. A true mentor does not merely point toward ambition; they instill discipline, insist upon ethical integrity, and stand firm when complex challenges arise.
              </p>
              <div className="p-5 sm:p-6 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-blue-100 my-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  Our Core Ethos
                </span>
                <p className="text-lg sm:text-xl font-serif italic text-white font-medium">
                  “Guidance that carries forward.”
                </p>
                <p className="text-xs sm:text-sm text-blue-200 mt-2 leading-relaxed">
                  Just as principled guidance once illuminated a singular path, <strong className="text-white font-semibold">ATHMANATHAN Study Abroad</strong> exists to extend that very clarity and steady counsel to ambitious scholars navigating the global admissions landscape.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300 font-medium">Built on Discipline, Practical Wisdom & Ethical Integrity</span>
              </div>
              <button
                onClick={() => onOpenEnquiry('About: Guiding Conviction')}
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold cursor-pointer transition-colors"
              >
                <span>Experience Mentorship With Us</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2b. Introduction & Simple Approach Banner */}
      <section className="py-12 bg-blue-50/50 border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">
            Our approach is simple: <span className="text-blue-950 font-bold">understand each student's academic background, interests, career goals and preferred destination</span>, then help them explore suitable study options.
          </p>
        </div>
      </section>

      {/* 3. What We Help With */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
              Comprehensive Support
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              What We Help With
            </h2>
            <p className="text-sm text-slate-600">
              Complete, end-to-end guidance from initial enquiry to settling into university life abroad.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {whatWeHelpWith.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md transition-all duration-200 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200/60">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full shrink-0">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-bold">Have a specific question about your study path?</h3>
              <p className="text-xs text-blue-200">Our counsellors review your background and suggest the best routes.</p>
            </div>
            <button
              onClick={() => onOpenEnquiry('About: What We Help With')}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-950 hover:bg-blue-50 text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Request Free Consultation
            </button>
          </div>
        </div>
      </section>

      {/* 4. Our Approach & Our Commitment */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {/* Our Approach Card */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
                    Student-Centric Philosophy
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 font-serif">
                    Our Approach
                  </h2>
                </div>
                <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                  <p>
                    We believe every student has a different academic background, budget, career goal and destination preference. Therefore, we focus on <strong className="text-slate-900 font-bold">personalised guidance rather than a one-size-fits-all approach</strong>.
                  </p>
                  <p>
                    Our team aims to make the study-abroad process easier to understand by providing clear information, practical guidance and step-by-step support.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Personalised counseling tailored to individual strengths</span>
                </div>
              </div>
            </div>

            {/* Our Commitment Card */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
                    Honesty & Transparency
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 font-serif">
                    Our Commitment
                  </h2>
                </div>
                <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                  <p>
                    We are committed to providing transparent information and responsible guidance throughout the student's journey.
                  </p>
                  <p className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
                    <strong>Important Notice:</strong> We do not guarantee admission, scholarships or visa approval, as final decisions are made by universities, educational institutions, scholarship providers and immigration authorities.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Students are encouraged to verify important admission, visa and immigration requirements through the relevant official authorities before making decisions.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>100% Ethical & Compliant Education Advisory</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our Journey With You (Explore → Support) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
              11-Step Success Path
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              Our Journey With You
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              From your first enquiry to your transition into your new study destination, <strong className="text-slate-900 font-bold">ATHMANATHAN STUDY ABROAD</strong> is here to guide you at every important step.
            </p>

            {/* Visual breadcrumb progression */}
            <div className="pt-4 overflow-x-auto pb-2">
              <div className="inline-flex items-center gap-1.5 p-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-inner">
                {journeySteps.map((step, idx) => (
                  <React.Fragment key={step}>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-blue-200 font-medium">
                      <span className="text-[10px] text-slate-400 font-mono mr-1">{idx + 1}.</span>
                      {step}
                    </span>
                    {idx < journeySteps.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Full Interactive Journey Roadmap Component */}
          <div className="pt-6">
            <JourneyRoadmap />
          </div>
        </div>
      </section>

      {/* 6. Partner Association Card & Credentials */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
                  Associated With / Our Travel & Support Partner
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-serif">
                  {settings.partnerName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
                  Working alongside Athmanathan Study Abroad to ensure seamless international transit, student flight ticketing with extra baggage allowances, and international student insurance.
                </p>
              </div>
            </div>

            <a
              href={settings.partnerUrl || 'https://happyjourneyholidays.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition-colors shrink-0"
            >
              <span>Visit Happy Journey Holidays</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Office & Legal strip */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-semibold text-blue-200">ATHMANATHAN STUDY ABROAD</p>
              <p className="text-slate-400">{settings.address}</p>
              <p className="text-slate-400 font-mono text-[11px]">{settings.registrationNumber}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenEnquiry('About Footer')}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
