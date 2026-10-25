import React from 'react';
import {
  Award,
  HeartPulse,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  MedicalCard,
  MedicalBadge,
  MedicalVideoShowcase,
} from '../components/ui/MedicalUI';
import {
  clinicalOverviewVideo,
  skinAnalysisVideo,
  systemicTriageVideo,
} from '../assets/videos';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
      {/* Editorial Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4 max-w-3xl mx-auto text-center"
      >
        <div className="flex justify-center">
          <img
            src="https://res.cloudinary.com/dtz0urit6/image/upload/q_auto:best,f_jpg/cloudinary-tools-uploads/h5qnasixn5rqevzjq5xo"
            alt="DermaDetect AI Official Logo"
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-contain bg-white p-1 border border-[#E7EDF5] shadow-sm"
          />
        </div>
        <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF2FF] border border-[#2458F5]/20 text-[#2458F5] text-xs font-semibold tracking-wide uppercase">
          <Award className="w-3.5 h-3.5" />
          <span>Clinical AI Initiative · Health Literacy & Patient Empowerment</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#10264D] tracking-tight font-display leading-[1.15]">
          About DermaDetect AI
        </h1>
        <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl mx-auto">
          A patient-centered health intelligence platform created to help individuals understand unfamiliar symptoms and skin concerns calmly before consulting a physician.
        </p>
      </motion.div>

      {/* 3 Clinical Videos Running in Visual Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MedicalVideoShowcase
          src={clinicalOverviewVideo}
          badgeText="01. Patient Education"
          title="Clear Health Understanding"
          subtitle="Translates complex clinical concepts into calm, accessible guidance."
        />
        <MedicalVideoShowcase
          src={skinAnalysisVideo}
          badgeText="02. Dermatology Observation"
          title="Surface & Border Review"
          subtitle="Examines visible skin characteristics and ABCDE educational signs privately."
        />
        <MedicalVideoShowcase
          src={systemicTriageVideo}
          badgeText="03. Guided Symptom Check"
          title="Structured Visit Preparation"
          subtitle="Organizes symptom timelines and questions for your doctor appointment."
        />
      </div>

      {/* Mission Statement Card */}
      <MedicalCard padding="lg" className="space-y-4 text-center rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border-[#E7EDF5]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2FF] text-[#2458F5] text-xs font-bold uppercase tracking-wider mx-auto">
          <Sparkles className="w-3.5 h-3.5" />
          Our Mission
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10264D] font-display">
          Why We Built DermaDetect AI
        </h2>
        <p className="text-sm sm:text-base text-[#17253B] leading-relaxed max-w-3xl mx-auto">
          Millions of people notice unfamiliar skin spots or physical symptoms each year. Searching online often leads to overwhelming or alarming results—causing unnecessary worry or delaying care when a doctor visit is truly needed.
        </p>
        <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-3xl mx-auto">
          <strong>DermaDetect AI</strong> was created as a calm, supportive companion. By combining visual skin observation with step-by-step symptom questions, it offers balanced educational insights that prepare patients for productive conversations with their doctors.
        </p>
      </MedicalCard>

      {/* 4 Core Clinical Commitments */}
      <section className="space-y-6">
        <div className="space-y-2 max-w-2xl mx-auto text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#2458F5] inline-flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4" />
            <span>Patient Care Standards</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#10264D] font-display">
            Ethical & Clinical Guardrails
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: '01. Balanced, Non-Diagnostic Guidance',
              desc: 'We never present a single condition as a confirmed diagnosis. Every summary outlines multiple possibilities to discuss with your physician.',
            },
            {
              title: '02. Pigmented Spot & Melanoma Safeguards',
              desc: 'No photograph can rule out skin cancer on its own. Spots showing ABCDE changes are always recommended for an in-person dermatologist examination.',
            },
            {
              title: '03. Safe Supportive Care Only',
              desc: 'We never recommend prescription medications or drug dosages. Guidance focuses on gentle skin care, hydration, rest, and symptom monitoring.',
            },
            {
              title: '04. Immediate Warning Sign Awareness',
              desc: 'When urgent symptoms such as chest pain, severe breathing difficulty, or facial swelling are reported, we immediately direct users to emergency care.',
            },
          ].map((item) => (
            <MedicalCard key={item.title} className="space-y-3 text-left rounded-3xl p-6 border-[#E7EDF5] shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              <div className="w-11 h-11 rounded-2xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center shadow-2xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#10264D] font-display">{item.title}</h4>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                {item.desc}
              </p>
            </MedicalCard>
          ))}
        </div>
      </section>

      {/* Privacy & Clinical Scope Banner */}
      <div className="relative bg-[#10264D] text-white rounded-3xl p-8 sm:p-12 space-y-4 text-center overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2458F5]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="w-13 h-13 rounded-2xl bg-white/10 text-[#EAF2FF] flex items-center justify-center mx-auto border border-white/15 shadow-sm">
          <ShieldCheck className="w-7 h-7 text-[#2458F5]" />
        </div>
        <h3 className="text-2xl font-extrabold text-white font-display">
          Private by Design · Zero Data Retention
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl mx-auto">
          All symptom answers and uploaded skin photographs are evaluated in real time with confidential zero-storage privacy and cleared immediately after your clinical report is generated. DermaDetect AI is an educational resource and does not replace a physical examination by a licensed physician.
        </p>
      </div>
    </div>
  );
};
