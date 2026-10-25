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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative sunset-subpage-banner p-8 sm:p-12 text-white overflow-hidden shadow-xl"
      >
        <div className="absolute inset-0 bg-dot-grid-white opacity-20 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Generated Clinical Report Explorer • 12-Section Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display leading-[1.15]">
              Analysis Results &amp; Clinical Reports
            </h1>
            <p className="text-base text-white/90 leading-relaxed font-medium">
              Review and export your comprehensive 12-section health report as an official clinical document or digital summary—complete with clinical findings, patient context, care guidance, and red flag warnings.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('symptoms')}
              className="btn-pill btn-pill-white text-xs sm:text-sm px-5 py-2.5 font-bold shadow-md cursor-pointer flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Stethoscope className="w-4 h-4 text-[#d81e5b]" />
              <span>New Symptom Check</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('skin')}
              className="btn-pill btn-pill-glass text-xs sm:text-sm px-5 py-2.5 font-semibold cursor-pointer flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Camera className="w-4 h-4 text-white" />
              <span>New Skin Analysis</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Visual System Legend Bar */}
      <div className="bg-white border border-[#E7EDF5] rounded-3xl p-5 sm:px-8 grid grid-cols-1 sm:grid-cols-4 gap-5 text-xs shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-[#10264D] block font-display text-sm font-bold">AI-Generated Badge</strong>
            <span className="text-[#64748B]">Non-diagnostic clinical synthesis</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-[#10264D] block font-display text-sm font-bold">Symptoms & Features</strong>
            <span className="text-[#64748B]">Reported vs. visible findings</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center shrink-0">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-[#10264D] block font-display text-sm font-bold">Recovery & Self-Care</strong>
            <span className="text-[#64748B]">Evidence-based comfort steps</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-[#10264D] block font-display text-sm font-bold">Warnings & Red Flags</strong>
            <span className="text-[#64748B]">Cautions & urgent care signs</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          {hasLatestLiveReport && (
            <div className="space-y-2 pb-3 border-b border-[#E7EDF5]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#2458F5] px-1">
                Your Recent Session Report
              </h2>
              <button
                type="button"
                onClick={() => setSelectedSource('live')}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedSource === 'live'
                    ? 'bg-[#10264D] border-[#10264D] text-white shadow-md'
                    : 'bg-white border-[#2458F5] text-[#17253B] hover:bg-[#EAF2FF]/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 text-xs font-semibold">
                  <span
                    className={`inline-flex items-center gap-1.5 ${
                      selectedSource === 'live' ? 'text-[#EAF2FF]' : 'text-[#2458F5]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Live AI Assessment</span>
                  </span>
                </div>
                <h3
                  className={`font-bold text-base font-display ${
                    selectedSource === 'live' ? 'text-white' : 'text-[#10264D]'
                  }`}
                >
                  {latestSkinReport ? 'Latest Skin Analysis Report' : 'Latest Symptom Report'}
                </h3>
                <div
                  className={`mt-2.5 pt-2 border-t text-xs flex items-center gap-2 ${
                    selectedSource === 'live'
                      ? 'border-white/15 text-slate-300'
                      : 'border-[#E7EDF5] text-[#64748B]'
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

          <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B] px-1">
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
                    ? 'bg-[#10264D] border-[#10264D] text-white shadow-md'
                    : 'bg-white border-[#E7EDF5] text-[#17253B] hover:border-[#2458F5]/60 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 text-xs font-semibold">
                  <span
                    className={`inline-flex items-center gap-1.5 ${
                      isSelected ? 'text-[#EAF2FF]' : 'text-[#2458F5]'
                    }`}
                  >
                    {item.type === 'skin' ? (
                      <Camera className="w-3.5 h-3.5" />
                    ) : (
                      <Stethoscope className="w-3.5 h-3.5" />
                    )}
                    <span>{item.type === 'skin' ? 'Skin Analysis' : 'Symptom Triage'}</span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 ${
                      isSelected ? 'text-slate-300' : 'text-[#64748B]'
                    }`}
                  >
                    {item.urgency === 'emergency' ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                    ) : item.urgency === 'prompt' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    <span>{item.badge}</span>
                  </span>
                </div>
                <h3
                  className={`font-bold text-base mb-1 font-display ${
                    isSelected ? 'text-white' : 'text-[#10264D]'
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-xs line-clamp-2 leading-relaxed ${
                    isSelected ? 'text-slate-300' : 'text-[#64748B]'
                  }`}
                >
                  {item.subtitle}
                </p>
                <div
                  className={`mt-2.5 pt-2 border-t text-[11px] flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-white/15 text-[#EAF2FF]'
                      : 'border-[#E7EDF5] text-[#64748B]'
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

        {/* Right Panel: Full 12-Section Report */}
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
