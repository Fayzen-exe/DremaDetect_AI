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
        className="relative sunset-subpage-banner p-8 sm:p-12 text-white overflow-hidden shadow-xl text-center"
      >
        <div className="absolute inset-0 bg-dot-grid-white opacity-20 pointer-events-none" />

        <div className="relative space-y-4 max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wide uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>Clinical Healthcare Architecture • Health Literacy &amp; Patient Empowerment</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display leading-[1.15]">
            About DermaDetect AI
          </h1>
          <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto font-medium">
            A patient-centered health intelligence platform created to help individuals understand unfamiliar symptoms and skin concerns calmly before consulting a physician.
          </p>
        </div>
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
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-md text-center space-y-4 bg-dot-grid">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-[#d81e5b] text-xs font-bold uppercase tracking-wider mx-auto">
          <Sparkles className="w-3.5 h-3.5" />
          Our Mission
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#10264D] font-display">
          Why We Built DermaDetect AI
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl mx-auto">
          Millions of people notice unfamiliar skin spots or physical symptoms each year. Searching online often leads to overwhelming or alarming results—causing unnecessary worry or delaying care when a doctor visit is truly needed.
        </p>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-3xl mx-auto">
          <strong>DermaDetect AI</strong> was created as a calm, supportive companion. By combining visual skin observation with step-by-step symptom questions, it offers balanced educational insights that prepare patients for productive conversations with their doctors.
        </p>
      </div>

      {/* Creators & Leadership Section */}
      <section className="space-y-6">
        <div className="space-y-2 max-w-2xl mx-auto text-center">
          <span className="section-label">
            <Sparkles className="w-3 h-3" />
            Leadership &amp; Engineering
          </span>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#10264D] font-display">
            Built with Medical Ethics &amp; Technical Precision
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all space-y-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#d81e5b] flex items-center justify-center font-bold text-lg">
              FA
            </div>
            <div>
              <h4 className="text-xl font-bold text-[#10264D]">Fizza Amin</h4>
              <p className="text-xs font-bold text-[#d81e5b] uppercase tracking-wider">Clinical Architecture &amp; Healthcare UX</p>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Designed the empathetic bedside conversational persona (Dr. Fizza, MD), ABCDE dermatological triage protocols, differential phrasing safeguards, and clinical patient summary structures.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all space-y-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-lg">
              MF
            </div>
            <div>
              <h4 className="text-xl font-bold text-[#10264D]">Muhammad Faizan Ud Din</h4>
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Full-Stack AI &amp; Infrastructure Security</p>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Engineered the clinical multimodal vision pipeline, server proxy hardening, adversarial boundary isolation, deterministic offline fallback engine, and high-resolution PDF generation.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Core Clinical Commitments */}
      <section className="space-y-6">
        <div className="space-y-2 max-w-2xl mx-auto text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#d81e5b] inline-flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4" />
            <span>Patient Care Standards</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#10264D] font-display">
            Ethical &amp; Clinical Guardrails
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: '01. Balanced, Non-Diagnostic Guidance',
              desc: 'We never present a single condition as a confirmed diagnosis. Every summary outlines multiple possibilities to discuss with your physician.',
              bg: 'bg-rose-50 text-[#d81e5b]',
            },
            {
              title: '02. Pigmented Spot & Melanoma Safeguards',
              desc: 'No photograph can rule out skin cancer on its own. Spots showing ABCDE changes are always recommended for an in-person dermatologist examination.',
              bg: 'bg-orange-50 text-orange-600',
            },
            {
              title: '03. Safe Supportive Care Only',
              desc: 'We never recommend prescription medications or drug dosages. Guidance focuses on gentle skin care, hydration, rest, and symptom monitoring.',
              bg: 'bg-amber-50 text-amber-600',
            },
            {
              title: '04. Immediate Warning Sign Awareness',
              desc: 'When urgent symptoms such as chest pain, severe breathing difficulty, or facial swelling are reported, we immediately direct users to emergency care.',
              bg: 'bg-purple-50 text-purple-600',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3 text-left">
              <div className={`w-11 h-11 rounded-2xl ${item.bg} flex items-center justify-center`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#10264D] font-display">{item.title}</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy & Clinical Scope Banner */}
      <div className="sunset-card-gradient sunset-glow rounded-3xl p-8 sm:p-12 space-y-4 text-center text-white overflow-hidden shadow-xl">
        <div className="w-13 h-13 rounded-2xl bg-white/20 text-white flex items-center justify-center mx-auto border border-white/30 shadow-sm">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Private by Design • Zero Data Retention
        </h3>
        <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-3xl mx-auto font-medium">
          All symptom answers and uploaded skin photographs are evaluated in real time with confidential zero-storage privacy and cleared immediately after your clinical report is generated. DermaDetect AI is an educational resource and does not replace a physical examination by a licensed physician.
        </p>
      </div>
    </div>
  );
};
