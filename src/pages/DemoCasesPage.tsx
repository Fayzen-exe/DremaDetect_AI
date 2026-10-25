import React, { useState } from 'react';
import { DEMO_CASES } from '../data/sampleCases';
import { DemoCase } from '../types/health';
import {
  Sparkles,
  Camera,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { ProfessionalMedicalReport } from '../components/ProfessionalMedicalReport';

interface DemoCasesPageProps {
  onLoadIntoScanner: (demo: DemoCase) => void;
}

export const DemoCasesPage: React.FC<DemoCasesPageProps> = ({ onLoadIntoScanner }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(DEMO_CASES[0].id);

  const selectedCase = DEMO_CASES.find((c) => c.id === selectedCaseId) || DEMO_CASES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header Banner */}
      <div className="relative bg-[#10264D] text-white rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#2458F5]/25 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#EAF2FF] text-xs font-semibold backdrop-blur-sm border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-[#2458F5]" />
            <span>Interactive Clinical Case Reference Library</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
            Explore Verified Clinical Cases & 12-Section Reports
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Select any sample dermatology or systemic symptom case below to review its complete 12-section educational health report, or load the case directly into the live AI analyzer.
          </p>
        </div>
      </div>

      {/* Case Selector Grid + Full Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Case Cards */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider px-1">
            Select a Sample Case ({DEMO_CASES.length})
          </h2>

          {DEMO_CASES.map((demo) => {
            const isSelected = demo.id === selectedCaseId;

            return (
              <div
                key={demo.id}
                onClick={() => setSelectedCaseId(demo.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3.5 ${
                  isSelected
                    ? 'bg-white border-[#2458F5] ring-2 ring-[#2458F5]/20 shadow-[0_4px_20px_rgba(36,88,245,0.08)]'
                    : 'bg-white border-[#E7EDF5] hover:border-[#2458F5]/50 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`p-2.5 rounded-xl ${
                        demo.type === 'skin'
                          ? 'bg-[#EAF2FF] text-[#2458F5]'
                          : 'bg-slate-100 text-[#10264D]'
                      }`}
                    >
                      {demo.type === 'skin' ? (
                        <Camera className="w-4 h-4" />
                      ) : (
                        <Stethoscope className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                        {demo.type === 'skin' ? 'Skin Case' : 'Symptom Case'}
                      </span>
                      <h3 className="text-sm font-bold text-[#10264D] leading-snug font-display">
                        {demo.title}
                      </h3>
                    </div>
                  </div>

                  {isSelected && <CheckCircle2 className="w-5 h-5 text-[#2458F5] shrink-0" />}
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed">{demo.subtitle}</p>

                <div className="pt-2 border-t border-[#E7EDF5] flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F7FAFF] text-[#10264D] border border-[#E7EDF5]">
                    {demo.badge}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLoadIntoScanner(demo);
                    }}
                    className="text-xs font-bold text-[#2458F5] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Load in Live Tool</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Full 12-Section Professional Report */}
        <div className="lg:col-span-8">
          <ProfessionalMedicalReport
            type={selectedCase.type}
            symptomReport={selectedCase.type === 'symptom' ? selectedCase.precomputedReport : undefined}
            skinReport={selectedCase.type === 'skin' ? selectedCase.precomputedReport : undefined}
            previewImageUrl={selectedCase.image || null}
            intakeContext={{
              mainComplaint: selectedCase.title,
              symptoms: selectedCase.formData?.symptoms || [],
              description: selectedCase.formData?.notes || selectedCase.formData?.description || selectedCase.summary,
              duration: selectedCase.formData?.duration || 'Several days',
              severity: selectedCase.formData?.severity || 'moderate',
              ageGroup: selectedCase.formData?.ageGroup || 'adult',
              bodyLocation: selectedCase.type === 'skin' ? 'Affected skin area' : undefined,
            }}
            onStartNew={() => onLoadIntoScanner(selectedCase)}
          />
        </div>
      </div>
    </div>
  );
};
