import React, { useState } from 'react';
import {
  Stethoscope,
  Camera,
  Sparkles,
  User,
  HeartPulse,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import { DEMO_CASES } from '../data/sampleCases';
import { SymptomReport, SkinReport, ReportIntakeContext } from '../types/health';
import { MedicalButton } from '../components/ui/MedicalUI';
import { ProfessionalMedicalReport } from '../components/ProfessionalMedicalReport';

interface AnalysisResultsPageProps {
  latestSymptomReport?: SymptomReport | null;
  latestSkinReport?: SkinReport | null;
  latestSkinImage?: string | null;
  latestIntakeContext?: ReportIntakeContext | null;
  onNavigate: (tab: string) => void;
}

export const AnalysisResultsPage: React.FC<AnalysisResultsPageProps> = ({
  latestSymptomReport,
  latestSkinReport,
  latestSkinImage,
  latestIntakeContext,
  onNavigate,
}) => {
  const hasLatestLiveReport = Boolean(latestSymptomReport || latestSkinReport);
  const [selectedSource, setSelectedSource] = useState<'live' | number>(
    hasLatestLiveReport ? 'live' : 0
  );

  const currentCase =
    typeof selectedSource === 'number' ? DEMO_CASES[selectedSource] : DEMO_CASES[0];

  const livePatientName =
    latestIntakeContext?.patientName ||
    latestSkinReport?.patientName ||
    latestSymptomReport?.patientName ||
    'Anonymous Patient';
  const livePatientAge =
    latestIntakeContext?.patientAge ||
    latestSkinReport?.patientAge ||
    latestSymptomReport?.patientAge ||
    latestIntakeContext?.ageGroup ||
    'Adult';
  const livePatientGender =
    latestIntakeContext?.patientGender ||
    latestSkinReport?.patientGender ||
    latestSymptomReport?.patientGender ||
    'Not Specified';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DCE6ED] pb-8"
      >
        <div className="max-w-2xl space-y-3 text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#249A96]">
            <Sparkles className="w-3.5 h-3.5 text-[#249A96]" />
            <span>AI-Generated Clinical Report Explorer · 12-Section Structure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#153B50] tracking-tight font-display">
            Analysis Results & Clinical Reports
          </h1>
          <p className="text-base text-[#687986] leading-relaxed">
            Review and export your 12-section health report as a formatted PDF, HTML, or plain-text summary—complete with patient details, symptoms, recovery guidance, and warning signs.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <MedicalButton
            variant="teal"
            size="md"
            onClick={() => onNavigate('symptoms')}
            icon={<Stethoscope className="w-4 h-4" />}
          >
            New Symptom Check
          </MedicalButton>
          <MedicalButton
            variant="navy"
            size="md"
            onClick={() => onNavigate('skin')}
            icon={<Camera className="w-4 h-4 text-[#E9F7F5]" />}
          >
            New Skin Analysis
          </MedicalButton>
        </div>
      </motion.div>

      {/* Visual System Legend Bar: Consistent Icon Set for Symptoms, Recovery & Warnings */}
      <div className="bg-white border border-[#DCE6ED] rounded-2xl p-4 sm:px-6 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-[#153B50] block font-display">AI-Generated Badge</strong>
            <span className="text-[#687986]">Non-diagnostic clinical synthesis</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center shrink-0">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-[#153B50] block font-display">Symptoms & Features</strong>
            <span className="text-[#687986]">Reported vs. visible findings</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center shrink-0">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-[#153B50] block font-display">Recovery & Self-Care</strong>
            <span className="text-[#687986]">Evidence-based comfort steps</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#C83F49] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-[#153B50] block font-display">Warnings & Red Flags</strong>
            <span className="text-[#687986]">Cautions & urgent care signs</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Live Session & Sample Report Selector */}
        <div className="lg:col-span-4 space-y-3">
          {hasLatestLiveReport && (
            <div className="space-y-2 pb-3 border-b border-[#DCE6ED]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#249A96] px-1">
                Your Recent Session Report
              </h2>
              <button
                type="button"
                onClick={() => setSelectedSource('live')}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedSource === 'live'
                    ? 'bg-[#153B50] border-[#153B50] text-white shadow-xs'
                    : 'bg-white border-[#249A96] text-[#253746] hover:bg-[#E9F7F5]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] font-semibold">
                  <span
                    className={`inline-flex items-center gap-1 ${
                      selectedSource === 'live' ? 'text-[#E9F7F5]' : 'text-[#249A96]'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Live AI-Generated Assessment</span>
                  </span>
                </div>
                <h3
                  className={`font-bold text-base font-display ${
                    selectedSource === 'live' ? 'text-white' : 'text-[#153B50]'
                  }`}
                >
                  {latestSkinReport ? 'Latest Skin Analysis Report' : 'Latest Symptom Report'}
                </h3>
                <div
                  className={`mt-2 pt-2 border-t text-xs flex items-center gap-2 ${
                    selectedSource === 'live'
                      ? 'border-white/15 text-slate-200'
                      : 'border-[#DCE6ED] text-[#687986]'
                  }`}
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {livePatientName} · {livePatientAge} · {livePatientGender}
                  </span>
                </div>
              </button>
            </div>
          )}

          <h2 className="text-xs font-bold uppercase tracking-wider text-[#687986] px-1">
            Select a Sample Clinical Report
          </h2>
          {DEMO_CASES.map((item, idx) => {
            const isSelected = selectedSource === idx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedSource(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#153B50] border-[#153B50] text-white shadow-xs'
                    : 'bg-white border-[#DCE6ED] text-[#253746] hover:border-[#249A96]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] font-semibold">
                  <span
                    className={`inline-flex items-center gap-1 ${
                      isSelected ? 'text-[#E9F7F5]' : 'text-[#249A96]'
                    }`}
                  >
                    {item.type === 'skin' ? (
                      <Camera className="w-3 h-3" />
                    ) : (
                      <Stethoscope className="w-3 h-3" />
                    )}
                    <span>{item.type === 'skin' ? 'Skin Analysis' : 'Symptom Triage'}</span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 ${
                      isSelected ? 'text-slate-300' : 'text-[#687986]'
                    }`}
                  >
                    {item.urgency === 'emergency' ? (
                      <ShieldAlert className="w-3 h-3 text-[#C83F49]" />
                    ) : item.urgency === 'prompt' ? (
                      <AlertTriangle className="w-3 h-3 text-[#E7A23B]" />
                    ) : (
                      <ShieldCheck className="w-3 h-3 text-[#249A96]" />
                    )}
                    <span>{item.badge}</span>
                  </span>
                </div>
                <h3
                  className={`font-bold text-base mb-1 font-display ${
                    isSelected ? 'text-white' : 'text-[#153B50]'
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-xs line-clamp-2 ${
                    isSelected ? 'text-slate-200' : 'text-[#687986]'
                  }`}
                >
                  {item.subtitle}
                </p>
                <div
                  className={`mt-2.5 pt-2 border-t text-[11px] flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-white/15 text-[#E9F7F5]'
                      : 'border-[#DCE6ED] text-[#687986]'
                  }`}
                >
                  <User className="w-3 h-3 shrink-0" />
                  <span className="truncate tabular-nums">
                    Patient: {item.formData?.patientName || 'Sample Patient'} ·{' '}
                    {item.formData?.patientAge || 'Adult'} ·{' '}
                    {item.formData?.patientGender || 'Not Specified'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Panel: Full 12-Section Professional Medical Report */}
        <div className="lg:col-span-8">
          {selectedSource === 'live' && hasLatestLiveReport ? (
            latestSkinReport ? (
              <ProfessionalMedicalReport
                type="skin"
                skinReport={latestSkinReport}
                previewImageUrl={latestSkinImage || null}
                intakeContext={{
                  patientName: livePatientName,
                  patientAge: livePatientAge,
                  patientGender: livePatientGender,
                  ...latestIntakeContext,
                }}
                onStartNew={() => onNavigate('skin')}
              />
            ) : (
              <ProfessionalMedicalReport
                type="symptom"
                symptomReport={latestSymptomReport || undefined}
                intakeContext={{
                  patientName: livePatientName,
                  patientAge: livePatientAge,
                  patientGender: livePatientGender,
                  ...latestIntakeContext,
                }}
                onStartNew={() => onNavigate('symptoms')}
              />
            )
          ) : (
            <ProfessionalMedicalReport
              type={currentCase.type}
              symptomReport={
                currentCase.type === 'symptom' ? currentCase.precomputedReport : undefined
              }
              skinReport={
                currentCase.type === 'skin' ? currentCase.precomputedReport : undefined
              }
              previewImageUrl={currentCase.image || null}
              intakeContext={{
                patientName: currentCase.formData?.patientName || 'Sample Patient',
                patientAge: currentCase.formData?.patientAge || 'Adult',
                patientGender: currentCase.formData?.patientGender || 'Not Specified',
                mainComplaint: currentCase.title,
                symptoms: currentCase.formData?.symptoms || [],
                description:
                  currentCase.formData?.notes ||
                  currentCase.formData?.description ||
                  currentCase.summary,
                duration: currentCase.formData?.duration || 'Several days',
                severity: currentCase.formData?.severity || 'moderate',
                ageGroup: currentCase.formData?.ageGroup || 'adult',
                bodyLocation: currentCase.type === 'skin' ? 'Affected skin area' : undefined,
              }}
              onStartNew={() =>
                onNavigate(currentCase.type === 'skin' ? 'skin' : 'symptoms')
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};
