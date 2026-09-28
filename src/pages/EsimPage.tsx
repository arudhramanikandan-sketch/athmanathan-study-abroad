import React, { useState } from 'react';
import {
  Wifi,
  QrCode,
  Smartphone,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  Zap,
  ShieldCheck,
  Clock,
  Tag,
  ArrowRight,
  ExternalLink,
  Globe,
  ShoppingBag,
} from 'lucide-react';
import { EsimProduct, SiteSettings } from '../types';
import { buildWhatsAppLink } from '../api';

interface EsimPageProps {
  esimProducts: EsimProduct[];
  settings: SiteSettings;
  onOpenEnquiry: (context?: string) => void;
}

export const formatEsimPrice = (plan: any): { display: string; numeric: number } => {
  const val = plan?.priceInr ?? plan?.price ?? plan?.price_inr ?? plan?.amount ?? plan?.cost;
  const num = typeof val === 'number' ? val : parseFloat(String(val || '').replace(/[^0-9.]/g, ''));
  if (!isNaN(num) && num > 0) {
    return { display: `₹${num.toLocaleString('en-IN')}`, numeric: num };
  }
  if (typeof val === 'string' && val.trim()) {
    return { display: val.startsWith('₹') ? val : `₹${val}`, numeric: 0 };
  }
  return { display: '₹1,450', numeric: 1450 };
};

export const EsimPage: React.FC<EsimPageProps> = ({
  esimProducts,
  settings,
  onOpenEnquiry,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<EsimProduct | null>(
    esimProducts.length > 0 ? esimProducts[0] : null
  );

  const airaloPartnerUrl =
    settings.esimPurchaseUrl || 'https://discover.airalo.com/happyjourneyholidays/';

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          {/* Starting Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-900 text-xs sm:text-sm font-bold mb-3 shadow-2xs">
            <Globe className="w-4 h-4 text-teal-600" />
            <span>Official Airalo eSIM Store Partner • 200+ Destinations</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-serif">
            International Student eSIMs
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Land abroad with instant 5G/4G internet connectivity. Zero physical SIM swaps, no exorbitant roaming charges, and keep your Indian WhatsApp number active.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Online Purchase via Airalo</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Digital QR Code Delivery</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero Bill Shock / Keep Indian WhatsApp Number</span>
            </span>
          </div>

          {/* Official Airalo Partner Store Banner */}
          <div className="mt-8 bg-linear-to-r from-blue-950 via-slate-900 to-teal-950 rounded-2xl p-5 text-white border border-teal-500/30 shadow-lg text-left flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0 text-teal-300">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950 font-sans">
                    Official eSIM Partner
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Happy Journey Holidays on Airalo
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1 font-serif">
                  Buy Online with Instant QR Code via Airalo
                </h3>
                <p className="text-xs text-slate-300 leading-snug mt-0.5">
                  Direct purchase for 200+ countries with instant digital delivery before departure.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
              <a
                href={airaloPartnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto px-5 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
              >
                <ShoppingBag className="w-4 h-4 text-slate-950" />
                <span>Buy eSIM on Airalo Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Value Prop Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <QrCode className="w-8 h-8 text-blue-700 mb-3" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">Instant QR Delivery</h4>
            <p className="text-xs text-slate-600">
              Receive your eSIM activation QR code via WhatsApp & email before you board your flight in India.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <MessageCircle className="w-8 h-8 text-emerald-600 mb-3" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">Keep Indian WhatsApp</h4>
            <p className="text-xs text-slate-600">
              Your Indian WhatsApp account and chat history remain 100% active while using international data.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <Zap className="w-8 h-8 text-amber-500 mb-3" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">High-Speed 5G / 4G</h4>
            <p className="text-xs text-slate-600">
              Connect to top tier local carriers (Vodafone, EE, AT&T, Deutsche Telekom, Optus) upon landing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <ShieldCheck className="w-8 h-8 text-indigo-700 mb-3" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">Fixed Prepaid Pricing</h4>
            <p className="text-xs text-slate-600">
              Clear upfront prepaid packages. Zero recurring fees or unexpected international credit card auto-charges.
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="space-y-12">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-serif">
                  Select Your Destination eSIM Plan
                </h2>
                <p className="text-xs text-slate-500">
                  Select your study destination to view official prepaid data quotas, validity periods, and verified INR pricing.
                </p>
              </div>
              <span className="text-xs text-slate-500 bg-slate-200/70 px-3 py-1 rounded-full font-medium self-start sm:self-auto">
                {esimProducts.length} Country Packages Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {esimProducts.map((p) => {
                const planPrices = (p.plans || []).map((pl) => formatEsimPrice(pl).numeric).filter((n) => n > 0);
                const minPrice = planPrices.length > 0 ? Math.min(...planPrices) : 1450;
                const minPriceFormatted = `₹${minPrice.toLocaleString('en-IN')}`;

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Destination Header with Partner Tag */}
                      <div className="flex items-start justify-between gap-3 mb-4 pb-3.5 border-b border-slate-100">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-3xl shrink-0">{p.flag}</span>
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif leading-snug truncate">
                              {p.destination}
                            </h3>
                            <span className="text-[11px] font-semibold text-teal-700 block">
                              5G / 4G High Speed
                            </span>
                          </div>
                        </div>

                        {/* Partner Store Badge */}
                        <div className="bg-teal-50 border border-teal-200/80 px-2.5 py-1 rounded-xl text-right shrink-0 shadow-2xs">
                          <span className="text-[9px] uppercase font-bold text-teal-700 block leading-tight">
                            Airalo Store
                          </span>
                          <span className="text-xs font-bold text-teal-950 block leading-tight mt-0.5">
                            Instant QR
                          </span>
                        </div>
                      </div>

                      {/* Available Packages */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-teal-600" />
                            <span>Available Plans:</span>
                          </span>
                          <span className="text-[10px] text-teal-700 font-semibold uppercase bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            Instant Digital QR
                          </span>
                        </div>

                        {p.plans.map((plan) => {
                          return (
                            <div
                              key={plan.id}
                              className="p-3.5 rounded-xl bg-slate-50/90 hover:bg-teal-50/40 border border-slate-200/90 hover:border-teal-300 transition-all space-y-2.5"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span className="font-bold text-slate-900 text-sm block leading-snug">
                                    {plan.dataAmount}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded-md mt-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Validity: {plan.validity}</span>
                                  </span>
                                </div>
                              </div>

                              {plan.description && (
                                <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                                  {plan.description}
                                </p>
                              )}

                              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/50">
                                <button
                                  type="button"
                                  onClick={() => onOpenEnquiry(`eSIM: ${p.destination} - ${plan.dataAmount}`)}
                                  className="text-[11px] font-semibold text-slate-600 hover:text-blue-700 underline underline-offset-2 cursor-pointer"
                                >
                                  Enquire
                                </button>
                                <div className="flex items-center gap-1.5">
                                  <a
                                    href={airaloPartnerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold shadow-xs transition-colors"
                                    title="Buy online on official Airalo partner portal"
                                  >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    <span>Buy Online</span>
                                    <ExternalLink className="w-3 h-3 text-slate-800" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Features Bullet List */}
                      <div className="space-y-1.5 pt-3 border-t border-slate-100">
                        {p.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          selectedProduct?.id === p.id
                            ? 'bg-blue-900 text-white shadow-xs'
                            : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                        }`}
                      >
                        <span>Setup Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={airaloPartnerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0"
                        title="Open Airalo partner store"
                      >
                        <span>Airalo Store</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Installation & Compatibility Guide Component */}
          {selectedProduct && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
                    Destination Setup & Verified Pricing
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
                    <span>{selectedProduct.flag}</span>
                    <span>{selectedProduct.destination} eSIM Packages</span>
                  </h3>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={airaloPartnerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-extrabold transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-slate-950" />
                    <span>Buy on Airalo Store</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={buildWhatsAppLink(
                      `Hello Athmanathan Study Abroad, I would like to order the ${selectedProduct.destination} eSIM. Please share payment QR and activation details.`,
                      settings.whatsapp
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Booking</span>
                  </a>
                  <button
                    onClick={() => onOpenEnquiry(`eSIM: ${selectedProduct.destination}`)}
                    className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Enquiry Form
                  </button>
                </div>
              </div>

              {/* Complete Plans Summary Grid in Guide */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-blue-700" />
                  <span>Available Plans for {selectedProduct.destination}:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedProduct.plans.map((pl) => {
                    return (
                      <div
                        key={pl.id}
                        className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/90 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-bold text-slate-900 text-sm">{pl.dataAmount}</span>
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold shrink-0">
                              {pl.validity}
                            </span>
                          </div>
                          {pl.description && (
                            <p className="text-xs text-slate-600 leading-relaxed mb-3">
                              {pl.description}
                            </p>
                          )}
                        </div>
                        <div className="pt-3 border-t border-blue-200/60 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenEnquiry(`eSIM: ${selectedProduct.destination} - ${pl.dataAmount}`)}
                            className="text-[11px] font-semibold text-slate-600 hover:text-blue-700 underline underline-offset-2 cursor-pointer"
                          >
                            Enquire
                          </button>
                          <a
                            href={airaloPartnerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold shadow-xs transition-colors inline-flex items-center gap-1"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Buy on Airalo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-3">
                    3-Step Installation:
                  </h4>
                  <div className="space-y-4 text-xs text-slate-700">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <strong>Before Flying:</strong> Go to Settings → Mobile Data → Add eSIM. Scan the QR code sent by our team over Wi-Fi.
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <strong>Label the eSIM:</strong> Name it "Travel" or "Study". Ensure Data Roaming is turned OFF until you arrive abroad.
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <strong>Upon Landing:</strong> Turn ON Data Roaming on this eSIM line and select it as your Mobile Data line. You are instantly connected!
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-3">
                    Device Compatibility List:
                  </h4>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                    <p>
                      <strong>Apple:</strong> iPhone XS, XR, 11, 12, 13, 14, 15, 16 series and SE (2nd/3rd Gen).
                    </p>
                    <p>
                      <strong>Samsung:</strong> Galaxy S20, S21, S22, S23, S24 series, Z Flip, Z Fold series.
                    </p>
                    <p>
                      <strong>Google:</strong> Pixel 3, 4, 5, 6, 7, 8, 9 series.
                    </p>
                    <p className="text-[11px] text-slate-500 pt-1">
                      Check your device by dialing <strong>*#06#</strong>. If an EID number appears, your phone supports eSIM.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Global Coverage & Airalo Store Callout Banner */}
          <div className="mt-12 rounded-3xl bg-linear-to-br from-slate-900 via-blue-950 to-teal-950 p-6 sm:p-10 border border-teal-500/30 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/30 text-teal-300 text-xs font-bold">
                <Globe className="w-3.5 h-3.5" />
                <span>200+ Destinations Covered Globally</span>
              </div>
              <h3 className="text-2xl font-bold font-serif">
                Traveling to Another Country or Multi-Country Route?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Our official partner portal powered by <strong>Airalo & Happy Journey Holidays</strong> provides instant digital eSIM packages for over 200 countries worldwide. Choose regional or global data plans with instant QR setup.
              </p>
              <div className="text-xs text-teal-300 font-mono pt-1">
                Official Store: discover.airalo.com/happyjourneyholidays
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <a
                href={airaloPartnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-105 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-slate-950" />
                <span>Explore 200+ Countries on Airalo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
