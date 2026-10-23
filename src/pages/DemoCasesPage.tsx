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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#153B50] text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E9F7F5] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#249A96]" />
            <span>Interactive Clinical Case Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Explore Verified Clinical Cases & 12-Section Reports
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            Select any sample dermatology or symptom case below to review its complete 12-section educational health report, or load the case into the live analyzer.
          </p>
        </div>
      </div>

      {/* Case Selector Grid + Full 12-Section Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Case Cards */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-xs font-bold text-[#687986] uppercase tracking-wider px-1">
            Select a Sample Case ({DEMO_CASES.length})
          </h2>

          {DEMO_CASES.map((demo) => {
            const isSelected = demo.id === selectedCaseId;

            return (
              <div
                key={demo.id}
                onClick={() => setSelectedCaseId(demo.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-white border-[#249A96] ring-2 ring-[#249A96]/20 shadow-sm'
                    : 'bg-white border-[#DCE6ED] hover:border-[#249A96]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-2 rounded-xl ${
                        demo.type === 'skin'
                          ? 'bg-[#E9F7F5] text-[#249A96]'
                          : 'bg-slate-100 text-[#153B50]'
                      }`}
                    >
                      {demo.type === 'skin' ? (
                        <Camera className="w-4 h-4" />
                      ) : (
                        <Stethoscope className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#687986] block">
                        {demo.type === 'skin' ? 'Skin Case' : 'Symptom Case'}
                      </span>
                      <h3 className="text-sm font-bold text-[#153B50] leading-snug">
                        {demo.title}
                      </h3>
                    </div>
                  </div>

                  {isSelected && <CheckCircle2 className="w-5 h-5 text-[#249A96] shrink-0" />}
                </div>

                <p className="text-xs text-[#687986] leading-relaxed">{demo.subtitle}</p>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F7FAFC] text-[#153B50] border border-[#DCE6ED]">
                    {demo.badge}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLoadIntoScanner(demo);
                    }}
                    className="text-xs font-bold text-[#249A96] hover:underline flex items-center gap-1 cursor-pointer"
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
