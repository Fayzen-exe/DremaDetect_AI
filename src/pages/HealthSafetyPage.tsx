import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Stethoscope,
  Eye,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  MedicalCard,
  MedicalButton,
  MedicalAlert,
  MedicalReportSection,
} from '../components/ui/MedicalUI';

interface HealthSafetyPageProps {
  onNavigate: (tab: string) => void;
  onOpenEmergencyModal: () => void;
}

export const HealthSafetyPage: React.FC<HealthSafetyPageProps> = ({
  onNavigate,
  onOpenEmergencyModal,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 text-center">
      {/* Centered Safety Governance Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative sunset-subpage-banner p-8 sm:p-12 text-white overflow-hidden shadow-xl space-y-5 flex flex-col items-center text-center"
      >
        <div className="absolute inset-0 bg-dot-grid-white opacity-20 pointer-events-none" />

        <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Clinical Governance • Patient Safety Standards</span>
        </div>
        <h1
          className="relative text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display text-center max-w-3xl mx-auto leading-[1.15]"
          style={{ textWrap: 'balance' }}
        >
          Health Information &amp; Safety Guidelines
        </h1>
        <p className="relative text-base text-white/90 leading-relaxed max-w-2xl mx-auto text-center font-medium">
          DermaDetect AI is engineered with strict clinical boundaries, calibrated differential probabilities, and red-flag triage protocols to ensure safe, responsible health education.
        </p>
        <div className="relative pt-2">
          <button
            type="button"
            onClick={onOpenEmergencyModal}
            className="btn-pill bg-white text-rose-600 hover:bg-neutral-50 px-6 py-3 text-xs sm:text-sm font-bold shadow-md cursor-pointer flex items-center gap-2 transition-transform hover:scale-105"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>View Emergency Red-Flag Checklist</span>
          </button>
        </div>
      </motion.div>

      {/* Primary Safety Notice */}
      <MedicalAlert
        tone="warning"
        title="Important Clinical Scope Disclosure"
        centered
      >
        DermaDetect AI provides structured health information and preliminary dermatological awareness. It does not issue medical diagnoses, prescribe medications, or replace an in-person clinical examination, dermoscopy, or histological biopsy by a licensed physician.
      </MedicalAlert>

      {/* Core Safety Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MedicalCard className="space-y-4 flex flex-col items-center text-center rounded-3xl p-6 border-[#E7EDF5] shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <div className="w-13 h-13 rounded-2xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center mx-auto shadow-2xs">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#10264D] text-center font-display">
            01. Probabilistic Possibilities
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed text-center">
            Every symptom or skin report presents 2 to 4 differential possibilities rather than a single definitive claim, helping patients prepare informed questions for their physician.
          </p>
        </MedicalCard>

        <MedicalCard className="space-y-4 flex flex-col items-center text-center rounded-3xl p-6 border-[#E7EDF5] shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <div className="w-13 h-13 rounded-2xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center mx-auto shadow-2xs">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#10264D] text-center font-display">
            02. 2D Photography Limitations
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed text-center">
            A standard camera image cannot assess subsurface depth, tactile firmness (palpation), temperature, or microscopic cellular features required to rule out skin cancer.
          </p>
        </MedicalCard>

        <MedicalCard className="space-y-4 flex flex-col items-center text-center rounded-3xl p-6 border-[#E7EDF5] shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <div className="w-13 h-13 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#10264D] text-center font-display">
            03. Red-Flag Emergency Triage
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed text-center">
            When acute symptoms such as chest pressure, severe shortness of breath, or anaphylactic swelling are reported, routine intake is bypassed in favor of immediate emergency guidance.
          </p>
        </MedicalCard>
      </div>

      {/* Detailed Clinical Sections */}
      <div className="space-y-8">
        <MedicalReportSection
          index="01"
          title="ABCDE Melanoma & Pigmented Lesion Safeguards"
          subtitle="American Academy of Dermatology (AAD) educational awareness criteria"
          centeredHeader
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
            {[
              {
                letter: 'A — Asymmetry',
                desc: 'One half of the spot or mole does not match the other half in shape or appearance.',
              },
              {
                letter: 'B — Border',
                desc: 'Edges are irregular, scalloped, notched, or poorly defined against surrounding skin.',
              },
              {
                letter: 'C — Color',
                desc: 'Variation from one area to another, with shades of tan, brown, black, red, white, or blue.',
              },
              {
                letter: 'D — Diameter',
                desc: 'Spots larger than 6 millimeters across (about the size of a pencil eraser), though smaller melanomas occur.',
              },
              {
                letter: 'E — Evolving',
                desc: 'Any lesion that is changing in size, shape, color, elevation, or beginning to bleed or crust.',
              },
            ].map((item) => (
              <div
                key={item.letter}
                className="p-5 rounded-2xl bg-[#F7FAFF] border border-[#E7EDF5] space-y-2 flex flex-col items-center text-center"
              >
                <div className="font-bold text-[#10264D] text-center font-display">{item.letter}</div>
                <p className="text-xs text-[#64748B] leading-relaxed text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </MedicalReportSection>

        <MedicalReportSection
          index="02"
          title="When to Seek Immediate Emergency Care vs. Routine Outpatient Care"
          subtitle="Clear triage thresholds for safe decision-making"
          centeredHeader
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="p-6 sm:p-8 rounded-3xl bg-red-50/90 border border-red-200 space-y-3.5 flex flex-col items-center text-center shadow-2xs">
              <div className="flex items-center justify-center gap-2 font-bold text-red-900 text-sm">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>Immediate Emergency Care (Call 911 / 112)</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#17253B] text-center leading-relaxed">
                <li>Crushing chest pain, tightness, or pain radiating to jaw or arm</li>
                <li>Difficulty breathing, gasping for air, or bluish lips/fingertips</li>
                <li>Rapid swelling of the tongue, lips, throat, or face</li>
                <li>Non-blanching purple/red rash accompanied by high fever or stiff neck</li>
                <li>Sudden weakness, facial drooping, or slurred speech</li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#EAF2FF]/60 border border-[#2458F5]/30 space-y-3.5 flex flex-col items-center text-center shadow-2xs">
              <div className="flex items-center justify-center gap-2 font-bold text-[#10264D] text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#2458F5]" />
                <span>Prompt Outpatient Physician / Dermatologist Visit</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#17253B] text-center leading-relaxed">
                <li>A skin spot or mole that changes shape, color, or bleeds easily</li>
                <li>Moderate fever lasting longer than 3 days without improvement</li>
                <li>Localized skin redness that is warm, tender, or gradually expanding</li>
                <li>Persistent cough, sore throat, or rash lasting more than 7–10 days</li>
                <li>Symptoms that disrupt sleep or daily work despite gentle home care</li>
              </ul>
            </div>
          </div>
        </MedicalReportSection>
      </div>

      {/* Bottom Centered CTA */}
      <MedicalCard className="flex flex-col items-center text-center gap-5 bg-[#10264D] text-white border-none rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2458F5]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="space-y-2 max-w-2xl mx-auto relative">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white text-center font-display">
            Ready to start a structured health assessment?
          </h3>
          <p className="text-sm text-slate-300 text-center">
            Explore our guided AI Symptom Checker or upload a skin image for a preliminary morphological report.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 relative">
          <MedicalButton
            variant="blue"
            onClick={() => onNavigate('symptoms')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Start Symptom Checker
          </MedicalButton>
          <MedicalButton
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
            onClick={() => onNavigate('skin')}
          >
            Open Skin Analysis
          </MedicalButton>
        </div>
      </MedicalCard>
    </div>
  );
};
