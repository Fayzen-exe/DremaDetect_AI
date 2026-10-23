import React, { useState } from 'react';
import { AIDoctorConsultation } from '../components/AIDoctorConsultation';
import { Stethoscope, ShieldCheck, MessageSquare, Globe, FileText, Scan } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-center">
      {/* Page Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4 max-w-3xl mx-auto flex flex-col items-center text-center"
      >
        <div className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#249A96] tracking-wider uppercase">
          <Stethoscope className="w-4 h-4" />
          <span>Clinical Communicator & Health Educator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#153B50] tracking-tight text-center">
          Consult with Dr. Fizza, MD
        </h1>
        <p className="text-sm sm:text-base text-[#687986] max-w-2xl mx-auto leading-relaxed text-center">
          Ask questions in plain language to clarify medical terms, understand gentle home comfort measures, and prepare focused questions for your doctor visit.
        </p>
      </motion.div>

      {/* Featured Clinical Video Showcase (Automatic Continuous Playback) */}
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
        <MedicalCard padding="sm" className="flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center mx-auto">
            <Globe className="w-5 h-5" />
          </div>
          <div className="font-bold text-[#153B50]">Evidence-Aligned References</div>
          <p className="text-[#687986]">
            Grounded in current medical education to explain terms clearly without jargon.
          </p>
        </MedicalCard>

        <MedicalCard padding="sm" className="flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center mx-auto">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="font-bold text-[#153B50]">Interactive Follow-Ups</div>
          <p className="text-[#687986]">
            Ask follow-up questions, request simpler explanations, and explore next steps comfortably.
          </p>
        </MedicalCard>

        <MedicalCard padding="sm" className="flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="font-bold text-[#153B50]">Safe & Confidential</div>
          <p className="text-[#687986]">
            Zero chat persistence to external databases. Focused purely on patient empowerment.
          </p>
        </MedicalCard>
      </div>

      {/* Optional Context Switcher if User Has Generated Reports */}
      {(latestSymptomReport || latestSkinReport) && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F7FAFC] border border-[#DCE6ED] rounded-2xl px-5 py-3.5 text-left">
          <div className="text-xs text-[#153B50] font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#249A96]" />
            <span>Consultation Context:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {latestSymptomReport && (
              <button
                type="button"
                onClick={() => setSelectedContextMode('symptom')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeReportContext === latestSymptomReport
                    ? 'bg-[#153B50] text-white'
                    : 'bg-white text-[#253746] border border-[#DCE6ED] hover:border-[#249A96]'
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
                    ? 'bg-[#153B50] text-white'
                    : 'bg-white text-[#253746] border border-[#DCE6ED] hover:border-[#249A96]'
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
                  ? 'bg-[#249A96] text-white'
                  : 'bg-white text-[#687986] border border-[#DCE6ED] hover:text-[#153B50]'
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

