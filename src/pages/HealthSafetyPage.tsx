import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Stethoscope,
  Eye,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-center">
      {/* Unique Centered Safety Governance Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-12 shadow-2xs space-y-5 flex flex-col items-center text-center medical-grid-pattern"
      >
        <div className="text-xs font-bold uppercase tracking-widest text-[#249A96]">
          Clinical Governance · Patient Safety Standards
        </div>
        <h1
          className="text-3xl sm:text-5xl font-extrabold text-[#153B50] tracking-tight text-center max-w-3xl mx-auto"
          style={{ textWrap: 'balance' }}
        >
          Health Information and Safety Guidelines
        </h1>
        <p className="text-base text-[#687986] leading-relaxed max-w-2xl mx-auto text-center">
          DermaDetect AI is engineered with strict clinical boundaries, calibrated uncertainty disclosures, and red-flag triage protocols to ensure safe, responsible health education.
        </p>
        <div className="pt-2">
          <MedicalButton
            variant="urgent"
            size="md"
            icon={<ShieldAlert className="w-4 h-4" />}
            onClick={onOpenEmergencyModal}
          >
            View Emergency Red-Flag Checklist
          </MedicalButton>
        </div>
      </motion.div>

      {/* Primary Safety Notice (Centered) */}
      <MedicalAlert
        tone="warning"
        title="Important Clinical Scope Disclosure"
        centered
      >
        DermaDetect AI provides structured health information and preliminary dermatological awareness. It does not issue medical diagnoses, prescribe medications, or replace an in-person clinical examination, dermoscopy, or histological biopsy by a licensed physician.
      </MedicalAlert>

      {/* Core Safety Pillars Grid (Centered Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MedicalCard className="space-y-4 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center mx-auto animate-float-slow">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#153B50] text-center">
            01. Probabilistic Possibilities
          </h2>
          <p className="text-sm text-[#687986] leading-relaxed text-center">
            Every symptom or skin report presents 2 to 4 differential possibilities rather than a single definitive claim, helping patients prepare informed questions for their physician.
          </p>
        </MedicalCard>

        <MedicalCard className="space-y-4 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center mx-auto animate-float-slow">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#153B50] text-center">
            02. 2D Photography Limitations
          </h2>
          <p className="text-sm text-[#687986] leading-relaxed text-center">
            A standard camera image cannot assess subsurface depth, tactile firmness (palpation), temperature, or microscopic cellular features required to rule out skin cancer.
          </p>
        </MedicalCard>

        <MedicalCard className="space-y-4 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#C83F49]/10 text-[#C83F49] flex items-center justify-center mx-auto animate-float-slow">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#153B50] text-center">
            03. Red-Flag Emergency Triage
          </h2>
          <p className="text-sm text-[#687986] leading-relaxed text-center">
            When acute symptoms such as chest pressure, severe shortness of breath, or anaphylactic swelling are reported, routine intake is bypassed in favor of immediate emergency guidance.
          </p>
        </MedicalCard>
      </div>

      {/* Detailed Clinical Sections (Centered) */}
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
                className="p-5 rounded-xl bg-[#F7FAFC] border border-[#E2E8F0] space-y-2 flex flex-col items-center text-center"
              >
                <div className="font-bold text-[#153B50] text-center">{item.letter}</div>
                <p className="text-xs text-[#687986] leading-relaxed text-center">{item.desc}</p>
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
            <div className="p-6 rounded-2xl bg-[#C83F49]/8 border border-[#C83F49]/30 space-y-3 flex flex-col items-center text-center">
              <div className="flex items-center justify-center gap-2 font-bold text-[#C83F49] text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Immediate Emergency Care (Call 911 / 112)</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#253746] text-center">
                <li>Crushing chest pain, tightness, or pain radiating to jaw or arm</li>
                <li>Difficulty breathing, gasping for air, or bluish lips/fingertips</li>
                <li>Rapid swelling of the tongue, lips, throat, or face</li>
                <li>Non-blanching purple/red rash accompanied by high fever or stiff neck</li>
                <li>Sudden weakness, facial drooping, or slurred speech</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[#E9F7F5]/60 border border-[#249A96]/30 space-y-3 flex flex-col items-center text-center">
              <div className="flex items-center justify-center gap-2 font-bold text-[#153B50] text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#249A96]" />
                <span>Prompt Outpatient Physician / Dermatologist Visit</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#253746] text-center">
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
      <MedicalCard className="flex flex-col items-center text-center gap-5 bg-[#153B50] text-white border-none navy-grid-pattern">
        <div className="space-y-1.5 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center">
            Ready to start a structured health assessment?
          </h3>
          <p className="text-sm text-slate-300 text-center">
            Explore our guided AI Symptom Checker or upload a skin image for a preliminary morphological report.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <MedicalButton
            variant="teal"
            onClick={() => onNavigate('symptoms')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Start Symptom Checker
          </MedicalButton>
          <MedicalButton
            variant="light-teal"
            onClick={() => onNavigate('skin')}
          >
            Open Skin Analysis
          </MedicalButton>
        </div>
      </MedicalCard>
    </div>
  );
};
