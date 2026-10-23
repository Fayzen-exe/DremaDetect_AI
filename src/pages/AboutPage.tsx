import React from 'react';
import {
  Award,
  HeartPulse,
  CheckCircle2,
  ShieldCheck,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
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
            className="w-16 h-16 rounded-2xl object-contain bg-white p-1 border border-[#DCE6ED] shadow-sm"
          />
        </div>
        <div className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#249A96] tracking-wider uppercase">
          <Award className="w-4 h-4 text-[#249A96]" />
          <span>UnivaBio Initiative · Health Literacy & Patient Care</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#153B50] tracking-tight">
          About DermaDetect AI
        </h1>
        <p className="text-base sm:text-lg text-[#687986] leading-relaxed max-w-2xl mx-auto">
          A thoughtful health-awareness platform created to help individuals understand unfamiliar symptoms and skin concerns calmly before visiting a licensed physician.
        </p>
      </motion.div>

      {/* All 3 Clinical Videos Running Automatically in a Smooth Visual Showcase */}
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
      <MedicalCard padding="lg" className="space-y-4 text-center">
        <MedicalBadge tone="teal">Our Mission</MedicalBadge>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#153B50]">
          Why We Built DermaDetect AI
        </h2>
        <p className="text-sm sm:text-base text-[#253746] leading-relaxed max-w-3xl mx-auto">
          Millions of people notice unfamiliar skin spots or physical symptoms each year. Searching online often leads to overwhelming or alarming results—causing unnecessary worry or delaying care when a doctor visit is truly needed.
        </p>
        <p className="text-sm sm:text-base text-[#687986] leading-relaxed max-w-3xl mx-auto">
          <strong>DermaDetect AI</strong> was created as a calm, supportive companion. By combining visual skin observation with step-by-step symptom questions, it offers balanced educational insights that prepare patients for productive conversations with their doctors.
        </p>
      </MedicalCard>

      {/* 4 Core Clinical Commitments */}
      <section className="space-y-6">
        <div className="space-y-2 max-w-2xl mx-auto text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#249A96] inline-flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4" />
            <span>Patient Care Standards</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#153B50]">
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
            <MedicalCard key={item.title} className="space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#153B50]">{item.title}</h4>
              <p className="text-xs sm:text-sm text-[#687986] leading-relaxed">
                {item.desc}
              </p>
            </MedicalCard>
          ))}
        </div>
      </section>

      {/* Privacy & Clinical Scope Banner */}
      <div className="bg-[#153B50] text-white rounded-3xl p-8 sm:p-10 space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#249A96]/30 text-[#E9F7F5] flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-white">
          Private by Design
        </h3>
        <p className="text-sm text-[#E9F7F5]/90 leading-relaxed max-w-3xl mx-auto">
          All symptom answers and uploaded skin photographs are reviewed in temporary memory and cleared immediately after your summary is generated. DermaDetect AI is an educational resource and does not replace a physical examination by a licensed physician.
        </p>
      </div>
    </div>
  );
};
