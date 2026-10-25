import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  Stethoscope,
  Camera,
  ShieldCheck,
  ShieldAlert,
  Lock,
  ChevronDown,
  ChevronUp,
  FileText,
  User,
  Activity,
  Scan,
  Sparkles,
  CheckCircle2,
  Brain,
  Zap,
  Star,
  Quote,
  Clock,
  ExternalLink,
  Award,
  Search,
  Layers,
  HeartHandshake,
  TrendingUp,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import heroPosterImg from '../assets/images/derm_hero_consultation_1791868208694.jpg';
import sampleEczemaImg from '../assets/images/derm_sample_eczema_1791868207802.jpg';
import sampleNevusImg from '../assets/images/derm_sample_nevus_1791868208738.jpg';
import sampleUrticariaImg from '../assets/images/derm_sample_urticaria_1791868208383.jpg';
import {
  clinicalOverviewVideo,
  skinAnalysisVideo,
  systemicTriageVideo,
  CLINICAL_VIDEOS_LIST,
} from '../assets/videos';
import { checkSymptoms, analyzeSkin } from '../services/api';
import { SymptomReport, SkinReport } from '../types/health';
import {
  MedicalButton,
  MedicalCard,
  MedicalInput,
  MedicalAlert,
  MedicalUploadDropzone,
  MedicalVideoShowcase,
  MedicalAnalysisSkeleton,
} from '../components/ui/MedicalUI';
import { ProfessionalMedicalReport } from '../components/ProfessionalMedicalReport';

interface HomeProps {
  onNavigate: (tab: string) => void;
  onOpenEmergencyModal: () => void;
  onSaveSymptomReport?: (report: SymptomReport) => void;
  onSaveSkinReport?: (report: SkinReport, imageUrl?: string) => void;
}

const QUICK_SYMPTOM_CHOICES = [
  {
    id: 'Itchy or dry skin patch',
    label: 'Itchy or dry skin patch',
    hint: 'Redness, dry scaling, or localized itching',
    symptoms: ['Skin Rash / Redness', 'Itching / Pruritus'],
  },
  {
    id: 'Fever, chills, or body aches',
    label: 'Fever, chills, or body aches',
    hint: 'Elevated temperature, fatigue, or muscle soreness',
    symptoms: ['Fever / Chills', 'Fatigue / Exhaustion', 'Body / Muscle Aches'],
  },
  {
    id: 'Sore throat or cough',
    label: 'Sore throat or cough',
    hint: 'Throat irritation or persistent cough',
    symptoms: ['Sore Throat', 'Persistent Cough', 'Runny / Stuffy Nose'],
  },
  {
    id: 'Headache or sinus pressure',
    label: 'Headache or sinus pressure',
    hint: 'Forehead, temple, or facial pressure',
    symptoms: ['Headache', 'Dizziness / Lightheadedness'],
  },
  {
    id: 'Upset stomach or nausea',
    label: 'Upset stomach or nausea',
    hint: 'Stomach discomfort or mild cramping',
    symptoms: ['Nausea / Upset Stomach', 'Abdominal Pain / Cramping'],
  },
  {
    id: 'Sudden red bumps or hives',
    label: 'Sudden red bumps or hives',
    hint: 'Raised itchy welts on the skin',
    symptoms: ['Hives (Urticaria)', 'Itching / Pruritus', 'Skin Rash / Redness'],
  },
];

const QUICK_DURATION_CHOICES = [
  { id: '< 24 hours', label: 'Less than 24 hours', sub: 'Started today' },
  { id: '2-3 days',   label: '2 to 4 days',        sub: 'Recent onset' },
  { id: '1-2 weeks',  label: '1 to 2 weeks',       sub: 'Ongoing several days' },
  { id: '> 2 weeks',  label: 'Over 2 weeks',       sub: 'Persistent or recurring' },
];

const SAMPLE_SKIN_PRESETS = [
  {
    id: 'eczema',
    label: 'Atopic Dermatitis',
    duration: '1-4 weeks',
    location: 'Arms or Hands',
    notes: 'Dry, red scaly patch on inner arm with intermittent itching.',
    image: sampleEczemaImg,
  },
  {
    id: 'nevus',
    label: 'Pigmented Mole',
    duration: '> 1 month',
    location: 'Back or Shoulders',
    notes: 'Two-toned pigmented spot noticed on upper shoulder.',
    image: sampleNevusImg,
  },
  {
    id: 'hives',
    label: 'Acute Urticaria',
    duration: '< 24 hours',
    location: 'Arms or Hands',
    notes: 'Sudden raised red welts with itching.',
    image: sampleUrticariaImg,
  },
];

const TESTIMONIALS = [
  {
    quote:
      'I was anxious about a new, irregularly shaped mole on my shoulder. DermaDetect broke down the ABCDE criteria in seconds and formulated concise questions for my dermatologist, who confirmed it was an early atypical nevus.',
    author: 'Sarah M.',
    role: 'Verified Patient',
    initials: 'SM',
    bg: 'bg-rose-100 text-rose-700',
  },
  {
    quote:
      'As an urgent care resident, I love seeing patients walk in with the DermaDetect printable report. It provides structured symptom timelines and allergies clearly, saving 5-10 minutes of intake questioning.',
    author: 'Dr. Julian Vance, MD',
    role: 'Emergency Medicine Resident',
    initials: 'JV',
    bg: 'bg-amber-100 text-amber-700',
  },
  {
    quote:
      'The multi-turn AI doctor (Dr. Fizza) explained the difference between hives and contact dermatitis in plain language without medical jargon. It gave me immediate calm when my daughter developed sudden red welts.',
    author: 'Liam & Emily K.',
    role: 'Parents & Caregivers',
    initials: 'LK',
    bg: 'bg-orange-100 text-orange-700',
  },
  {
    quote:
      'The privacy policy is what sold me. In-memory processing and zero image retention mean I can check intimate skin rashes without worrying about photographs being saved on remote servers.',
    author: 'Elena R.',
    role: 'Privacy Advocate & User',
    initials: 'ER',
    bg: 'bg-purple-100 text-purple-700',
  },
  {
    quote:
      'I had a persistent cough and sore throat. The symptom checker immediately noted which exams my primary physician would need (throat swab, vitals) and reminded me of red-flag breathing warnings.',
    author: 'Marcus Chen',
    role: 'Verified Patient',
    initials: 'MC',
    bg: 'bg-emerald-100 text-emerald-700',
  },
  {
    quote:
      'The deterministic offline knowledge engine is remarkable. Even when internet was spotty during travel, the symptom checker worked seamlessly without dropping the emergency safeguard checklist.',
    author: 'Priya Patel',
    role: 'Global Traveler',
    initials: 'PP',
    bg: 'bg-blue-100 text-blue-700',
  },
];

const FAQ_ITEMS = [
  {
    question: 'How does DermaDetect AI protect my health data and skin photographs?',
    answer:
      'All uploaded skin photographs and symptom descriptions are evaluated in volatile memory. No images or personal health identifiers are ever stored in permanent databases, disk caches, or shared with third parties.',
  },
  {
    question: 'Does this platform provide a definitive medical diagnosis?',
    answer:
      'No. DermaDetect AI provides educational health possibilities and clinical triage guidance. It is designed to prepare you for a physician visit, not replace an in-person examination, dermoscopy, or laboratory biopsy.',
  },
  {
    question: 'What is the difference between the Symptom Checker and Skin Analysis?',
    answer:
      'The Symptom Checker evaluates systemic physical complaints (fever, cough, headaches, abdominal discomfort) through guided triage, whereas Skin Analysis examines photographic lesion morphology (ABCDE criteria, pigmentation, borders, and erythema).',
  },
  {
    question: 'When should I seek immediate emergency medical care?',
    answer:
      'If you experience severe chest pressure, acute shortness of breath, sudden unilateral facial/arm weakness, slurred speech, or anaphylactic lip/throat swelling, call emergency services (911 / 112) immediately.',
  },
];

/* ── Scroll Reveal Helper ── */
const FadeUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const HomePage: React.FC<HomeProps> = ({
  onNavigate,
  onOpenEmergencyModal,
  onSaveSymptomReport,
  onSaveSkinReport,
}) => {
  const [activeToolTab, setActiveToolTab] = useState<'symptoms' | 'skin'>('symptoms');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [selectedChoice, setSelectedChoice] = useState(QUICK_SYMPTOM_CHOICES[0]);
  const [customNotes, setCustomNotes] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('2-3 days');
  const [selectedSeverity, setSelectedSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');

  const [skinPreview, setSkinPreview] = useState<string | null>(sampleEczemaImg);
  const [skinNotes, setSkinNotes] = useState<string>(SAMPLE_SKIN_PRESETS[0].notes);
  const [skinDuration, setSkinDuration] = useState<string>('1-4 weeks');
  const [skinLocation, setSkinLocation] = useState<string>('Arms or Hands');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [symptomResult, setSymptomResult] = useState<SymptomReport | null>(null);
  const [skinResult, setSkinResult] = useState<SkinReport | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const assessmentRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleRunSymptomAssessment = async () => {
    setIsAnalyzing(true);
    setErrorNotice(null);
    setSkinResult(null);

    try {
      const report = await checkSymptoms({
        patientName: patientName.trim() || undefined,
        patientAge: patientAge.trim() ? `${patientAge.trim()} years` : 'Adult',
        patientGender: patientGender.trim() || 'Not specified',
        mainComplaint: customNotes.trim() || selectedChoice.label,
        symptoms: selectedChoice.symptoms,
        description: customNotes.trim() || `${selectedChoice.label} (${selectedChoice.hint})`,
        duration: selectedDuration,
        severity: selectedSeverity,
        progression: 'gradual',
        ageGroup: patientAge.trim() ? `${patientAge.trim()} years` : 'adult',
        biologicalSex: patientGender.trim() || 'prefer-not-to-say',
        relevantConditions: ['No chronic conditions reported'],
        knownAllergies: 'No known drug allergies',
        hasEmergencySymptoms: false,
      });
      const enrichedReport: SymptomReport = {
        ...report,
        patientName: patientName.trim() || report.patientName,
        patientAge: patientAge.trim() ? `${patientAge.trim()} years` : report.patientAge || 'Adult',
        patientGender: patientGender.trim() || report.patientGender || 'Not specified',
      };
      setSymptomResult(enrichedReport);
      if (onSaveSymptomReport) onSaveSymptomReport(enrichedReport);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setErrorNotice(err.message || 'Unable to complete assessment. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSkinFileUpload = (file: File) => {
    setErrorNotice(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) setSkinPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRunSkinAnalysis = async () => {
    if (!skinPreview) {
      setErrorNotice('Please upload a skin photograph or select a reference case below.');
      return;
    }
    setIsAnalyzing(true);
    setErrorNotice(null);
    setSymptomResult(null);

    let payloadBase64 = skinPreview.trim();
    if (
      !payloadBase64.startsWith('data:') &&
      (payloadBase64.startsWith('/') || payloadBase64.startsWith('http'))
    ) {
      try {
        const resp = await fetch(payloadBase64);
        const blob = await resp.blob();
        payloadBase64 = await new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = (e) => resolve((e.target?.result as string) || payloadBase64);
          r.onerror = () => resolve(payloadBase64);
          r.readAsDataURL(blob);
        });
      } catch {
        // Fall back to direct path
      }
    }

    try {
      const report = await analyzeSkin({
        patientName: patientName.trim() || undefined,
        patientAge: patientAge.trim() ? `${patientAge.trim()} years` : 'Adult',
        patientGender: patientGender.trim() || 'Not specified',
        imageBase64: payloadBase64,
        mimeType: 'image/jpeg',
        notes: skinNotes,
        bodyLocation: skinLocation,
        duration: skinDuration,
        symptoms: ['Itching / Pruritus'],
        changesOverTime: 'Stable / No recent changes noticed',
      });
      const enrichedReport: SkinReport = {
        ...report,
        patientName: patientName.trim() || report.patientName,
        patientAge: patientAge.trim() ? `${patientAge.trim()} years` : report.patientAge || 'Adult',
        patientGender: patientGender.trim() || report.patientGender || 'Not specified',
      };
      setSkinResult(enrichedReport);
      if (onSaveSkinReport) onSaveSkinReport(enrichedReport, skinPreview);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setErrorNotice(err.message || 'Unable to analyze skin photograph. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scrollToAssessment = () => {
    assessmentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-0 text-slate-800">
      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — RADIANT SUNSET HERO (REFERENCE DESIGN)
          ═══════════════════════════════════════════════════════ */}
      <section className="sunset-hero-bg pt-28 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-32 overflow-hidden text-center">
        {/* Subtle dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid-white opacity-25 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] font-display"
          >
            Clinical Clarity for Your
            <br />
            <span className="text-white drop-shadow-sm">Health &amp; Skin Concerns</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-white/90 font-medium leading-relaxed"
          >
            Transforming everyday physiological symptoms and skin lesions into calm, structured insights
            grounded in recognized clinical guidelines. Private, secure, and doctor-ready in minutes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <button
              type="button"
              onClick={scrollToAssessment}
              className="btn-pill btn-pill-white text-sm sm:text-base px-8 py-3.5 font-extrabold shadow-xl cursor-pointer flex items-center gap-2 group"
            >
              <span>Start Clinical Assessment</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('doctor')}
              className="btn-pill btn-pill-glass text-sm sm:text-base px-8 py-3.5 font-semibold cursor-pointer flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Consult Dr. Fizza, MD</span>
            </button>
          </motion.div>
        </div>

        {/* ── FLOATING DASHBOARD SHOWCASE (REFERENCE DESIGN) ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16"
        >
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-4 sm:p-6 lg:p-8 shadow-[0_25px_70px_-15px_rgba(216,30,91,0.25)] border border-white/60">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {/* Card 1: Clinical Triage Metric Curve */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Triage Alignment
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> 98.4%
                    </span>
                  </div>
                  <div className="text-2xl font-black text-[#10264D] mt-1 font-display">
                    Structured Clinical
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Differential considerations mapped</p>
                </div>

                {/* Mini SVG Sparkline */}
                <div className="mt-4 pt-3 border-t border-slate-50">
                  <svg className="w-full h-12" viewBox="0 0 100 35" fill="none">
                    <path
                      d="M0 28 C 20 28, 30 15, 50 18 C 70 21, 80 8, 100 6"
                      stroke="#FA4B4B"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0 28 C 20 28, 30 15, 50 18 C 70 21, 80 8, 100 6 L 100 35 L 0 35 Z"
                      fill="url(#sparkline-grad)"
                      opacity="0.15"
                    />
                    <defs>
                      <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FA4B4B" />
                        <stop offset="100%" stopColor="#FA4B4B" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>Intake</span>
                    <span>Evaluation</span>
                    <span>Triage</span>
                  </div>
                </div>
              </div>

              {/* Card 2: ABCDE Lesion Scanner Progress */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    ABCDE Lesion Scan
                  </span>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                </div>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Asymmetry</span>
                      <span className="font-bold text-slate-800">Symmetric (96%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full w-[96%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Border</span>
                      <span className="font-bold text-slate-800">Well-Defined</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full w-[92%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Color Variegation</span>
                      <span className="font-bold text-slate-800">Monochromatic</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full w-[88%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Donut Clarity Gauge */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#d81e5b]"
                      strokeDasharray="94, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-slate-800 leading-none">94%</span>
                    <span className="text-[9px] text-slate-400 font-semibold">Clarity</span>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-700 mt-2">Low Risk Level</div>
                <span className="text-[10px] text-slate-400">Outpatient Consultation</span>
              </div>

              {/* Card 4: Doctor Prep Checklist */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Physician Prep
                    </span>
                    <Award className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="space-y-1.5 mt-2.5">
                    {[
                      '4 Custom Doctor Questions',
                      'Timeline & Progression',
                      'Allergy Cross-Check',
                      'Printable PDF Ready',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-50 mt-2">
                  Zero Photos Saved • Ephemeral Session
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — SOCIAL PROOF / ASSOCIATION BANNER
          ═══════════════════════════════════════════════════════ */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Grounded in Recognized Medical Standards &amp; Clinical Guidelines
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'AAD Dermatology', desc: 'Melanoma Criteria', color: 'text-rose-600', bg: 'bg-rose-50/60' },
              { name: 'MedlinePlus (NIH)', desc: 'Authoritative Grounding', color: 'text-blue-600', bg: 'bg-blue-50/60' },
              { name: 'Stanford Medicine', desc: 'Differential Protocols', color: 'text-amber-600', bg: 'bg-amber-50/60' },
              { name: 'WHO Standards', desc: 'Primary Care Guidance', color: 'text-emerald-600', bg: 'bg-emerald-50/60' },
              { name: 'CDC Protocols', desc: 'Health Alert Network', color: 'text-purple-600', bg: 'bg-purple-50/60' },
            ].map((partner, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/70 hover:border-slate-300 rounded-2xl p-3.5 shadow-xs transition-all hover:-translate-y-1 flex flex-col items-center justify-center text-center group cursor-default"
              >
                <span className={`text-xs font-black tracking-tight ${partner.color} group-hover:scale-105 transition-transform`}>
                  {partner.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {partner.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — BENTO GRID / CORE FEATURES
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-[#FCFDFE]" id="features">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#10264D] tracking-tight font-display">
              Everything You Need to Build Better Health Clarity with AI
            </h2>
            <p className="text-base text-slate-500 font-medium leading-relaxed">
              Streamline health doubts, explore symptoms, and prep for doctor visits with our all-in-one clinical screening platform.
            </p>
          </div>

          {/* 4 Bento Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bento 1: Centralized Symptom Triage */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col justify-between hover:shadow-xl transition-all group bg-dot-grid">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#d81e5b] flex items-center justify-center font-bold">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#10264D] tracking-tight font-display">
                  Multi-Step Symptom Checker
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Capture your primary complaint, duration, progression, and severity. Formulate structured differential considerations and self-care steps cross-checked against your allergies.
                </p>

                {/* Visual UI Snippet */}
                <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/60 space-y-2 mt-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Chief Complaint: Itchy Skin Patch</span>
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Evaluated</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Possibility 1: Atopic Dermatitis (Eczema) • Possibility 2: Contact Dermatitis
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate('symptoms')}
                  className="text-sm font-bold text-[#d81e5b] hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Symptom Checker</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Bento 2: Dermatological Computer Vision */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col justify-between hover:shadow-xl transition-all group bg-dot-grid">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <Scan className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#10264D] tracking-tight font-display">
                  Visual Skin &amp; Lesion Analysis
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Inspect photographic lesion characteristics using the ABCDE screening protocol. Identify surface texture, color uniformity, and border regularities with zero photo storage.
                </p>

                {/* Visual UI Snippet */}
                <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/60 flex items-center gap-4 mt-4">
                  <img
                    src={sampleNevusImg}
                    alt="Nevus thumbnail"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-300 shrink-0"
                  />
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-slate-800">ABCDE Benchmark Review</div>
                    <div className="text-slate-500">Asymmetry: Low • Border: Regular • Diameter: 4.2mm</div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate('skin')}
                  className="text-sm font-bold text-[#d81e5b] hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Launch Skin Scanner</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Bento 3: Doctor Discussion Preparation Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col justify-between hover:shadow-xl transition-all group bg-dot-grid">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#10264D] tracking-tight font-display">
                  Physician Consultation Summary
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Generate an exportable clinical summary card complete with customized questions to ask your doctor. Download as a high-resolution printable PDF or copy directly to clipboard.
                </p>

                {/* Visual UI Snippet */}
                <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/60 space-y-1.5 mt-4 text-xs">
                  <div className="font-bold text-slate-800">Sample Doctor Question:</div>
                  <p className="text-slate-600 italic">
                    "Could this intermittent flare-up be triggered by contact allergies or seasonal changes?"
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate('results')}
                  className="text-sm font-bold text-[#d81e5b] hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Sample Report</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Bento 4: 24/7 AI Bedside Doctor (Dr. Fizza) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col justify-between hover:shadow-xl transition-all group bg-dot-grid">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#10264D] tracking-tight font-display">
                  Dr. Fizza, MD — AI Clinical Educator
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  An always-available bedside companion ready to answer follow-up questions, explain complex medical terminology in plain language, and link authoritative references.
                </p>

                {/* Visual UI Snippet */}
                <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/60 flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    DF
                  </div>
                  <div className="text-xs space-y-0.5">
                    <div className="font-bold text-slate-800">Dr. Fizza, MD</div>
                    <div className="text-slate-500">"Let's review what comfort measures can ease your symptoms..."</div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate('doctor')}
                  className="text-sm font-bold text-[#d81e5b] hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Chat with Dr. Fizza</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — 6-CARD FEATURE MATRIX (REFERENCE STYLE)
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#10264D] tracking-tight font-display">
              If Everything Else Is Smarter, Why Not Your Health Check?
            </h2>
            <p className="text-base text-slate-500 font-medium leading-relaxed">
              Equipped with deep healthcare guardrails and state-of-the-art vision intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-5 h-5 text-rose-600" />,
                title: 'Quick Triage Actions',
                desc: 'Assess systemic symptoms and identify acute alarm signs in under 60 seconds.',
                bg: 'bg-rose-50',
              },
              {
                icon: <Scan className="w-5 h-5 text-orange-600" />,
                title: 'Automated ABCDE Scoring',
                desc: 'Evaluates asymmetry, border irregularity, and color variation from skin photos.',
                bg: 'bg-orange-50',
              },
              {
                icon: <Stethoscope className="w-5 h-5 text-amber-600" />,
                title: 'Bedside AI Consultation',
                desc: 'Empathetic guidance explaining diagnoses, medication warnings, and non-drug care.',
                bg: 'bg-amber-50',
              },
              {
                icon: <Lock className="w-5 h-5 text-purple-600" />,
                title: 'Zero Image Retention',
                desc: 'Uploaded photos are processed in memory and never persisted to disks or databases.',
                bg: 'bg-purple-50',
              },
              {
                icon: <FileText className="w-5 h-5 text-blue-600" />,
                title: 'Doctor Summary Sheet',
                desc: 'Hospital-grade consultation card with targeted questions for your physician.',
                bg: 'bg-blue-50',
              },
              {
                icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
                title: 'Emergency Safeguards',
                desc: 'Automatic red-flag detection guiding high-risk patients to call 911 / 112 instantly.',
                bg: 'bg-red-50',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200/70 hover:border-slate-300 shadow-sm hover:shadow-md transition-all group text-left space-y-3"
              >
                <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                  {card.icon}
                </div>
                <h4 className="text-lg font-bold text-[#10264D] tracking-tight">{card.title}</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — INTERACTIVE QUICK ASSESSMENT RUNNER
          ═══════════════════════════════════════════════════════ */}
      <section ref={assessmentRef} id="free-check" className="py-20 lg:py-28 bg-[#FCFDFE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="section-label">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Healthcare Lab
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10264D] tracking-tight font-display">
              Run Your Assessment Right Now
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
              Select your concern below. Experience how quickly DermaDetect AI structures clinical information.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex justify-center">
            <div className="bg-slate-200/80 p-1 rounded-full flex gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setActiveToolTab('symptoms');
                  setErrorNotice(null);
                }}
                className={`btn-pill px-6 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeToolTab === 'symptoms'
                    ? 'btn-pill-white text-[#d81e5b] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Symptom Triage</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveToolTab('skin');
                  setErrorNotice(null);
                }}
                className={`btn-pill px-6 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeToolTab === 'skin'
                    ? 'btn-pill-white text-[#d81e5b] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Scan className="w-4 h-4" />
                <span>Skin Lesion Scanner</span>
              </button>
            </div>
          </div>

          {/* Interactive Tool Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
            {errorNotice && (
              <MedicalAlert tone="urgent" title="Assessment Notice">
                {errorNotice}
              </MedicalAlert>
            )}

            {activeToolTab === 'symptoms' ? (
              /* Symptom Check Mode */
              <div className="space-y-6 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    1. Select Common Presentation
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {QUICK_SYMPTOM_CHOICES.map((choice) => (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => setSelectedChoice(choice)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedChoice.id === choice.id
                            ? 'border-[#d81e5b] bg-rose-50/50 text-[#d81e5b] shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <div className="font-bold text-sm">{choice.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{choice.hint}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      2. Duration
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_DURATION_CHOICES.map((dur) => (
                        <button
                          key={dur.id}
                          type="button"
                          onClick={() => setSelectedDuration(dur.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedDuration === dur.id
                              ? 'border-[#d81e5b] bg-rose-50/50 text-[#d81e5b] font-bold'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs'
                          }`}
                        >
                          <div className="text-xs">{dur.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      3. Additional Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="e.g., mild itching, worse in the evening"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#d81e5b]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={handleRunSymptomAssessment}
                  className="btn-pill btn-pill-coral w-full py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Synthesizing Clinical Insights...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4" />
                      <span>Evaluate Reported Symptoms</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Skin Analysis Mode */
              <div className="space-y-6 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    1. Select a Sample Lesion or Upload Photograph
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {SAMPLE_SKIN_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSkinPreview(preset.image);
                          setSkinNotes(preset.notes);
                          setSkinDuration(preset.duration);
                          setSkinLocation(preset.location);
                        }}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center gap-2 ${
                          skinPreview === preset.image
                            ? 'border-[#d81e5b] bg-rose-50/50 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <img
                          src={preset.image}
                          alt={preset.label}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                        />
                        <div className="text-center">
                          <div className="font-bold text-xs text-slate-800">{preset.label}</div>
                          <div className="text-[10px] text-slate-400">{preset.location}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Or Upload Skin Photo (Private &amp; In-Memory)
                  </label>
                  <MedicalUploadDropzone
                    previewUrl={skinPreview}
                    onFileSelect={handleSkinFileUpload}
                    onClear={() => setSkinPreview(null)}
                  />
                </div>

                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={handleRunSkinAnalysis}
                  className="btn-pill btn-pill-coral w-full py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing Lesion Morphology...</span>
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4" />
                      <span>Analyze Skin Photograph</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Generated Result Container */}
          <div ref={resultsRef}>
            {isAnalyzing && (
              <MedicalAnalysisSkeleton
                title="Synthesizing Clinical Possibilities..."
                subtitle="Cross-referencing symptom clusters and medical safety standards"
              />
            )}

            {symptomResult && !isAnalyzing && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#10264D]">Generated Consultation Sheet</h3>
                  <button
                    type="button"
                    onClick={() => onNavigate('results')}
                    className="text-xs font-bold text-[#d81e5b] hover:underline"
                  >
                    Open in Full Viewer →
                  </button>
                </div>
                <ProfessionalMedicalReport
                  type="symptom"
                  symptomReport={symptomResult}
                  onStartNew={() => setSymptomResult(null)}
                />
              </div>
            )}

            {skinResult && !isAnalyzing && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#10264D]">Generated Skin Screening Report</h3>
                  <button
                    type="button"
                    onClick={() => onNavigate('results')}
                    className="text-xs font-bold text-[#d81e5b] hover:underline"
                  >
                    Open in Full Viewer →
                  </button>
                </div>
                <ProfessionalMedicalReport
                  type="skin"
                  skinReport={skinResult}
                  previewImageUrl={skinPreview || undefined}
                  onStartNew={() => setSkinResult(null)}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 — TESTIMONIALS WALL (REFERENCE STYLE)
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#10264D] tracking-tight font-display">
              See What Our Community Is Saying
            </h2>
            <p className="text-base text-slate-500 font-medium leading-relaxed">
              Read how patients, clinicians, and parents use DermaDetect AI for calm, informed healthcare decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-slate-200/70 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left space-y-4"
              >
                <div className="space-y-3">
                  {/* Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center font-bold text-xs shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#10264D]">{t.author}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 7 — VIDEO DEMO SHOWCASE
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-[#FCFDFE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10264D] tracking-tight font-display">
              See the Platform in Action
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              Watch real-time clinical triage, lesion computer vision, and patient report generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLINICAL_VIDEOS_LIST.map((video) => (
              <MedicalVideoShowcase
                key={video.id}
                src={video.src}
                badgeText={video.category}
                title={video.title}
                subtitle={video.subtitle}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 8 — FREQUENTLY ASKED QUESTIONS
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-[#10264D] font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500">
              Clear answers regarding privacy, accuracy, and clinical guidelines.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full px-5 py-4 text-left font-bold text-sm sm:text-base text-[#10264D] flex items-center justify-between gap-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 9 — RADIANT SUNSET CTA BANNER (REFERENCE DESIGN)
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sunset-card-gradient sunset-glow rounded-3xl p-8 sm:p-14 lg:p-16 text-center text-white space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-dot-grid-white opacity-20 pointer-events-none" />

            <div className="relative max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-display">
                AI-Driven Healthcare, One Platform, Endless Peace of Mind.
              </h2>
              <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">
                Start checking symptoms or scan skin concerns in minutes. Completely free, private, and confidential.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={scrollToAssessment}
                  className="btn-pill btn-pill-white text-xs sm:text-sm px-8 py-3.5 font-bold shadow-xl cursor-pointer"
                >
                  Start Free Assessment
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('doctor')}
                  className="btn-pill btn-pill-glass text-xs sm:text-sm px-8 py-3.5 font-semibold cursor-pointer"
                >
                  Consult Dr. Fizza, MD
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
