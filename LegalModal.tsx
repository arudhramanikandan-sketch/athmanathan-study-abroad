import React from 'react';
import { X, ShieldCheck, AlertCircle, FileText, Users, Award } from 'lucide-react';
import { SiteSettings } from '../types';

interface LegalModalProps {
  isOpen: boolean;
  topic: string | null;
  onClose: () => void;
  settings: SiteSettings;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  topic,
  onClose,
  settings,
}) => {
  if (!isOpen || !topic) return null;

  const getTitle = () => {
    switch (topic) {
      case 'no-guarantee':
        return 'No Admission Guarantee Policy';
      case 'no-visa-guarantee':
        return 'No Visa Guarantee Policy';
      case 'scholarship-disclaimer':
        return 'Scholarship & Funding Transparency Policy';
      case 'parent-notice':
        return 'Notice for Parents and Guardians';
      case 'privacy':
        return 'Privacy Policy';
      case 'terms':
        return 'Terms & Conditions';
      default:
        return 'Regulatory & Transparency Disclaimers';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in duration-200">
        <div className="bg-slate-900 text-white p-6 relative">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Athmanathan Study Abroad Transparency Framework</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold transition-all border border-white/20 shadow-xs cursor-pointer"
              aria-label="Close window"
            >
              <span>Close Window</span>
              <X className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif">{getTitle()}</h3>
        </div>

        <div className="p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-[75vh] overflow-y-auto">
          {topic === 'no-guarantee' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <strong>Mandatory Transparency Disclosure:</strong> Athmanathan Study Abroad is an independent educational counselling organization. We do not and cannot guarantee admission into any college or university.
              </div>
              <p>
                1. <strong>Institutional Authority:</strong> All admission offers (conditional, unconditional, or CAS issuance) are determined solely by the independent admissions committee and academic faculties of the respective educational institution.
              </p>
              <p>
                2. <strong>Evaluation Criteria:</strong> Institutions assess candidates based upon academic transcripts, minimum grade criteria, English language proficiency test scores, subject prerequisites, references, statements of purpose, and interview performance.
              </p>
              <p>
                3. <strong>Ethical Representation:</strong> We assist students by accurately packaging credentials, clarifying entry guidelines, reviewing statements of purpose for originality, and tracking deadlines. We do not participate in back-channel admissions or fraudulent credential generation.
              </p>
            </div>
          )}

          {topic === 'no-visa-guarantee' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs">
                <strong>Sovereign Visa Authority Notice:</strong> Visa approval or refusal is the sole and exclusive legal prerogative of the destination country's government immigration department (e.g. UK Visas and Immigration, US Department of State, Immigration Refugees and Citizenship Canada, Australian Department of Home Affairs, German Federal Foreign Office).
              </div>
              <p>
                1. <strong>No Guaranteed Visa Approvals:</strong> Athmanathan Study Abroad provides documentary guidance, financial checklist auditing, and mock interview coaching according to published immigration guidelines. We strictly disclaim any guarantee of visa approval.
              </p>
              <p>
                2. <strong>Financial Authenticity:</strong> Applicants and their financial sponsors are strictly responsible for the genuine provenance and maintenance of all funds (such as 28-day holding periods, blocked accounts, education loan disbursement letters, and tax returns).
              </p>
              <p>
                3. <strong>Immigration Law Changes:</strong> Sovereign immigration rules, minimum wage rates, and post-study work conditions are subject to unilateral amendment by destination governments without prior notice.
              </p>
            </div>
          )}

          {topic === 'scholarship-disclaimer' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
                <strong>Scholarship Transparency Policy:</strong> All scholarships, bursaries, tuition fee discounts, and fellowships listed on our platform are competitive and discretionary awards.
              </div>
              <p>
                1. <strong>Decision Bodies:</strong> Scholarships are awarded by external donors, government commissions (such as Chevening, DAAD, Commonwealth), or university scholarship panels.
              </p>
              <p>
                2. <strong>No Automatic Entitlement:</strong> Mere admission into an academic course does not ensure a scholarship award. Deadlines, quotas, and merit bars are strictly enforced by the granting bodies.
              </p>
              <p>
                3. <strong>Guidance Role:</strong> Our team assists students in identifying open funding rounds and drafting compelling scholarship essays, but does not exercise influence over award determinations.
              </p>
            </div>
          )}

          {topic === 'parent-notice' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs">
                <strong>Notice to Parents & Legal Guardians:</strong> We prioritize family financial security and student well-being above all commercial objectives.
              </div>
              <p>
                1. <strong>Under-18 Students:</strong> Any prospective student under the age of 18 years must have their parent or legal guardian present during counselling sessions and must obtain parental co-signature on all application declarations.
              </p>
              <p>
                2. <strong>Financial Transparency:</strong> We strongly urge parents to participate in budget estimations covering tuition, living expenses, flight costs, health insurance, and emergency contingency funds.
              </p>
              <p>
                3. <strong>Direct Communication:</strong> Parents are welcome to contact our counsellors directly at <strong>{settings.phone}</strong> or <strong>{settings.email}</strong> at any stage of the application or departure process.
              </p>
            </div>
          )}

          {topic === 'privacy' && (
            <div className="space-y-3">
              <p>
                <strong>Privacy Policy:</strong> Athmanathan Study Abroad respects student privacy. Any academic qualifications, contact numbers, email addresses, and passport details submitted through our contact forms or during counselling are used solely for university admissions evaluation and student visa guidance.
              </p>
              <p>
                We do not sell, rent, or trade your personal information to third-party marketing entities. Information is only shared with authorized university admissions bodies and our verified travel support partner Happy Journey Holidays upon your explicit consent.
              </p>
            </div>
          )}

          {topic === 'terms' && (
            <div className="space-y-3">
              <p>
                <strong>Terms of Engagement:</strong> By consulting with Athmanathan Study Abroad, students and parents acknowledge that education counselling is an advisory service. All tuition fee deposits, visa filing fees, and test registration fees are paid directly to the respective institutional authorities.
              </p>
              <p>
                Students must provide true, unaltered, and verifiable academic transcripts and financial records. Submission of falsified documentation is strictly prohibited and results in immediate termination of representation.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};
