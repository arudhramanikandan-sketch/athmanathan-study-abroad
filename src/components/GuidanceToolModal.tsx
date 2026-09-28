import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, MessageCircle, HelpCircle, CheckCircle } from 'lucide-react';
import { buildWhatsAppLink } from '../api';
import { Country, Course, SiteSettings } from '../types';

interface GuidanceToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
  settings?: SiteSettings;
  countries?: Country[];
  courses?: Course[];
  onSelectCountry?: (cId: string) => void;
  onSelectCourse?: (crsId: string) => void;
  onOpenEnquiry?: (context?: string) => void;
}

export const GuidanceToolModal: React.FC<GuidanceToolModalProps> = ({
  isOpen,
  onClose,
  whatsappNumber,
  settings,
}) => {
  const activePhone = whatsappNumber || settings?.whatsapp || '919994986650';
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    qualification: '',
    studyLevel: '',
    fieldInterest: '',
    budget: '',
    testStatus: '',
    destinationPref: '',
  });

  if (!isOpen) return null;

  const handleSelect = (key: string, value: string) => {
    setAnswers({ ...answers, [key]: value });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const buildSummaryMessage = () => {
    return `Hello Athmanathan Study Abroad, I used the "Not Sure What to Study?" tool. Here are my details:
- Current Qualification: ${answers.qualification || 'Not specified'}
- Desired Study Level: ${answers.studyLevel || 'Not specified'}
- Subject Interest: ${answers.fieldInterest || 'Open to recommendations'}
- Approximate Budget: ${answers.budget || 'Flexible'}
- English Proficiency: ${answers.testStatus || 'Planning'}
- Preferred Destination: ${answers.destinationPref || 'Best recommendation'}

Could you please advise me on suitable universities and programs?`;
  };

  const handleLaunchWhatsApp = () => {
    const url = buildWhatsAppLink(buildSummaryMessage(), activePhone);
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in duration-200">
        {/* Header with Close Window on Top */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 relative">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Interactive Profiler</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-semibold transition-all border border-white/20 shadow-xs cursor-pointer"
              aria-label="Close window"
            >
              <span>Close Window</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <h3 className="text-xl font-bold font-serif">
            Not Sure What or Where to Study?
          </h3>
          <p className="text-xs text-blue-200 mt-1">
            Answer a few questions and our senior counsellor will curate personalised options for you.
          </p>

          {/* Progress bar */}
          <div className="w-full bg-blue-950/50 rounded-full h-1.5 mt-4 overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">
                1. What is your current highest qualification?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Class 12 / Higher Secondary (CBSE / State / ISC)',
                  'Engineering Degree (B.E / B.Tech)',
                  'Arts & Science Degree (B.Sc / B.Com / BCA / BBA)',
                  'Postgraduate Degree (M.Sc / M.Tech / MBA)',
                  'Working Professional with Experience',
                  'Polytechnic / Diploma',
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect('qualification', opt)}
                    className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                      answers.qualification === opt
                        ? 'border-blue-700 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">
                2. What level of overseas education are you seeking?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  "Master's Degree (1-Year UK / Europe)",
                  "Master's Degree (2-Year USA / Canada / Germany)",
                  "Bachelor's Degree (3-4 Years)",
                  'MBA / Management Specialization',
                  'Post-Graduate Certificate / Diploma',
                  'Doctorate / PhD',
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect('studyLevel', opt)}
                    className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                      answers.studyLevel === opt
                        ? 'border-blue-700 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">
                3. Which career field excites you the most?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Computer Science, AI & Data Science',
                  'Business, Management & Finance',
                  'Engineering & Core Technical Systems',
                  'Nursing, Pharmacy & Public Health',
                  'Hospitality, Tourism & Event Management',
                  'Design, Media & Communications',
                  'Not Sure - Need Counsellor Assessment',
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect('fieldInterest', opt)}
                    className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                      answers.fieldInterest === opt
                        ? 'border-blue-700 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">
                4. What is your preferred annual tuition budget range?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Tuition-Free / Low Tuition (Germany / Public EU)',
                  '₹12 Lakhs – ₹18 Lakhs / year',
                  '₹18 Lakhs – ₹25 Lakhs / year',
                  '₹25 Lakhs+ / year',
                  'Dependent on Education Loan Sanction',
                  'Seeking Full / Partial Scholarships',
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect('budget', opt)}
                    className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                      answers.budget === opt
                        ? 'border-blue-700 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">
                5. What is your current English / Language test status?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Have IELTS / PTE Score 6.5+',
                  'Planning to Take IELTS / PTE Soon',
                  'Looking for English MOI Waiver (No IELTS)',
                  'Learning German / French for Europe',
                  'Need Coaching / Training First',
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect('testStatus', opt)}
                    className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                      answers.testStatus === opt
                        ? 'border-blue-700 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                Your Preliminary Profile is Ready!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Connect directly with our senior study abroad counsellor on WhatsApp to receive a verified, zero-obligation shortlist of universities matching your profile.
              </p>

              <div className="p-3 bg-slate-50 rounded-xl text-left text-xs text-slate-600 border border-slate-200 space-y-1">
                <div><strong>Qualification:</strong> {answers.qualification || 'General'}</div>
                <div><strong>Study Level:</strong> {answers.studyLevel || 'Postgraduate'}</div>
                <div><strong>Field:</strong> {answers.fieldInterest || 'Open'}</div>
                <div><strong>Budget:</strong> {answers.budget || 'Flexible'}</div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 text-left">
                <strong>Important Note:</strong> This questionnaire provides an initial orientation for human counselling. We never pretend an automated algorithm makes official university admission decisions.
              </div>

              <button
                onClick={handleLaunchWhatsApp}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-md mt-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Get Guidance from Our Counsellor</span>
              </button>
            </div>
          )}

          {/* Bottom Close Bar & Navigation Controls */}
          <div className="mt-6 -mx-6 -mb-6 p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between rounded-b-3xl">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
              <span>Close Window</span>
            </button>

            {step < 6 ? (
              <div className="flex items-center gap-2">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  <span>{step === 5 ? 'Review Profile' : 'Next Step'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
