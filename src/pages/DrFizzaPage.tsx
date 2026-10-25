import React, { useState } from 'react';
import { AIDoctorConsultation } from '../components/AIDoctorConsultation';
import { Stethoscope, ShieldCheck, MessageSquare, Globe, FileText, Scan, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { MedicalCard, MedicalVideoShowcase } from '../components/ui/MedicalUI';
import { clinicalOverviewVideo } from '../assets/videos';
import { SymptomReport, SkinReport } from '../types/health';

interface DrFizzaPageProps {
  latestSymptomReport?: SymptomReport | null;
  latestSkinReport?: SkinReport | null;
}

export const DrFizzaPage: React.FC<DrFizzaPageProps> = ({
  latestSymptomReport,
  latestSkinReport,
}) => {
  const [selectedContextMode, setSelectedContextMode] = useState<'auto' | 'symptom' | 'skin' | 'general'>('auto');

  const activeReportType: 'symptom' | 'skin' =
    selectedContextMode === 'skin'
      ? 'skin'
      : selectedContextMode === 'symptom'
      ? 'symptom'
      : latestSkinReport
      ? 'skin'
      : 'symptom';

  const activeReportContext =
    selectedContextMode === 'general'
      ? undefined
      : selectedContextMode === 'skin'
      ? latestSkinReport || undefined
      : selectedContextMode === 'symptom'
      ? latestSymptomReport || undefined
      : latestSkinReport || latestSymptomReport || undefined;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 text-center">
      {/* Page Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative sunset-subpage-banner p-8 sm:p-12 text-white overflow-hidden shadow-xl"
      >
        <div className="absolute inset-0 bg-dot-grid-white opacity-20 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-4 flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wide">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinical Communicator &amp; Health Educator</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display text-center leading-[1.15]">
            Consult with Dr. Fizza, MD
          </h1>
          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed text-center font-medium">
            Ask questions in plain language to clarify medical terms, understand gentle home comfort measures, and prepare focused questions for your doctor visit.
          </p>
        </div>
      </motion.div>

      {/* Featured Clinical Video Showcase */}
      <div className="max-w-4xl mx-auto">
        <MedicalVideoShowcase
          src={clinicalOverviewVideo}
          badgeText="Appointment Preparation"
          title="Calm, Accessible Health Guidance & Conversation Support"
          subtitle="Explore follow-up questions in everyday language before your in-person consultation."
        />
      </div>

      {/* Feature Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#d81e5b] flex items-center justify-center mx-auto shadow-2xs">
            <Globe className="w-6 h-6" />
          </div>
          <div className="font-bold text-sm text-[#10264D] font-display">Evidence-Aligned References</div>
          <p className="text-[#64748B] leading-relaxed">
            Grounded in current medical literature to explain clinical terms clearly without confusing jargon.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto shadow-2xs">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="font-bold text-sm text-[#10264D] font-display">Interactive Follow-Ups</div>
          <p className="text-[#64748B] leading-relaxed">
            Ask follow-up questions, request simpler explanations, and explore next steps comfortably.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="font-bold text-sm text-[#10264D] font-display">Safe &amp; Confidential</div>
          <p className="text-[#64748B] leading-relaxed">
            Zero chat persistence to external databases. Focused purely on patient empowerment.
          </p>
        </div>
      </div>

      {/* Optional Context Switcher if User Has Generated Reports */}
      {(latestSymptomReport || latestSkinReport) && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F7FAFF] border border-[#E7EDF5] rounded-2xl px-5 py-3.5 text-left">
          <div className="text-xs text-[#10264D] font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#2458F5]" />
            <span>Consultation Context:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {latestSymptomReport && (
              <button
                type="button"
                onClick={() => setSelectedContextMode('symptom')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeReportContext === latestSymptomReport
                    ? 'bg-[#10264D] text-white shadow-xs'
                    : 'bg-white text-[#17253B] border border-[#E7EDF5] hover:border-[#2458F5]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Symptom Report ({latestSymptomReport.caseId})</span>
              </button>
            )}
            {latestSkinReport && (
              <button
                type="button"
                onClick={() => setSelectedContextMode('skin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeReportContext === latestSkinReport
                    ? 'bg-[#10264D] text-white shadow-xs'
                    : 'bg-white text-[#17253B] border border-[#E7EDF5] hover:border-[#2458F5]'
                }`}
              >
                <Scan className="w-3.5 h-3.5" />
                <span>Skin Analysis ({latestSkinReport.caseId})</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedContextMode('general')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedContextMode === 'general'
                  ? 'bg-[#2458F5] text-white shadow-xs'
                  : 'bg-white text-[#64748B] border border-[#E7EDF5] hover:text-[#10264D]'
              }`}
            >
              General Consultation (No Report)
            </button>
          </div>
        </div>
      )}

      {/* Main Dr. Fizza Consultation Chat Component */}
      <div className="text-left">
        <AIDoctorConsultation
          reportContext={activeReportContext}
          reportType={activeReportType}
        />
      </div>
    </div>
  );
};
