import React, { useState, useEffect } from 'react';
import { fetchPublicData } from './api';
import { Country, Course, University, PublicBootstrapData } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EnquiryModal } from './components/EnquiryModal';
import { GuidanceToolModal } from './components/GuidanceToolModal';
import { CompareModal } from './components/CompareModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CountriesPage } from './pages/CountriesPage';
import { CoursesPage } from './pages/CoursesPage';
import { UniversitiesPage } from './pages/UniversitiesPage';
import { ServicesPage } from './pages/ServicesPage';
import { IeltsLanguagesPage } from './pages/IeltsLanguagesPage';
import { StudentEssentialsPage } from './pages/StudentEssentialsPage';
import { ScholarshipsPage } from './pages/ScholarshipsPage';
import { EsimPage } from './pages/EsimPage';
import { PostersPage } from './pages/PostersPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { IrsStudyAbroadPage } from './pages/IrsStudyAbroadPage';
import { LegalModal } from './pages/LegalModal';
import { AdminPortal } from './pages/AdminPortal';

const DEFAULT_FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230f172a'/%3E%3Ccircle cx='32' cy='32' r='22' fill='%231e3a8a'/%3E%3Cpath d='M32 16L16 26l16 10 16-10-16-10z' fill='%23f59e0b'/%3E%3Cpath d='M44 31v9c0 3-5.4 6-12 6s-12-3-12-6v-9' fill='none' stroke='%23f59e0b' stroke-width='2.5'/%3E%3Cpath d='M44 26v12' stroke='%23f59e0b' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E";

const ADMIN_FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%237f1d1d'/%3E%3Cpath d='M32 10L14 18v16c0 12 7.6 23.2 18 26 10.4-2.8 18-14 18-26V18L32 10z' fill='%23dc2626' stroke='%23fecaca' stroke-width='2'/%3E%3Ccircle cx='32' cy='28' r='5' fill='%23fef08a'/%3E%3Cpath d='M30 31h4v11h-4z' fill='%23fef08a'/%3E%3Ccircle cx='32' cy='39' r='2' fill='%237f1d1d'/%3E%3C/svg%3E";

export default function App() {
  const [data, setData] = useState<PublicBootstrapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Router state
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedUniId, setSelectedUniId] = useState<string | null>(null);

  // Modal triggers
  const [enquiryContext, setEnquiryContext] = useState<string | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareType, setCompareType] = useState<'countries' | 'courses' | 'universities'>('countries');
  const [legalTopic, setLegalTopic] = useState<string | null>(null);
  const [showAdminPortal, setShowAdminPortal] = useState(false);

  // Check if current URL is the admin route (/admin or /admin/irs normalized to /admin)
  const checkIsAdminPath = (): boolean => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.toLowerCase().replace(/^#/, '').replace(/\/+$/, '');
    if (path.startsWith('/admin/') || path === '/admin/irs') {
      window.history.replaceState(null, '', '/admin');
      return true;
    }
    return path === '/admin' || hash === 'admin';
  };

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdminPath);

  // Check URL pathname and hash for direct deep-linking (e.g. /admin, #courses, #countries)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase().replace(/^#/, '').replace(/\/+$/, '');

      // Normalize any legacy/extra admin paths such as /admin/irs to /admin
      if (path.startsWith('/admin/') || path === '/admin/irs') {
        window.history.replaceState(null, '', '/admin');
        setIsAdminRoute(true);
        setShowAdminPortal(true);
        return;
      }

      if (path === '/admin' || hash === 'admin') {
        setIsAdminRoute(true);
        setShowAdminPortal(true);
        return;
      }

      // Public site routes
      setIsAdminRoute(false);
      setShowAdminPortal(false);

      const cleanPath = path.replace(/^\//, '');
      const validPages = [
        'home',
        'about',
        'countries',
        'courses',
        'universities',
        'services',
        'ielts-languages',
        'student-essentials',
        'scholarships',
        'esims',
        'posters',
        'faqs',
        'contact',
        'irs',
      ];

      if (hash === 'irs' || hash === 'irs-study-abroad' || cleanPath === 'irs' || cleanPath === 'irs-study-abroad') {
        setActivePage('irs');
      } else if (validPages.includes(hash)) {
        setActivePage(hash);
      } else if (validPages.includes(cleanPath)) {
        setActivePage(cleanPath);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Secret shortcut for admin access: Ctrl + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.history.pushState(null, '', '/admin');
        setIsAdminRoute(true);
        setShowAdminPortal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Dynamically update favicon and document title when accessing /admin for security awareness
  useEffect(() => {
    const isSecuredAdmin = isAdminRoute || showAdminPortal;
    let faviconLink = document.getElementById('dynamic-favicon') as HTMLLinkElement | null;
    if (!faviconLink) {
      faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    }

    if (isSecuredAdmin) {
      document.title = '🔐 Admin Portal | Athmanathan Study Abroad';
      if (faviconLink) {
        faviconLink.href = ADMIN_FAVICON;
      }
    } else {
      document.title = 'ATHMANATHAN STUDY ABROAD | Your Dream. Our Guidance.';
      if (faviconLink) {
        faviconLink.href = DEFAULT_FAVICON;
      }
    }
  }, [isAdminRoute, showAdminPortal]);

  const loadData = async () => {
    try {
      const res = await fetchPublicData();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to data service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnquiry = (context?: string) => {
    setEnquiryContext(context || null);
    setShowEnquiryModal(true);
  };

  const handleOpenCompare = (type: 'countries' | 'courses' | 'universities' = 'countries') => {
    setCompareType(type);
    setShowCompareModal(true);
  };

  const handleExitAdmin = () => {
    setIsAdminRoute(false);
    setShowAdminPortal(false);
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/admin')) {
      window.history.pushState(null, '', '/');
    }
    if (window.location.hash.toLowerCase() === '#admin') {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  // Direct dedicated route for /admin (independent of public data bootstrap)
  if (isAdminRoute || showAdminPortal) {
    return (
      <AdminPortal
        onClose={handleExitAdmin}
        onDataRefresh={loadData}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white px-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-serif text-2xl font-bold mb-4 shadow-lg shadow-blue-500/20 animate-pulse">
          A
        </div>
        <h2 className="text-xl font-bold font-serif">ATHMANATHAN STUDY ABROAD</h2>
        <p className="text-xs text-blue-200 mt-1 font-medium">Your Dream. Our Guidance.</p>
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
          <span>Loading verified course & destination directories...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2 font-serif">Service Connection Error</h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            {error || 'Unable to retrieve university records. Please check the backend database.'}
          </p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              loadData();
            }}
            className="px-6 py-2.5 rounded-xl bg-blue-900 text-white font-semibold text-xs hover:bg-blue-800"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const {
    settings,
    countries,
    courses,
    universities,
    services,
    posters,
    testimonials,
    faqs,
    studentEssentials,
    scholarships,
    esimProducts,
  } = data;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Responsive Navigation Bar */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        settings={settings}
        onOpenEnquiry={() => handleOpenEnquiry('Top Navigation Bar')}
        onOpenGuidance={() => setShowGuidanceModal(true)}
      />

      {/* 3. Main Dynamic Page Body */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            data={data}
            onNavigate={handleNavigate}
            onOpenEnquiry={handleOpenEnquiry}
            onOpenGuidance={() => setShowGuidanceModal(true)}
            onSelectCountry={(id: string) => {
              setSelectedCountryId(id);
              handleNavigate('countries');
            }}
            onSelectCourse={(id: string) => {
              setSelectedCourseId(id);
              handleNavigate('courses');
            }}
            onSelectUniversity={(id: string) => {
              setSelectedUniId(id);
              handleNavigate('universities');
            }}
          />
        )}

        {activePage === 'about' && (
          <AboutPage
            settings={settings}
            onOpenEnquiry={handleOpenEnquiry}
            onOpenLegalModal={(topic: string) => setLegalTopic(topic)}
          />
        )}

        {activePage === 'countries' && (
          <CountriesPage
            countries={countries}
            settings={settings}
            selectedCountryId={selectedCountryId}
            onClearSelectedCountry={() => setSelectedCountryId(null)}
            onOpenEnquiry={handleOpenEnquiry}
            onOpenCompare={() => handleOpenCompare('countries')}
            onSelectCountry={(id: string) => {
              setSelectedCountryId(id);
            }}
          />
        )}

        {activePage === 'courses' && (
          <CoursesPage
            courses={courses}
            countries={countries}
            settings={settings}
            selectedCourseId={selectedCourseId}
            onClearSelectedCourse={() => setSelectedCourseId(null)}
            onOpenEnquiry={handleOpenEnquiry}
            onOpenCompare={() => handleOpenCompare('courses')}
          />
        )}

        {activePage === 'universities' && (
          <UniversitiesPage
            universities={universities}
            countries={countries}
            settings={settings}
            selectedUniId={selectedUniId}
            onClearSelectedUni={() => setSelectedUniId(null)}
            onOpenEnquiry={handleOpenEnquiry}
            onOpenCompare={() => handleOpenCompare('universities')}
          />
        )}

        {activePage === 'services' && (
          <ServicesPage
            services={services}
            settings={settings}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {activePage === 'ielts-languages' && (
          <IeltsLanguagesPage
            courses={courses}
            settings={settings}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {activePage === 'student-essentials' && (
          <StudentEssentialsPage
            essentials={studentEssentials}
            settings={settings}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {activePage === 'scholarships' && (
          <ScholarshipsPage
            scholarships={scholarships}
            countries={countries}
            settings={settings}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {activePage === 'esims' && (
          <EsimPage
            esimProducts={esimProducts}
            settings={settings}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {activePage === 'posters' && (
          <PostersPage
            posters={posters}
            settings={settings}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {activePage === 'faqs' && (
          <FaqPage
            faqs={faqs}
            settings={settings}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {activePage === 'contact' && (
          <ContactPage settings={settings} />
        )}

        {activePage === 'irs' && (
          <IrsStudyAbroadPage
            settings={settings}
            countries={countries}
            courses={courses}
            universities={universities}
            onOpenEnquiry={handleOpenEnquiry}
            onNavigate={handleNavigate}
            onSelectCountry={(id: string) => {
              setSelectedCountryId(id);
              handleNavigate('countries');
            }}
            onSelectCourse={(id: string) => {
              setSelectedCourseId(id);
              handleNavigate('courses');
            }}
            onSelectUniversity={(id: string) => {
              setSelectedUniId(id);
              handleNavigate('universities');
            }}
          />
        )}
      </main>

      {/* 4. Footer with Mandatory Travel Partner (Happy Journey Holidays) & Transparency Links */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenLegalModal={(topic: string) => setLegalTopic(topic)}
        onOpenEnquiry={() => handleOpenEnquiry('Footer')}
      />

      {/* 6. Profile Assessment / Application Modal */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        context={enquiryContext}
        settings={settings}
      />

      {/* 7. Interactive Profile Evaluator & Suggestion Tool */}
      <GuidanceToolModal
        isOpen={showGuidanceModal}
        onClose={() => setShowGuidanceModal(false)}
        settings={settings}
        countries={countries}
        courses={courses}
        onSelectCountry={(cId: string) => {
          setSelectedCountryId(cId);
          handleNavigate('countries');
        }}
        onSelectCourse={(crsId: string) => {
          setSelectedCourseId(crsId);
          handleNavigate('courses');
        }}
        onOpenEnquiry={handleOpenEnquiry}
      />

      {/* 8. Side-by-Side Comparison Tool */}
      <CompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        countries={countries}
        courses={courses}
        universities={universities}
        initialType={compareType}
        onOpenEnquiry={handleOpenEnquiry}
      />

      {/* 9. Regulatory & Legal Transparency Modal */}
      <LegalModal
        isOpen={legalTopic !== null}
        topic={legalTopic}
        onClose={() => setLegalTopic(null)}
        settings={settings}
      />
    </div>
  );
}
