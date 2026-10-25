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
import { ShieldAlert, Stethoscope, X, Maximize2 } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  home:     'DermaDetect AI — Smarter Health Insights',
  symptoms: 'AI Symptom Checker | DermaDetect AI',
  skin:     'AI Skin Analysis | DermaDetect AI',
  about:    'About DermaDetect AI',
  safety:   'Health Information & Safety | DermaDetect AI',
  privacy:  'Privacy Policy | DermaDetect AI',
  contact:  'Contact Us | DermaDetect AI',
  results:  'Analysis Results | DermaDetect AI',
  doctor:   'Dr. Fizza (AI MD) Consultation | DermaDetect AI',
  demo:     'Standardized Sample Cases | DermaDetect AI',
};

const secondaryNavItems = [
  { id: 'results', label: 'My Results' },
  { id: 'safety',  label: 'Health & Safety' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'contact', label: 'Contact' },
  { id: 'doctor',  label: 'Dr. Fizza (AI MD)' },
  { id: 'demo',    label: 'Sample Cases' },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);

  const [latestSymptomReport, setLatestSymptomReport] = useState<SymptomReport | null>(null);
  const [latestSkinReport, setLatestSkinReport] = useState<SkinReport | null>(null);
  const [latestSkinImage, setLatestSkinImage] = useState<string | null>(null);

  const [prefilledSkinImage, setPrefilledSkinImage] = useState<string | undefined>(undefined);
  const [prefilledSkinNotes, setPrefilledSkinNotes] = useState<string>('');
  const [prefilledSkinDuration, setPrefilledSkinDuration] = useState<string>('');

  useEffect(() => {
    document.title = PAGE_TITLES[currentTab] || 'DermaDetect AI — Smarter Health Insights';
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
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    <div className="min-h-screen flex flex-col bg-white text-[#17253B] font-sans transition-colors duration-200">

      {/* ── Primary Navbar ── */}
      <Header currentTab={currentTab} onNavigate={handleNavigate} />

      {/* ── Secondary Utility Bar ── */}
      <div className="bg-[#F7FAFF] border-b border-[#E7EDF5] py-2 px-4 sm:px-6 lg:px-8 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-2">

          {/* Secondary links */}
          <div className="flex flex-wrap items-center justify-center gap-0.5">
            {secondaryNavItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  currentTab === item.id
                    ? 'bg-[#EAF2FF] text-[#2458F5] font-semibold'
                    : 'text-[#64748B] hover:text-[#10264D] hover:bg-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Utility buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-red-100 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Emergency Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Page Content ── */}
      <main className="flex-1 bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
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

            {currentTab === 'about'   && <AboutPage />}
            {currentTab === 'safety'  && (
              <HealthSafetyPage
                onNavigate={handleNavigate}
                onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
              />
            )}
            {currentTab === 'privacy' && <PrivacyPage />}
            {currentTab === 'contact' && <ContactPage onNavigate={handleNavigate} />}

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

      {/* ── Footer ── */}
      <MedicalDisclaimerFooter onNavigate={handleNavigate} />

      {/* ── Floating Dr. Fizza Chat Widget ── */}
      {currentTab !== 'doctor' && (
        <div className="fixed bottom-5 right-5 z-40 no-print">
          {!isChatDrawerOpen ? (
            <motion.button
              type="button"
              onClick={() => setIsChatDrawerOpen(true)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, type: 'spring', stiffness: 400, damping: 25 }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#10264D] hover:bg-[#0c1e3d] text-white shadow-xl border border-[#2458F5]/30 transition-all cursor-pointer group"
              aria-label="Open Dr. Fizza AI Consultation"
            >
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#2458F5] text-white">
                <Stethoscope className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#10264D]" />
              </div>
              <div className="text-left pr-1">
                <div className="text-xs font-extrabold tracking-tight text-white leading-tight">
                  Ask Dr. Fizza, MD
                </div>
                <div className="text-[11px] text-[#EAF2FF] leading-tight">
                  AI Clinical Educator · Online
                </div>
              </div>
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1,   opacity: 1, y: 0 }}
              exit={{   scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-[92vw] sm:w-[540px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-[#E7EDF5] flex flex-col overflow-hidden"
            >
              <div className="bg-[#10264D] text-white px-4 py-3 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#2458F5] flex items-center justify-center">
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
            </motion.div>
          )}
        </div>
      )}

      {/* ── Emergency Modal ── */}
      <EmergencyChecklistModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
}
