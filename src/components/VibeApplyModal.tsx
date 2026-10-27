import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Send, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';
import { VibeCourse, VIBE_COURSES } from '../data/vibeCoursesData';

interface VibeApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  selectedCourse?: VibeCourse | null;
  selectedTrackName?: string | null;
}

export const VibeApplyModal: React.FC<VibeApplyModalProps> = ({
  isOpen,
  onClose,
  settings,
  selectedCourse,
  selectedTrackName,
}) => {
  const [fullName, setFullName] = useState('');
  const [whatsappMobile, setWhatsappMobile] = useState('');
  const [email, setEmail] = useState('');
  const [courseId, setCourseId] = useState(selectedCourse?.id || VIBE_COURSES[0].id);
  const [trackName, setTrackName] = useState(selectedTrackName || '');
  const [highestQualification, setHighestQualification] = useState('');
  const [cityState, setCityState] = useState('');
  const [preferredIntake, setPreferredIntake] = useState('Upcoming 2026 Intakes');
  const [question, setQuestion] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOpeningWhatsApp, setIsOpeningWhatsApp] = useState(false);

  // Sync when selected course changes
  useEffect(() => {
    if (selectedCourse) {
      setCourseId(selectedCourse.id);
      if (selectedTrackName) {
        setTrackName(selectedTrackName);
      } else {
        const defaultTrack = selectedCourse.availableTracks.find(
          (t) => t.id === selectedCourse.defaultTrackId
        );
        setTrackName(defaultTrack ? defaultTrack.name : selectedCourse.availableTracks[0].name);
      }
    }
  }, [selectedCourse, selectedTrackName]);

  const activeCourse = VIBE_COURSES.find((c) => c.id === courseId) || VIBE_COURSES[0];

  // Auto-update track if activeCourse changes and current track is not available in new course
  useEffect(() => {
    if (activeCourse) {
      const trackExists = activeCourse.availableTracks.some((t) => t.name === trackName);
      if (!trackExists) {
        const def = activeCourse.availableTracks.find((t) => t.id === activeCourse.defaultTrackId);
        setTrackName(def ? def.name : activeCourse.availableTracks[0].name);
      }
    }
  }, [courseId, activeCourse, trackName]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!whatsappMobile.trim()) {
      errs.whatsappMobile = 'WhatsApp / Mobile Number is required.';
    } else if (whatsappMobile.replace(/[^0-9]/g, '').length < 8) {
      errs.whatsappMobile = 'Please enter a valid phone number (at least 8 digits).';
    }
    if (!highestQualification.trim()) errs.highestQualification = 'Highest qualification is required (e.g. 12th / Diploma / Graduate).';
    if (!cityState.trim()) errs.cityState = 'Current City & State is required.';
    if (!preferredIntake.trim()) errs.preferredIntake = 'Preferred intake is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Construct the structured WhatsApp message exactly as requested
    const messageLines = [
      'Hello Athmanathan Study Abroad,',
      '',
      'I would like to enquire about studying at VIBE Education, Dubai.',
      '',
      `Student Name: ${fullName.trim()}`,
      `Mobile Number: ${whatsappMobile.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      `Preferred Course: ${activeCourse.title}`,
      `Course Level: ${activeCourse.level}`,
      `Preferred Track: ${trackName || 'Regular Track'}`,
      `Highest Qualification: ${highestQualification.trim()}`,
      `Current City/State: ${cityState.trim()}`,
      `Preferred Intake: ${preferredIntake.trim()}`,
      question.trim() ? `Additional Question: ${question.trim()}` : null,
      '',
      'Please share the admission requirements, course fees, visa process, and next steps.',
      '',
      'Thank you.',
    ].filter(Boolean) as string[];

    const finalMessage = messageLines.join('\n');

    // Build link to the central configured WhatsApp number (from settings.whatsapp)
    const waUrl = buildWhatsAppLink(finalMessage, settings.whatsapp);

    setIsOpeningWhatsApp(true);

    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      setIsOpeningWhatsApp(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Dubai Study Enquiry
            </span>
            <span className="text-xs text-blue-200 font-medium">VIBE Education</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
            Apply Now & WhatsApp Enquiry
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Fill your details below to directly connect with our senior education counselor via our official WhatsApp ({settings.whatsapp}).
          </p>
        </div>

        {/* Content */}
        {isOpeningWhatsApp ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Connecting to WhatsApp...</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your inquiry message has been prepared for Athmanathan Study Abroad ({settings.whatsapp}). WhatsApp will open with your pre-filled inquiry.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Redirecting now...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
            {/* Full Name & WhatsApp Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Senthil Kumar"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-hidden focus:ring-2 ${
                    errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-red-600 mt-0.5">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp / Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={whatsappMobile}
                  onChange={(e) => setWhatsappMobile(e.target.value)}
                  placeholder="e.g. +91 98401 23456"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-hidden focus:ring-2 ${
                    errors.whatsappMobile ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                  }`}
                />
                {errors.whatsappMobile && <p className="text-[11px] text-red-600 mt-0.5">{errors.whatsappMobile}</p>}
              </div>
            </div>

            {/* Email (Optional) & Current City/State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current City & State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cityState}
                  onChange={(e) => setCityState(e.target.value)}
                  placeholder="e.g. Coimbatore, Tamil Nadu"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-hidden focus:ring-2 ${
                    errors.cityState ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                  }`}
                />
                {errors.cityState && <p className="text-[11px] text-red-600 mt-0.5">{errors.cityState}</p>}
              </div>
            </div>

            {/* Course Selector & Study Track */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100">
              <div>
                <label className="block text-xs font-bold text-blue-950 mb-1">
                  Preferred Course <span className="text-red-500">*</span>
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
                >
                  {VIBE_COURSES.map((crs) => (
                    <option key={crs.id} value={crs.id}>
                      {crs.level} — {crs.title}
                    </option>
                  ))}
                </select>
                <span className="block text-[11px] text-blue-700 font-semibold mt-1">
                  {activeCourse.level} • {activeCourse.credits} Credits
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-950 mb-1">
                  Study Track <span className="text-red-500">*</span>
                </label>
                <select
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
                >
                  {activeCourse.availableTracks.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.feeLabel})
                    </option>
                  ))}
                </select>
                <span className="block text-[11px] text-slate-600 mt-1">
                  Duration: {activeCourse.availableTracks.find((t) => t.name === trackName)?.duration || activeCourse.availableTracks[0].duration}
                </span>
              </div>
            </div>

            {/* Highest Qualification & Preferred Intake */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Highest Academic Qualification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={highestQualification}
                  onChange={(e) => setHighestQualification(e.target.value)}
                  placeholder="e.g. 12th / B.Com / Polytechnic"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-hidden focus:ring-2 ${
                    errors.highestQualification ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                  }`}
                />
                {errors.highestQualification && (
                  <p className="text-[11px] text-red-600 mt-0.5">{errors.highestQualification}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Intake <span className="text-red-500">*</span>
                </label>
                <select
                  value={preferredIntake}
                  onChange={(e) => setPreferredIntake(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
                >
                  <option value="January 2026">January 2026 Intake</option>
                  <option value="April 2026">April 2026 Intake</option>
                  <option value="July 2026">July 2026 Intake</option>
                  <option value="October 2026">October 2026 Intake</option>
                  <option value="Upcoming 2026 Intakes">Upcoming 2026 Intakes (Rolling)</option>
                </select>
              </div>
            </div>

            {/* Additional Question (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Additional Question / Remarks <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Inquiring about hostel availability, visa timeline, or fast-track eligibility..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Privacy & WhatsApp Direct Notice */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2.5 text-[11px] text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                Your enquiry will be sent directly to Athmanathan Study Abroad on WhatsApp (<strong className="text-slate-800">{settings.whatsapp}</strong>). No payment or identity documents are requested at this stage. You can review the message before sending.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Enquire via WhatsApp</span>
                <Send className="w-3.5 h-3.5 text-emerald-100" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
