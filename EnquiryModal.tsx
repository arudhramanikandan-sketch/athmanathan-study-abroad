import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  MessageCircle,
  AlertCircle,
  Sparkles,
  Phone,
  PhoneCall,
  ShieldCheck,
  Award,
  MapPin,
  Globe,
  RotateCcw,
  PlusCircle,
  Clock,
} from 'lucide-react';
import { submitEnquiry, buildWhatsAppLink } from '../api';
import { SiteSettings } from '../types';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  context?: string | null;
  defaultContext?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  settings,
  context,
  defaultContext = '',
}) => {
  const effectiveContext = context || defaultContext || '';

  const getInitialFormData = () => ({
    fullName: '',
    whatsappMobile: '',
    email: '',
    highestQualification: '',
    currentLocation: '',
    preferredCountry: effectiveContext.includes('Country:') ? effectiveContext.replace('Country:', '').trim() : 'United Kingdom',
    preferredCourse: effectiveContext.includes('Course:') ? effectiveContext.replace('Course:', '').trim() : '',
    preferredIntake: 'September 2026',
    englishTestStatus: 'Planning to Take IELTS / PTE',
    workExperience: 'None / Fresher',
    passportStatus: 'Available (Valid)',
    message: effectiveContext ? `I am enquiring regarding: ${effectiveContext}` : '',
  });

  const [formData, setFormData] = useState(getInitialFormData);

  useEffect(() => {
    if (isOpen && effectiveContext) {
      setFormData((prev) => ({
        ...prev,
        message: `I am enquiring regarding: ${effectiveContext}`,
        preferredCountry: effectiveContext.includes('Country:')
          ? effectiveContext.replace('Country:', '').trim()
          : (effectiveContext.includes('eSIM:') && effectiveContext.includes('United Kingdom') ? 'United Kingdom' : prev.preferredCountry),
      }));
    }
  }, [isOpen, effectiveContext]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submittedRegId, setSubmittedRegId] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    fullName: string;
    whatsappMobile: string;
    currentLocation: string;
    preferredCountry: string;
    preferredCourse: string;
  } | null>(null);

  // Auto-reset countdown state (in seconds)
  const [autoResetCountdown, setAutoResetCountdown] = useState<number | null>(null);
  const [isCountdownPaused, setIsCountdownPaused] = useState(false);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Automatically resets all EnquiryModal form state back to initial values
   * so the modal is fresh and immediately ready for a new student entry.
   */
  const resetFormState = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setAutoResetCountdown(null);
    setIsCountdownPaused(false);
    setLoading(false);
    setError(null);
    setSuccessMsg(null);
    setSubmittedRegId(null);
    setSubmittedData(null);
    setFormData(getInitialFormData());
  };

  // Gracefully handle modal close while ensuring submitted form state is reset
  const handleModalClose = () => {
    if (successMsg) {
      resetFormState();
    }
    onClose();
  };

  // Reset state when modal is closed externally
  useEffect(() => {
    if (!isOpen && successMsg) {
      resetFormState();
    }
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleModalClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, successMsg]);

  // Automatic countdown timer to reset form state after successful submission
  useEffect(() => {
    if (successMsg && !isCountdownPaused) {
      setAutoResetCountdown(15);
      countdownTimerRef.current = setInterval(() => {
        setAutoResetCountdown((prev) => {
          if (prev === null || prev <= 1) {
            if (countdownTimerRef.current) {
              clearInterval(countdownTimerRef.current);
              countdownTimerRef.current = null;
            }
            resetFormState();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    };
  }, [successMsg, isCountdownPaused]);

  // No browser geolocation permission requests
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName.trim() ||
      !formData.whatsappMobile.trim() ||
      !formData.email.trim() ||
      !formData.highestQualification.trim() ||
      !formData.message.trim()
    ) {
      setError('Please fill in all required fields marked with * (Full Name, WhatsApp Number, Email Address, Highest Qualification, and Preferred Course / Message).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await submitEnquiry({
        ...formData,
        sourcePage: defaultContext || 'Public Website Modal',
      });
      if (res.enquiryId) {
        setSubmittedRegId(res.enquiryId);
      }
      setSubmittedData({
        fullName: formData.fullName,
        whatsappMobile: formData.whatsappMobile,
        currentLocation: formData.currentLocation,
        preferredCountry: formData.preferredCountry,
        preferredCourse: formData.preferredCourse,
      });
      setSuccessMsg(res.message);
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activeCandidateName = submittedData?.fullName || formData.fullName;
  const activeCandidateMobile = submittedData?.whatsappMobile || formData.whatsappMobile;
  const activeCandidateLocation = submittedData?.currentLocation || formData.currentLocation;
  const activeCandidateCountry = submittedData?.preferredCountry || formData.preferredCountry;
  const activeCandidateCourse = submittedData?.preferredCourse || formData.preferredCourse;

  const directWhatsAppUrl = buildWhatsAppLink(
    `Hello Athmanathan Study Abroad, I just submitted an enquiry for ${activeCandidateName} (${activeCandidateMobile}${activeCandidateLocation ? ` from ${activeCandidateLocation}` : ''}). Interested in ${activeCandidateCountry} for ${activeCandidateCourse || 'Higher Studies'}.`,
    settings.whatsapp
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleModalClose();
        }
      }}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Top-Right Close Icon Button */}
        <button
          type="button"
          onClick={handleModalClose}
          id="enquiry-modal-floating-close-btn"
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs border border-white/30 shadow-md"
          title="Close window (Esc)"
          aria-label="Close modal window"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header with Close Window on Top */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 relative pr-16 sm:pr-20">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Direct Counsellor Access
            </span>
            <button
              type="button"
              onClick={handleModalClose}
              id="enquiry-modal-top-close-btn"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-semibold transition-all border border-white/20 shadow-xs cursor-pointer"
              aria-label="Close window"
            >
              <X className="w-4 h-4" />
              <span>Close Window</span>
            </button>
          </div>

          <h3 className="text-2xl font-bold font-serif">
            Student Profile Assessment & Registration
          </h3>
          <p className="text-xs sm:text-sm text-blue-200 mt-1">
            Free student registration & personalized counselling. Submit your details to receive an official application registration reference.
          </p>
        </div>

        {/* Top Close & Enquiry/Registration Helpline Bar */}
        <div
          id="enquiry-modal-top-bar"
          className="bg-slate-100/90 border-b border-slate-200 px-6 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600"
        >
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">Admissions online</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <PhoneCall className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-slate-500 font-medium">Enquiry & Reg No:</span>
              <a
                href={`tel:${(settings.phone || '+91 9994986650').replace(/[^0-9+]/g, '')}`}
                className="text-blue-900 hover:text-blue-700 underline decoration-blue-300 underline-offset-2"
              >
                {settings.phone || '+91 99949 86650'}
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-950 transition-colors ml-auto cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-slate-500" />
            <span>Close Window</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {successMsg ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                Thank You, {activeCandidateName}!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {successMsg}
              </p>

              {/* Candidate Registration Number Confirmation Card */}
              <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl max-w-md mx-auto text-left shadow-2xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Candidate Registration Confirmed</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                    Verified
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-blue-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                      Official Registration Reference No.
                    </span>
                    <span className="font-mono text-base font-black text-blue-950 tracking-wide">
                      ASA-REG-2026-{(submittedRegId || '986650').replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                  Please quote this <strong>Registration Number</strong> when contacting our senior counsellor directly or visiting our office.
                </p>
              </div>

              {/* Auto-Reset Countdown Banner */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2.5 max-w-md mx-auto">
                <div className="flex items-center gap-2 text-left">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    {autoResetCountdown !== null ? (
                      <>
                        Auto-resetting for next student entry in{' '}
                        <strong className="text-blue-900 font-mono font-bold">{autoResetCountdown}s</strong>
                      </>
                    ) : (
                      <span>Form reset is ready for a new entry</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {autoResetCountdown !== null && (
                    <button
                      type="button"
                      onClick={() => setIsCountdownPaused(!isCountdownPaused)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      {isCountdownPaused ? 'Resume' : 'Pause'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={resetFormState}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold text-[11px] transition-colors cursor-pointer"
                    title="Reset form immediately for another entry"
                  >
                    <RotateCcw className="w-3 h-3 text-blue-700" />
                    <span>Reset Now</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect Instantly on WhatsApp</span>
                </a>
              </div>

              {/* Success State Action Bar: New Entry or Close */}
              <div className="mt-8 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-4 sm:px-8 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-3xl">
                <button
                  type="button"
                  onClick={resetFormState}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Another Profile / New Entry</span>
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-500" />
                  <span>Close Window</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Prominent Enquiry & Registration Badge on Top */}
              <div
                id="enquiry-modal-top-helpline-card"
                className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/90 via-slate-50 to-indigo-50/70 border border-blue-100 flex flex-col gap-3 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <PhoneCall className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-blue-700 block leading-tight">
                        Admissions Enquiry & Registration Helpline
                      </span>
                      <a
                        href={`tel:${(settings.phone || '+91 9994986650').replace(/[^0-9+]/g, '')}`}
                        className="text-base sm:text-lg font-black text-slate-900 hover:text-blue-700 transition-colors tracking-tight font-mono"
                      >
                        {settings.phone || '+91 99949 86650'}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <a
                      href={`tel:${(settings.phone || '+91 9994986650').replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-200 shadow-2xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={buildWhatsAppLink('Hello Athmanathan Study Abroad, I am enquiring about admissions and registration.', settings.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-950 font-semibold text-xs border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                      title="Close window (Esc)"
                      aria-label="Close window"
                    >
                      <X className="w-3.5 h-3.5 text-slate-500" />
                      <span>Close</span>
                    </button>
                  </div>
                </div>

                {/* Official Registration Details Strip */}
                <div className="pt-2 border-t border-blue-100/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Official Registration:</span>
                    <span className="font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-[10px]">
                      {settings.registrationNumber || 'Govt. Regd. (MSME UDYAM-TN-03-0134152)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Student Registration:</span>
                    <span className="font-semibold text-blue-900 font-mono text-[10px] bg-blue-100/80 px-1.5 py-0.5 rounded">
                      Reference Generated on Submit
                    </span>
                  </div>
                </div>
              </div>

              {effectiveContext && (
                <div className="p-3 rounded-xl bg-blue-50/90 border border-blue-200 flex items-center gap-2 text-xs">
                  <span className="font-bold text-blue-950 uppercase tracking-wide text-[10px] bg-blue-200/90 px-2 py-0.5 rounded shrink-0">
                    Enquiring For
                  </span>
                  <span className="font-semibold text-blue-900 line-clamp-1">{effectiveContext}</span>
                </div>
              )}

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Senthil Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp / Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsappMobile"
                    required
                    value={formData.whatsappMobile}
                    onChange={handleChange}
                    placeholder="e.g. +91 98401 23456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. student@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Highest Qualification <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="highestQualification"
                    required
                    value={formData.highestQualification}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech CS (2024 Passed Out, 72%)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Location / City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="currentLocation"
                      value={formData.currentLocation}
                      onChange={handleChange}
                      placeholder="e.g. Coimbatore, Tamil Nadu, India"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Destination Country
                  </label>
                  <div className="relative">
                    <select
                      name="preferredCountry"
                      value={formData.preferredCountry}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="United Kingdom">United Kingdom (UK)</option>
                      <option value="United States">United States (USA)</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="Ireland">Ireland</option>
                      <option value="France">France</option>
                      <option value="Singapore">Singapore</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="UAE">United Arab Emirates (Dubai)</option>
                      <option value="Other">Other / Not Decided</option>
                    </select>
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                  {/* Quick Select Destination Pills */}
                  <div className="flex flex-wrap items-center gap-1 mt-1.5">
                    <span className="text-[10px] text-slate-400 font-medium">Quick pick:</span>
                    {['United Kingdom', 'United States', 'Canada', 'Australia', 'Germany', 'Ireland'].map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, preferredCountry: country }))}
                        className={`text-[10px] px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                          formData.preferredCountry === country
                            ? 'bg-blue-900 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {country.replace('United Kingdom', 'UK').replace('United States', 'USA')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Intake
                  </label>
                  <select
                    name="preferredIntake"
                    value={formData.preferredIntake}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="September 2026">September / Fall 2026 (Major)</option>
                    <option value="January 2027">January / Spring 2027</option>
                    <option value="Late 2026">Late 2026</option>
                    <option value="2027 Onwards">2027 Onwards</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    IELTS / PTE / Language Status
                  </label>
                  <select
                    name="englishTestStatus"
                    value={formData.englishTestStatus}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="Planning to Take IELTS / PTE">Planning to Take IELTS / PTE</option>
                    <option value="Completed - Score 6.5+">Completed - Score 6.5+</option>
                    <option value="Completed - Score 6.0">Completed - Score 6.0</option>
                    <option value="Looking for IELTS Waiver / MOI">Looking for IELTS Waiver / MOI</option>
                    <option value="German / French Learner">German / French Learner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Valid Passport Status
                  </label>
                  <select
                    name="passportStatus"
                    value={formData.passportStatus}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="Available (Valid)">Available (Valid)</option>
                    <option value="Applied / In Process">Applied / In Process</option>
                    <option value="Not Yet Applied">Not Yet Applied</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Course / Specialization & Message <span className="text-red-500 font-bold">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={2}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="e.g. Interested in MSc Data Science or MBA. Would like to evaluate scholarship eligibility."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>

              {/* Action Buttons Bar */}
              <div
                id="enquiry-modal-close-bar"
                className="mt-6 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-4 sm:px-8 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 rounded-b-3xl"
              >
                <button
                  type="button"
                  onClick={resetFormState}
                  className="px-3.5 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 font-semibold text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  title="Reset form fields to blank default state"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset Form</span>
                </button>
                <div className="flex items-center gap-2.5 ml-auto">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    aria-label="Close modal window"
                  >
                    <X className="w-3.5 h-3.5 text-slate-500" />
                    <span>Close</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Submitting...' : 'Submit Profile for Assessment'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
