import React from 'react';
import { Lock, ShieldCheck, AlertTriangle, EyeOff, ServerOff, UserX } from 'lucide-react';
import { motion } from 'motion/react';
import { MedicalCard, MedicalBadge } from '../components/ui/MedicalUI';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-center">
      {/* Unique Centered Privacy Vault Hero */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="bg-[#153B50] text-white rounded-3xl p-8 sm:p-12 shadow-md space-y-4 flex flex-col items-center text-center navy-grid-pattern"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#249A96]/30 text-[#5EEAD4] flex items-center justify-center mx-auto animate-float-slow">
          <Lock className="w-7 h-7" />
        </div>
        <div className="text-xs font-bold text-[#5EEAD4] tracking-widest uppercase">
          Patient Trust · Zero Data Retention Architecture
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight text-center">
          Privacy Policy & Data Protection
        </h1>
        <p className="text-sm sm:text-base text-[#E9F7F5]/90 leading-relaxed max-w-2xl mx-auto text-center">
          We treat health inquiries and cutaneous photographs with the highest standard of privacy. Below is our transparent disclosure of ephemeral in-memory data handling and clinical boundaries.
        </p>
      </motion.div>

      {/* 3 Core Privacy Pillars (Centered Cards) */}
      <section className="space-y-6 text-center">
        <div className="space-y-2 max-w-2xl mx-auto">
          <MedicalBadge tone="teal">Core Privacy Guarantee</MedicalBadge>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#153B50] text-center">
            Ephemeral In-Memory Processing
          </h2>
          <p className="text-sm text-[#687986] text-center">
            DermaDetect AI does not store, archive, or retain your uploaded skin photographs or symptom responses in any database or disk storage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MedicalCard className="space-y-3 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center mx-auto">
              <UserX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#153B50] text-center">
              No User Accounts Required
            </h3>
            <p className="text-xs sm:text-sm text-[#687986] leading-relaxed text-center">
              No passwords, personal identity numbers, or medical record identifiers are requested to use our screening tools.
            </p>
          </MedicalCard>

          <MedicalCard className="space-y-3 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center mx-auto">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#153B50] text-center">
              Zero Advertising Trackers
            </h3>
            <p className="text-xs sm:text-sm text-[#687986] leading-relaxed text-center">
              We never embed third-party behavioral advertising cookies or commercial health profiling pixels.
            </p>
          </MedicalCard>

          <MedicalCard className="space-y-3 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center mx-auto">
              <ServerOff className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#153B50] text-center">
              Ephemeral RAM Buffers
            </h3>
            <p className="text-xs sm:text-sm text-[#687986] leading-relaxed text-center">
              Photographs are processed in volatile memory solely to generate your report and are immediately discarded.
            </p>
          </MedicalCard>
        </div>
      </section>

      {/* Detailed Disclosures (Centered Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MedicalCard className="space-y-3 text-center flex flex-col items-center">
          <ShieldCheck className="w-6 h-6 text-[#249A96]" />
          <h2 className="text-lg font-bold text-[#153B50] text-center">
            1. What Information Is Processed and Why
          </h2>
          <p className="text-xs sm:text-sm text-[#687986] leading-relaxed text-center">
            <strong>Symptom Checker:</strong> Selected symptoms, duration, severity, and general age group are used solely to synthesize your differential report.
          </p>
          <p className="text-xs sm:text-sm text-[#687986] leading-relaxed text-center">
            <strong>Skin Analysis:</strong> Your uploaded base64 image and optional context notes are inspected for surface morphology and ABCDE educational criteria.
          </p>
        </MedicalCard>

        <MedicalCard className="space-y-3 text-center flex flex-col items-center">
          <AlertTriangle className="w-6 h-6 text-[#E7A23B]" />
          <h2 className="text-lg font-bold text-[#153B50] text-center">
            2. Full Medical Responsibility Disclaimer
          </h2>
          <p className="text-xs sm:text-sm text-[#687986] leading-relaxed text-center">
            DermaDetect AI is designed for informational, educational, and preliminary triage awareness only. Two-dimensional smartphone photography cannot replace physical palpation, polarized dermoscopy, or histological biopsy.
          </p>
          <p className="text-xs sm:text-sm text-[#C83F49] font-semibold leading-relaxed text-center">
            In the event of chest pain, difficulty breathing, or severe allergic reactions, call 911 / 112 immediately.
          </p>
        </MedicalCard>
      </div>
    </div>
  );
};
