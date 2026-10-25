import React from 'react';
import { Lock, ShieldCheck, AlertTriangle, EyeOff, ServerOff, UserX, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { MedicalCard, MedicalBadge } from '../components/ui/MedicalUI';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 text-center">
      {/* Centered Privacy Vault Hero */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative bg-[#10264D] text-white rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-4 flex flex-col items-center text-center overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2458F5]/25 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="w-14 h-14 rounded-2xl bg-white/10 text-[#EAF2FF] flex items-center justify-center mx-auto border border-white/15 shadow-sm">
          <Lock className="w-7 h-7 text-[#2458F5]" />
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#EAF2FF] text-xs font-semibold tracking-wide uppercase border border-white/15">
          <Sparkles className="w-3.5 h-3.5 text-[#2458F5]" />
          <span>Patient Trust · Zero Data Retention Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display text-center leading-[1.15]">
          Privacy Policy & Data Protection
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto text-center">
          We treat health inquiries and cutaneous photographs with the highest standard of medical confidentiality. Below is our transparent disclosure of privacy protections and clinical boundaries.
        </p>
      </motion.div>

      {/* 3 Core Privacy Pillars */}
      <section className="space-y-6 text-center">
        <div className="space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2FF] text-[#2458F5] text-xs font-bold uppercase tracking-wider mx-auto">
            <ShieldCheck className="w-3.5 h-3.5" />
            Core Privacy Guarantee
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10264D] text-center font-display">
            Confidential Real-Time Processing
          </h2>
          <p className="text-sm text-[#64748B] text-center">
            DermaDetect AI does not store, archive, or retain your uploaded skin photographs or symptom responses in any database or disk storage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MedicalCard className="space-y-3.5 flex flex-col items-center text-center rounded-3xl p-6 border-[#E7EDF5] shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <div className="w-13 h-13 rounded-2xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center mx-auto shadow-2xs">
              <UserX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#10264D] text-center font-display">
              No User Accounts Required
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed text-center">
              No passwords, personal identity numbers, or medical record identifiers are requested to use our screening tools.
            </p>
          </MedicalCard>

          <MedicalCard className="space-y-3.5 flex flex-col items-center text-center rounded-3xl p-6 border-[#E7EDF5] shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <div className="w-13 h-13 rounded-2xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center mx-auto shadow-2xs">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#10264D] text-center font-display">
              Zero Advertising Trackers
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed text-center">
              We never embed third-party behavioral advertising cookies or commercial health profiling pixels.
            </p>
          </MedicalCard>

          <MedicalCard className="space-y-3.5 flex flex-col items-center text-center rounded-3xl p-6 border-[#E7EDF5] shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
            <div className="w-13 h-13 rounded-2xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center mx-auto shadow-2xs">
              <ServerOff className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#10264D] text-center font-display">
              Zero Permanent Storage
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed text-center">
              Photographs are evaluated securely during your session solely to generate your clinical report and are never stored or saved.
            </p>
          </MedicalCard>
        </div>
      </section>

      {/* Detailed Disclosures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MedicalCard className="space-y-3.5 text-center flex flex-col items-center rounded-3xl p-6 border-[#E7EDF5] shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#10264D] text-center font-display">
            1. What Information Is Processed and Why
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed text-center">
            <strong>Symptom Checker:</strong> Selected symptoms, duration, severity, and general age group are used solely to synthesize your differential report.
          </p>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed text-center">
            <strong>Skin Analysis:</strong> Your uploaded skin photograph and optional clinical context notes are evaluated for surface morphology and ABCDE educational criteria.
          </p>
        </MedicalCard>

        <MedicalCard className="space-y-3.5 text-center flex flex-col items-center rounded-3xl p-6 border-[#E7EDF5] shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#10264D] text-center font-display">
            2. Full Medical Responsibility Disclaimer
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed text-center">
            DermaDetect AI is designed for informational, educational, and preliminary triage awareness only. Two-dimensional smartphone photography cannot replace physical palpation, polarized dermoscopy, or histological biopsy.
          </p>
          <p className="text-xs sm:text-sm text-red-600 font-semibold leading-relaxed text-center">
            In the event of chest pain, difficulty breathing, or severe allergic reactions, call 911 / 112 immediately.
          </p>
        </MedicalCard>
      </div>
    </div>
  );
};
