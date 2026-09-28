import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Facebook,
  Instagram,
  Globe,
} from 'lucide-react';
import { SiteSettings } from '../types';
import { submitEnquiry, buildWhatsAppLink } from '../api';

interface ContactPageProps {
  settings: SiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappMobile: '',
    email: '',
    highestQualification: '',
    preferredCountry: 'United Kingdom',
    preferredCourse: '',
    preferredIntake: 'September 2026',
    englishTestStatus: 'Planning to Take IELTS / PTE',
    workExperience: 'None / Fresher',
    passportStatus: 'Available (Valid)',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.whatsappMobile.trim()) {
      setError('Please provide your Full Name and WhatsApp / Mobile Number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await submitEnquiry({
        ...formData,
        sourcePage: 'Contact Us Page Form',
      });
      setSuccess(res.message);
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry.');
    } finally {
      setLoading(false);
    }
  };

  const directWa = buildWhatsAppLink(
    'Hello Athmanathan Study Abroad, I am on your Contact Us page and would like to schedule a face-to-face / online counselling session.',
    settings.whatsapp
  );

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-serif">
            Contact Athmanathan Study Abroad
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Reach out for transparent, personalised profile assessment, university shortlisting, and visa support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Details & Office Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                Direct Contact Points
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Phone Support</span>
                    <a
                      href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-slate-600 hover:text-blue-900"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Direct WhatsApp</span>
                    <a
                      href={directWa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 font-medium"
                    >
                      {settings.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Official Email</span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-slate-600 hover:text-blue-900 break-all"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Office Address</span>
                    <p className="text-slate-600 leading-relaxed">{settings.address}</p>
                    <a
                      href={settings.googleMapsUrl || 'https://maps.app.goo.gl/pvmJsk8P65znkmt46?g_st=awb'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-xs font-bold text-emerald-800 border border-emerald-200 hover:bg-emerald-100 hover:text-emerald-900 transition-colors mt-2"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Get Directions on Google Maps</span>
                      <ExternalLink className="w-3 h-3 text-emerald-600" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Office Hours</span>
                    <p className="text-slate-600">{settings.workingHours}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href={directWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start WhatsApp Chat Now</span>
                </a>
              </div>

              {/* Verified Google Profile & Social Channels */}
              <div className="pt-5 border-t border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Verified Google Profile & Socials</span>
                </h4>

                {/* Google Business Profile Card */}
                <a
                  href={settings.googleProfileUrl || 'https://share.google/s1ZUKgcqlCbMBB2zN'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 border border-blue-200/80 hover:border-blue-400 hover:shadow-sm transition-all block group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        G
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-900 block">
                          ATHMANATHAN STUDY ABROAD
                        </span>
                        <span className="text-[11px] text-blue-700 font-medium">Official Google Profile & Reviews</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </a>

                {/* Google Maps, Facebook & Instagram Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <a
                    href={settings.googleMapsUrl || 'https://maps.app.goo.gl/pvmJsk8P65znkmt46?g_st=awb'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all group"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Maps Pin</span>
                    <ExternalLink className="w-3 h-3 text-emerald-600" />
                  </a>
                  <a
                    href={settings.facebookUrl || 'https://www.facebook.com/share/1HcacNz8FK/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 text-xs font-semibold transition-all group"
                  >
                    <Facebook className="w-3.5 h-3.5 text-blue-600" />
                    <span>Facebook</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                  </a>
                  <a
                    href={settings.instagramUrl || 'https://www.instagram.com/athmanathanstudyabroad?utm_source=qr&stkn=bnFlajMyaHFpN2Z1'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-pink-50 text-slate-700 hover:text-pink-700 border border-slate-200 hover:border-pink-300 text-xs font-semibold transition-all group"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-pink-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 font-serif mb-1">
                Send Us an Enquiry / Profile Review
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                All details are stored directly in our database and our counsellors respond promptly.
              </p>

              {success ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Enquiry Submitted!</h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">{success}</p>
                  <div className="pt-4">
                    <a
                      href={directWa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Follow Up on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Anand R"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        WhatsApp / Mobile <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="whatsappMobile"
                        required
                        value={formData.whatsappMobile}
                        onChange={handleChange}
                        placeholder="+91 98401 23456"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="student@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Current Qualification
                      </label>
                      <input
                        type="text"
                        name="highestQualification"
                        value={formData.highestQualification}
                        onChange={handleChange}
                        placeholder="e.g. B.Com / B.E (75%)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Preferred Country
                      </label>
                      <select
                        name="preferredCountry"
                        value={formData.preferredCountry}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                      >
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ireland">Ireland</option>
                        <option value="France">France</option>
                        <option value="Singapore">Singapore</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="UAE">United Arab Emirates</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Preferred Intake
                      </label>
                      <select
                        name="preferredIntake"
                        value={formData.preferredIntake}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                      >
                        <option value="September 2026">September 2026 (Major)</option>
                        <option value="January 2027">January 2027</option>
                        <option value="2027 Onwards">2027 Onwards</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Message / Questions
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about the courses you wish to pursue or questions you have..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? 'Submitting...' : 'Submit Profile for Assessment'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
