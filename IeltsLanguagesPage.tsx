import React from 'react';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  MessageCircle,
  Sparkles,
  Users,
  FileCheck,
} from 'lucide-react';
import { Course, SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';

interface IeltsLanguagesPageProps {
  courses: Course[];
  settings: SiteSettings;
  onOpenEnquiry: (context?: string) => void;
}

export const IeltsLanguagesPage: React.FC<IeltsLanguagesPageProps> = ({
  courses,
  settings,
  onOpenEnquiry,
}) => {
  const testCourses = courses.filter((c) => c.category === 'English / Test Preparation');
  const languageCourses = courses.filter((c) => c.category === 'Foreign Languages');

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
            Language Academy & Test Preparation
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-serif">
            IELTS, PTE & Language Training
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Achieve your target score with expert coaching, personalized feedback, timed computer-based mock tests, and intensive language immersion for European universities.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Certified Trainers</h4>
            <p className="text-xs text-slate-600">
              Experienced instructors providing individual speaking interviews and writing assessments.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <FileCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Timed Mock Tests</h4>
            <p className="text-xs text-slate-600">
              Full-length computer-delivered mock tests matching real exam conditions with band analysis.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Flexible Timings</h4>
            <p className="text-xs text-slate-600">
              Morning, evening, and dedicated weekend batches tailored for working professionals and students.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Small Batch Size</h4>
            <p className="text-xs text-slate-600">
              Limited students per classroom ensuring personal attention and daily speaking practice.
            </p>
          </div>
        </div>

        {/* 1. English Test Preparation Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-serif">
                English Proficiency Test Coaching
              </h2>
              <p className="text-xs text-slate-500">IELTS Academic, General, PTE, TOEFL, and OET</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testCourses.map((c) => {
              const wa = buildWhatsAppLink(
                `Hello Athmanathan Study Abroad, I am interested in joining your upcoming batch for ${c.name}.`,
                settings.whatsapp
              );

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-100 mb-2 inline-block">
                      {c.subCategory}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 font-serif mb-2">
                      {c.name}
                    </h3>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      {c.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-700 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Batch Duration:</span>
                        <span className="font-semibold">{c.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Indicative Fee:</span>
                        <span className="font-bold text-emerald-700">{c.indicativeFee}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Batches:</span>
                        <span className="font-medium text-slate-800">{c.intakes.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenEnquiry(`Test Prep: ${c.name}`)}
                      className="px-4 py-2 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100/80 rounded-xl transition-colors"
                    >
                      Enquire Batch
                    </button>
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs"
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

        {/* 2. Foreign Languages Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-serif">
                European & Foreign Language Batches
              </h2>
              <p className="text-xs text-slate-500">
                Essential for tuition-free public German universities, European integration, and part-time jobs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {languageCourses.map((c) => {
              const wa = buildWhatsAppLink(
                `Hello Athmanathan Study Abroad, I would like to join the language training batch for ${c.name}.`,
                settings.whatsapp
              );

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-100 mb-2 inline-block">
                      {c.subCategory}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 font-serif mb-2">
                      {c.name}
                    </h3>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      {c.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-700 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Course Duration:</span>
                        <span className="font-semibold">{c.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Indicative Fee:</span>
                        <span className="font-bold text-emerald-700">{c.indicativeFee}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Curriculum:</span>
                        <span className="font-medium text-slate-800">{c.entryRequirements}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenEnquiry(`Language: ${c.name}`)}
                      className="px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100/80 rounded-xl transition-colors"
                    >
                      Join Batch
                    </button>
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs"
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
    </div>
  );
};
