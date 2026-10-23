import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header, BRAND_LOGO_URL } from './components/Header';
import { MedicalDisclaimerFooter } from './components/MedicalDisclaimerFooter';
import { EmergencyChecklistModal } from './components/EmergencyChecklistModal';
import { HomePage } from './pages/HomePage';
import { SymptomCheckerPage } from './pages/SymptomCheckerPage';
import { SkinDetectionPage } from './pages/SkinDetectionPage';
import { DemoCasesPage } from './pages/DemoCasesPage';
import { AboutPage } from './pages/AboutPage';
import { DrFizzaPage } from './pages/DrFizzaPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { HealthSafetyPage } from './pages/HealthSafetyPage';
import { ContactPage } from './pages/ContactPage';
import { AnalysisResultsPage } from './pages/AnalysisResultsPage';
import { DemoCase, SymptomReport, SkinReport } from './types/health';
import { AIDoctorConsultation } from './components/AIDoctorConsultation';
import { ShieldAlert, Sun, Moon, Stethoscope, X, Maximize2 } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  home: 'DermaDetect AI — Caring Skin & Symptom Companion',
  symptoms: 'AI Symptom Checker | DermaDetect AI',
  skin: 'AI Skin Analysis | DermaDetect AI',
  about: 'About DermaDetect AI — Caring Skin & Symptom Companion',
  safety: 'Health Information & Safety | DermaDetect AI',
  privacy: 'Privacy Policy | DermaDetect AI',
  contact: 'Contact Us | DermaDetect AI',
  results: 'Analysis Results | DermaDetect AI',
  doctor: 'Dr. Fizza (AI MD) Consultation | DermaDetect AI',
  demo: 'Standardized Sample Cases | DermaDetect AI',
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);

  // Shared latest analysis reports for the dedicated Analysis Results page
  const [latestSymptomReport, setLatestSymptomReport] = useState<SymptomReport | null>(null);
  const [latestSkinReport, setLatestSkinReport] = useState<SkinReport | null>(null);
  const [latestSkinImage, setLatestSkinImage] = useState<string | null>(null);

  // States when loading a sample case into the live scanners
  const [prefilledSkinImage, setPrefilledSkinImage] = useState<string | undefined>(undefined);
  const [prefilledSkinNotes, setPrefilledSkinNotes] = useState<string>('');
  const [prefilledSkinDuration, setPrefilledSkinDuration] = useState<string>('');

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.title = PAGE_TITLES[currentTab] || 'DermaDetect AI — Caring Skin & Symptom Companion';
    const iconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
    iconLinks.forEach((link) => {
      if (link.getAttribute('href') !== BRAND_LOGO_URL) {
        link.setAttribute('href', BRAND_LOGO_URL);
      }
    });
  }, [currentTab]);

  const handleNavigate = (tab: string) => {
    if (tab === 'home-check') {
      setCurrentTab('home');
      setTimeout(() => {
        const el = document.getElementById('free-check');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
      return;
    }

    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadIntoScanner = (demoCase: DemoCase) => {
    if (demoCase.type === 'skin') {
      setPrefilledSkinImage(demoCase.image);
      setPrefilledSkinNotes(demoCase.formData.notes || '');
      setPrefilledSkinDuration(demoCase.formData.duration || '');
      setCurrentTab('skin');
    } else {
      setCurrentTab('symptoms');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC] text-[#253746] font-sans transition-colors duration-200">
      {/* Responsive Navigation Bar (Logo + DermaDetect AI, Home, Symptom Checker, Skin Analysis, About, Start Free Assessment) */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
      />

      {/* Centered Contextual Secondary Sub-Navigation Bar for All Pages & Utilities */}
      <div className="bg-white border-b border-[#E2E8F0] py-2.5 px-4 sm:px-6 lg:px-8 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            {[
              { id: 'results', label: 'Analysis Results' },
              { id: 'safety', label: 'Health Information & Safety' },
              { id: 'privacy', label: 'Privacy Policy' },
              { id: 'contact', label: 'Contact' },
              { id: 'doctor', label: 'Dr. Fizza (AI MD)' },
              { id: 'demo', label: 'Sample Cases' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                  currentTab === item.id
                    ? 'bg-[#E9F7F5] text-[#153B50] font-bold shadow-2xs'
                    : 'text-[#687986] hover:text-[#153B50] hover:bg-[#F7FAFC]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsDarkMode((prev) => !prev)}
              className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[#253746] hover:border-[#249A96] font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              aria-label="Toggle light and dark theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-[#E7A23B]" /> : <Moon className="w-3.5 h-3.5 text-[#153B50]" />}
              <span>{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#C83F49]/10 text-[#C83F49] font-semibold flex items-center gap-1 hover:bg-[#C83F49]/15 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Emergency Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Animated Page Router with Smooth Motion Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {currentTab === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
                onSaveSymptomReport={(rep) => setLatestSymptomReport(rep)}
                onSaveSkinReport={(rep, img) => {
                  setLatestSkinReport(rep);
                  if (img) setLatestSkinImage(img);
                }}
              />
            )}

            {currentTab === 'symptoms' && (
              <SymptomCheckerPage
                onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
                onSaveSymptomReport={(rep) => setLatestSymptomReport(rep)}
              />
            )}

            {currentTab === 'skin' && (
              <SkinDetectionPage
                key={prefilledSkinImage || 'skin-fresh'}
                onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
                initialImageData={prefilledSkinImage}
                initialNotes={prefilledSkinNotes}
                initialDuration={prefilledSkinDuration}
                onSaveSkinReport={(rep, img) => {
                  setLatestSkinReport(rep);
                  if (img) setLatestSkinImage(img);
                }}
              />
            )}

            {currentTab === 'about' && <AboutPage />}

            {currentTab === 'safety' && (
              <HealthSafetyPage
                onNavigate={handleNavigate}
                onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
              />
            )}

            {currentTab === 'privacy' && <PrivacyPage />}

            {currentTab === 'contact' && (
              <ContactPage onNavigate={handleNavigate} />
            )}

            {currentTab === 'results' && (
              <AnalysisResultsPage
                latestSymptomReport={latestSymptomReport}
                latestSkinReport={latestSkinReport}
                latestSkinImage={latestSkinImage}
                onNavigate={handleNavigate}
              />
            )}

            {currentTab === 'doctor' && (
              <DrFizzaPage
                latestSymptomReport={latestSymptomReport}
                latestSkinReport={latestSkinReport}
              />
            )}

            {currentTab === 'demo' && (
              <DemoCasesPage onLoadIntoScanner={handleLoadIntoScanner} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Medical Disclaimer & Navigation Footer */}
      <MedicalDisclaimerFooter onNavigate={handleNavigate} />

      {/* Floating Dr. Fizza (AI MD) Quick Consultation Widget (Available across all pages) */}
      {currentTab !== 'doctor' && (
        <div className="fixed bottom-5 right-5 z-40 no-print">
          {!isChatDrawerOpen ? (
            <button
              type="button"
              onClick={() => setIsChatDrawerOpen(true)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#153B50] hover:bg-[#1d4c66] text-white shadow-lg border border-[#249A96]/40 transition-all cursor-pointer group"
              aria-label="Open Dr. Fizza AI Consultation Chatbot"
            >
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#249A96] text-white">
                <Stethoscope className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#153B50]" />
              </div>
              <div className="text-left pr-1">
                <div className="text-xs font-extrabold tracking-tight text-white leading-tight">
                  Ask Dr. Fizza, MD
                </div>
                <div className="text-[11px] text-[#E9F7F5] leading-tight">
                  AI Clinical Chatbot • Online
                </div>
              </div>
            </button>
          ) : (
            <div className="w-[92vw] sm:w-[540px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-[#DCE6ED] flex flex-col overflow-hidden">
              <div className="bg-[#153B50] text-white px-4 py-3 flex items-center justify-between border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#249A96] flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold tracking-tight">
                    Dr. Fizza, MD — Quick Clinical Chat
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChatDrawerOpen(false);
                      handleNavigate('doctor');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white flex items-center gap-1 transition-colors cursor-pointer"
                    title="Open Full Consultation View"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Full View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChatDrawerOpen(false)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label="Close Dr. Fizza Chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto max-h-[76vh]">
                <AIDoctorConsultation
                  reportContext={latestSkinReport || latestSymptomReport || undefined}
                  reportType={latestSkinReport ? 'skin' : 'symptom'}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Emergency Warning Signs Checklist Modal */}
      <EmergencyChecklistModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
}
