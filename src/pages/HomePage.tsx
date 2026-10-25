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
  { id: '1-2 weeks',  label: '1 to 2 weeks',        sub: 'Ongoing for several days' },
  { id: '> 2 weeks',  label: 'Over 2 weeks',         sub: 'Persistent or recurring' },
];

const SAMPLE_SKIN_PRESETS = [
  {
    id: 'eczema',
    label: 'Atopic Dermatitis',
    duration: '1-4 weeks',
    location: 'Arms or Hands',
    notes: 'Dry, red scaly patch on the inner arm with intermittent itching.',
    image: sampleEczemaImg,
  },
  {
    id: 'nevus',
    label: 'Pigmented Mole',
    duration: '> 1 month',
    location: 'Back or Shoulders',
    notes: 'Two-toned pigmented spot noticed on the upper shoulder.',
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

const FAQ_ITEMS = [
  {
    question: 'How does DermaDetect AI protect my health data and skin photographs?',
    answer:
      'All uploaded skin photographs and symptom descriptions are evaluated with complete patient confidentiality. No images or personal health identifiers are ever stored in permanent databases or shared with third parties.',
  },
  {
    question: 'Does this platform provide a definitive medical diagnosis?',
    answer:
      'No. DermaDetect AI provides educational health information and preliminary possibilities. It does not replace an in-person clinical evaluation, dermoscopy, or tissue biopsy by a licensed physician.',
  },
  {
    question: 'What is the difference between the Symptom Checker and Skin Analysis?',
    answer:
      'The Symptom Checker evaluates general physical complaints (such as fever, sore throat, headache, or digestive symptoms) through step-by-step questions, while Skin Analysis inspects visible surface features (color, border regularity, scaling, and ABCDE criteria) from a photograph.',
  },
  {
    question: 'When should I seek immediate emergency medical care?',
    answer:
      'If you experience chest pain or pressure, severe shortness of breath, facial or throat swelling, sudden weakness on one side, or a rapidly spreading purple rash with high fever, call emergency services (911 / 112) immediately.',
  },
];

/* ── Scroll Reveal Helper ── */
const FadeUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = '',
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
    if (!payloadBase64.startsWith('data:') && (payloadBase64.startsWith('/') || payloadBase64.startsWith('http'))) {
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
        // Fall back to server disk resolution
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

  return (
    <div className="space-y-0">

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — PREMIUM HERO
          ═══════════════════════════════════════════════════════ */}
      <section className="relative bg-white overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Decorative background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-[#EAF2FF] opacity-60 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-[#DDF7FA] opacity-40 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-[200px] h-[200px] rounded-full bg-[#F0F5FF] opacity-50 blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* ── Left: Headline + CTAs ── */}
            <div className="space-y-8 text-left">
              {/* Label pill */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="section-label">
                  <Sparkles className="w-3 h-3" />
                  AI-Powered Health Platform
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-extrabold text-[#10264D] tracking-tight leading-[1.1] font-display"
                style={{ textWrap: 'balance' } as React.CSSProperties}
              >
                Smarter Health Insights.{' '}
                <span className="text-[#2458F5]">Better Understanding.</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg text-[#64748B] leading-relaxed max-w-lg"
              >
                Explore your symptoms, understand skin concerns, and discover helpful health
                information with AI-powered guidance — built for clarity and your privacy.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-3"
              >
                <MedicalButton
                  variant="blue"
                  size="lg"
                  icon={<Stethoscope className="w-5 h-5" />}
                  onClick={() => onNavigate('symptoms')}
                >
                  Check Symptoms
                </MedicalButton>
                <MedicalButton
                  variant="outline"
                  size="lg"
                  icon={<Camera className="w-5 h-5" />}
                  onClick={() => onNavigate('skin')}
                >
                  Analyse Skin
                </MedicalButton>
              </motion.div>

              {/* Trust signals */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.36 }}
                className="flex flex-wrap items-center gap-5 pt-2 text-sm text-[#64748B] border-t border-[#E7EDF5]"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2458F5] shrink-0" />
                  Educational, not a diagnosis
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#2458F5] shrink-0" />
                  Zero data retention
                </span>
                <button
                  type="button"
                  onClick={onOpenEmergencyModal}
                  className="flex items-center gap-1.5 text-red-500 font-semibold hover:text-red-600 transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  Emergency Signs
                </button>
              </motion.div>
            </div>

            {/* ── Right: 3D Visual Composition ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              {/* Main video frame */}
              <div className="relative rounded-3xl overflow-hidden border border-[#E7EDF5] shadow-[0_24px_64px_rgba(16,38,77,0.14)] bg-[#10264D]">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <video
                    src={clinicalOverviewVideo}
                    poster={heroPosterImg}
                    autoPlay loop muted playsInline preload="auto"
                    onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Scan overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#2458F5]/60 to-transparent animate-scan" />
                </div>
                {/* Bottom caption */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#10264D]/90 to-transparent px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white text-xs font-semibold">AI Analysis Active</span>
                  </div>
                </div>
              </div>

              {/* Floating stat cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-8 top-1/4 card-glass px-4 py-3 min-w-[160px]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="icon-wrap icon-wrap-blue icon-wrap-sm">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B] font-medium">Symptom Check</div>
                    <div className="text-sm font-bold text-[#10264D]">18+ Systems</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -right-6 bottom-1/3 card-glass px-4 py-3 min-w-[170px]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="icon-wrap icon-wrap-sm" style={{ backgroundColor: '#EAF2FF', color: '#2458F5' }}>
                    <Scan className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B] font-medium">Skin Analysis</div>
                    <div className="text-sm font-bold text-[#10264D]">ABCDE Screening</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -right-4 top-6 card-glass px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="text-xs font-semibold text-[#10264D]">Private · Secure</div>
                </div>
              </motion.div>

              {/* Secondary videos grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div
                  onClick={() => onNavigate('skin')}
                  className="group rounded-2xl overflow-hidden border border-[#E7EDF5] bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="aspect-video overflow-hidden bg-[#10264D]">
                    <video
                      src={skinAnalysisVideo}
                      poster={heroPosterImg}
                      autoPlay loop muted playsInline preload="auto"
                      onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="px-4 py-2.5 flex items-center justify-between bg-white">
                    <span className="text-xs font-bold text-[#10264D]">Skin Review</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2458F5] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
                <div
                  onClick={() => onNavigate('symptoms')}
                  className="group rounded-2xl overflow-hidden border border-[#E7EDF5] bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="aspect-video overflow-hidden bg-[#10264D]">
                    <video
                      src={systemicTriageVideo}
                      poster={heroPosterImg}
                      autoPlay loop muted playsInline preload="auto"
                      onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="px-4 py-2.5 flex items-center justify-between bg-white">
                    <span className="text-xs font-bold text-[#10264D]">Symptom Check</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2458F5] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile: simplified video card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:hidden rounded-2xl overflow-hidden border border-[#E7EDF5] shadow-md"
            >
              <div className="aspect-video bg-[#10264D]">
                <video
                  src={clinicalOverviewVideo}
                  poster={heroPosterImg}
                  autoPlay loop muted playsInline preload="auto"
                  onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — AI CAPABILITIES (Asymmetric Feature Cards)
          ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#F7FAFF] border-y border-[#E7EDF5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <FadeUp className="text-center space-y-4">
            <span className="section-label"><Brain className="w-3 h-3" />AI Healthcare Capabilities</span>
            <h2 className="section-title">
              Two AI tools. One clear purpose.
            </h2>
            <p className="section-subtitle mx-auto text-center">
              Explore symptoms or analyse your skin — each tool designed to help you understand your health before your doctor's visit.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Symptom Checker card */}
            <FadeUp delay={0.05}>
              <div
                onClick={() => onNavigate('symptoms')}
                className="group cursor-pointer h-full bg-white rounded-3xl border border-[#E7EDF5] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-8 space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-[#EAF2FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Stethoscope className="w-7 h-7 text-[#2458F5]" />
                    </div>
                    <span className="badge badge-blue">Most Used</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#10264D] font-display">AI Symptom Checker</h3>
                    <p className="text-[#64748B] leading-relaxed">
                      Describe what you're feeling through simple guided questions. Get structured clinical possibilities, self-care guidance, and smart questions to ask your doctor.
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {['18+ symptom systems covered', 'Step-by-step guided questions', 'Printable clinical summary'].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#64748B]">
                        <CheckCircle2 className="w-4 h-4 text-[#2458F5] shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#2458F5] group-hover:gap-3 transition-all">
                    <span>Check My Symptoms</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="h-1.5 bg-gradient-to-r from-[#2458F5] to-[#DDF7FA]" />
              </div>
            </FadeUp>

            {/* Skin Analysis card */}
            <FadeUp delay={0.12}>
              <div
                onClick={() => onNavigate('skin')}
                className="group cursor-pointer h-full bg-white rounded-3xl border border-[#E7EDF5] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-8 space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-[#DDF7FA] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Camera className="w-7 h-7 text-[#0891B2]" />
                    </div>
                    <span className="badge badge-muted">AI Vision</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#10264D] font-display">AI Skin Analysis</h3>
                    <p className="text-[#64748B] leading-relaxed">
                      Upload a clear photo of your skin concern. Our AI performs ABCDE melanoma screening, identifies possible dermatological conditions, and guides next steps.
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {['ABCDE melanoma screening', 'Visible feature morphology analysis', 'Dermatologist Q&A preparation'].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#64748B]">
                        <CheckCircle2 className="w-4 h-4 text-[#0891B2] shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#0891B2] group-hover:gap-3 transition-all">
                    <span>Analyse a Skin Image</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="h-1.5 bg-gradient-to-r from-[#DDF7FA] to-[#2458F5]" />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS (3 Steps)
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <FadeUp className="max-w-2xl mx-auto text-center space-y-4">
            <span className="section-label"><Zap className="w-3 h-3" />How It Works</span>
            <h2 className="section-title">
              From question to clarity in three steps
            </h2>
            <p className="section-subtitle mx-auto text-center">
              Designed for everyday clarity, complete privacy, and calm preparation before your doctor visit.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-[#2458F5]/30 via-[#2458F5]/60 to-[#2458F5]/30 z-0" />

            {[
              {
                num: '01',
                icon: <Stethoscope className="w-6 h-6" />,
                title: 'Describe Your Symptoms',
                desc: 'Answer calm, one-step-at-a-time questions covering what you feel, how long it has lasted, and relevant health context.',
                action: () => onNavigate('symptoms'),
                cta: 'Check My Symptoms',
              },
              {
                num: '02',
                icon: <Camera className="w-6 h-6" />,
                title: 'Upload a Skin Photo',
                desc: 'Share a clear daylight photograph of a skin spot or rash. Your image is evaluated securely in real time with zero permanent storage.',
                action: () => onNavigate('skin'),
                cta: 'Analyse a Skin Image',
              },
              {
                num: '03',
                icon: <FileText className="w-6 h-6" />,
                title: 'Get Clear Insights',
                desc: 'Receive possible causes, gentle self-care tips, warning signs to watch for, and a printable summary for your doctor.',
                action: () => onNavigate('results'),
                cta: 'View Sample Report',
              },
            ].map((item, i) => (
              <FadeUp key={item.num} delay={i * 0.1} className="relative z-10">
                <div className="text-center space-y-4">
                  {/* Step circle */}
                  <div className="relative inline-flex flex-col items-center">
                    <div className="w-20 h-20 rounded-2xl bg-[#EAF2FF] border-2 border-[#DDE8FF] flex items-center justify-center text-[#2458F5] mx-auto shadow-sm">
                      {item.icon}
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#2458F5] text-white text-xs font-bold flex items-center justify-center shadow-md">
                      {item.num.replace('0', '')}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#10264D] font-display">{item.title}</h3>
                    <p className="text-[#64748B] leading-relaxed text-sm">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={item.action}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2458F5] hover:gap-2.5 transition-all cursor-pointer group"
                  >
                    <span>{item.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — VIDEO SHOWCASE
          ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#F7FAFF] border-y border-[#E7EDF5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeUp className="max-w-3xl mx-auto text-center space-y-4">
            <span className="section-label">Designed Around Real Clinical Care</span>
            <h2 className="section-title">
              Supportive health guidance at every stage
            </h2>
            <p className="section-subtitle mx-auto text-center">
              Whether you are checking a new skin spot or trying to understand an ongoing symptom, each tool prepares you for a productive conversation with your physician.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {CLINICAL_VIDEOS_LIST.map((vid, index) => (
              <FadeUp key={vid.id} delay={index * 0.08}>
                <div className="bg-white border border-[#E7EDF5] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                  <MedicalVideoShowcase
                    src={vid.src}
                    poster={heroPosterImg}
                    fallbackImage={heroPosterImg}
                    showOverlayText={false}
                    className="rounded-none border-0 border-b border-[#E7EDF5] shadow-none"
                  />
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-[#2458F5]">{vid.category}</div>
                      <h3 className="text-lg font-bold text-[#10264D] font-display">{vid.title}</h3>
                      <p className="text-sm text-[#64748B] leading-relaxed">{vid.subtitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate(vid.targetTab)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#2458F5] hover:gap-3 transition-all cursor-pointer pt-2 self-start"
                    >
                      <span>{vid.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — INTERACTIVE ASSESSMENT WORKSPACE
          ═══════════════════════════════════════════════════════ */}
      <section ref={assessmentRef} id="free-check" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <FadeUp className="text-center space-y-3 mb-10">
            <span className="section-label">Quick Health Check · 3 Simple Questions</span>
            <h2 className="section-title">Try a free assessment now</h2>
          </FadeUp>

          <div className="bg-white border border-[#E7EDF5] rounded-3xl shadow-md overflow-hidden">
            {/* Tool switcher header */}
            <div className="flex items-center justify-between gap-4 px-8 pt-8 pb-6 border-b border-[#F0F5FF]">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#10264D] font-display">
                  {activeToolTab === 'symptoms'
                    ? "Let's look at your symptoms together"
                    : 'Check a skin concern privately'}
                </h3>
                <p className="text-sm text-[#64748B]">
                  {activeToolTab === 'symptoms'
                    ? 'Complete a quick 3-step check below, or open the full guided questionnaire.'
                    : 'Upload a clear photo or select a sample case to see how our skin review works.'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 bg-[#F7FAFF] rounded-xl border border-[#E7EDF5] shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveToolTab('symptoms')}
                  className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeToolTab === 'symptoms'
                      ? 'bg-[#10264D] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#10264D]'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  Symptoms
                </button>
                <button
                  type="button"
                  onClick={() => setActiveToolTab('skin')}
                  className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeToolTab === 'skin'
                      ? 'bg-[#10264D] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#10264D]'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Skin Analysis
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {errorNotice && (
                <MedicalAlert tone="urgent" title="Notice">{errorNotice}</MedicalAlert>
              )}

              {isAnalyzing && <MedicalAnalysisSkeleton />}

              {/* Patient ID bar */}
              {!isAnalyzing && (
                <div className="p-4 rounded-xl bg-[#F7FAFF] border border-[#E7EDF5] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#10264D]">
                      <User className="w-3.5 h-3.5 text-[#2458F5]" />
                      Patient Details for Medical Report &amp; PDF Export
                    </div>
                    <span className="text-[11px] text-[#64748B]">Included on your downloadable report</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Patient Full Name"
                      className="px-3.5 py-2.5 rounded-xl bg-white border border-[#E7EDF5] focus:border-[#2458F5] focus:outline-none focus:ring-2 focus:ring-[#2458F5]/10 text-xs font-semibold text-[#17253B] placeholder:text-[#94A3B8] transition-all"
                    />
                    <input
                      type="text"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="Age in Years (e.g., 29)"
                      className="px-3.5 py-2.5 rounded-xl bg-white border border-[#E7EDF5] focus:border-[#2458F5] focus:outline-none focus:ring-2 focus:ring-[#2458F5]/10 text-xs font-semibold text-[#17253B] tabular-nums placeholder:text-[#94A3B8] transition-all"
                    />
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-white border border-[#E7EDF5] focus:border-[#2458F5] focus:outline-none focus:ring-2 focus:ring-[#2458F5]/10 text-xs font-semibold text-[#17253B] transition-all"
                    >
                      <option value="">Select Gender...</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other / Non-binary">Other / Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ── TAB A: Rapid Symptom Checker ── */}
              {!isAnalyzing && activeToolTab === 'symptoms' && (
                <div className="space-y-6">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#10264D]">
                      <span>Question {step} of 3</span>
                      <span className="text-[#2458F5] tabular-nums">
                        {step === 1 ? '33%' : step === 2 ? '66%' : '100%'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F7FAFF] border border-[#E7EDF5] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#2458F5] rounded-full"
                        animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="s1"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-5"
                      >
                        <h3 className="text-lg font-bold text-[#10264D]">1. What is bothering you most today?</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {QUICK_SYMPTOM_CHOICES.map((choice) => (
                            <button
                              key={choice.id}
                              type="button"
                              onClick={() => { setSelectedChoice(choice); setStep(2); }}
                              className={`p-4 rounded-xl text-left border-[1.5px] transition-all cursor-pointer ${
                                selectedChoice.id === choice.id
                                  ? 'bg-[#EAF2FF] border-[#2458F5]'
                                  : 'bg-[#F7FAFF] border-[#E7EDF5] hover:border-[#2458F5]'
                              }`}
                            >
                              <div className="text-sm font-bold text-[#10264D] flex items-center justify-between gap-1.5">
                                <span>{choice.label}</span>
                                <ArrowRight className="w-4 h-4 text-[#2458F5] shrink-0" />
                              </div>
                              <div className="text-xs text-[#64748B] mt-1">{choice.hint}</div>
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <div className="flex-1">
                            <MedicalInput
                              placeholder="Or describe how you feel in your own words..."
                              value={customNotes}
                              onChange={(e) => setCustomNotes(e.target.value)}
                            />
                          </div>
                          <MedicalButton variant="navy" onClick={() => setStep(2)}>
                            Continue →
                          </MedicalButton>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="s2"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-5"
                      >
                        <h3 className="text-lg font-bold text-[#10264D]">
                          2. How long have you noticed {customNotes || selectedChoice.label.toLowerCase()}?
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {QUICK_DURATION_CHOICES.map((dur) => (
                            <button
                              key={dur.id}
                              type="button"
                              onClick={() => { setSelectedDuration(dur.id); setStep(3); }}
                              className={`p-4 rounded-xl text-left border-[1.5px] transition-all cursor-pointer flex items-center justify-between ${
                                selectedDuration === dur.id
                                  ? 'bg-[#EAF2FF] border-[#2458F5]'
                                  : 'bg-[#F7FAFF] border-[#E7EDF5] hover:border-[#2458F5]'
                              }`}
                            >
                              <div>
                                <div className="text-sm font-bold text-[#10264D]">{dur.label}</div>
                                <div className="text-xs text-[#64748B] mt-0.5">{dur.sub}</div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-[#2458F5]" />
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <MedicalButton variant="ghost" size="sm" onClick={() => setStep(1)}>← Back</MedicalButton>
                          <MedicalButton variant="navy" size="sm" onClick={() => setStep(3)}>Next →</MedicalButton>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="s3"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-5"
                      >
                        <h3 className="text-lg font-bold text-[#10264D]">3. How much discomfort is it causing you?</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { id: 'mild' as const, label: 'Mild', desc: 'Noticeable, but able to continue daily activities' },
                            { id: 'moderate' as const, label: 'Moderate', desc: 'Uncomfortable and interfering with routine' },
                            { id: 'severe' as const, label: 'Significant', desc: 'Very distressing or difficult to ignore' },
                          ].map((sev) => (
                            <button
                              key={sev.id}
                              type="button"
                              onClick={() => setSelectedSeverity(sev.id)}
                              className={`p-4 rounded-xl text-left border-[1.5px] transition-all cursor-pointer ${
                                selectedSeverity === sev.id
                                  ? 'bg-[#EAF2FF] border-[#2458F5]'
                                  : 'bg-[#F7FAFF] border-[#E7EDF5] hover:border-[#2458F5]'
                              }`}
                            >
                              <div className="text-sm font-bold text-[#10264D]">{sev.label}</div>
                              <div className="text-xs text-[#64748B] mt-1">{sev.desc}</div>
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#F0F5FF]">
                          <MedicalButton variant="ghost" size="sm" onClick={() => setStep(2)}>← Back</MedicalButton>
                          <MedicalButton variant="blue" size="lg" onClick={handleRunSymptomAssessment}>
                            View Health Insights
                          </MedicalButton>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── TAB B: Skin Scanner ── */}
              {!isAnalyzing && activeToolTab === 'skin' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <MedicalUploadDropzone
                      previewUrl={skinPreview}
                      onFileSelect={handleSkinFileUpload}
                      onClear={() => setSkinPreview(null)}
                    />
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-[#64748B] block">Or try a sample photo:</span>
                      <div className="grid grid-cols-3 gap-2">
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
                            className={`p-2 rounded-xl border-[1.5px] text-left transition-all cursor-pointer ${
                              skinPreview === preset.image
                                ? 'border-[#2458F5] bg-[#EAF2FF]/60'
                                : 'border-[#E7EDF5] bg-[#F7FAFF] hover:border-[#2458F5]'
                            }`}
                          >
                            <img
                              src={preset.image}
                              alt={preset.label}
                              referrerPolicy="no-referrer"
                              className="w-full h-14 object-cover rounded-lg mb-1.5"
                            />
                            <div className="text-[11px] font-bold text-[#10264D] line-clamp-1">{preset.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <MedicalInput label="Body Area" value={skinLocation} onChange={(e) => setSkinLocation(e.target.value)} />
                      <MedicalInput label="How Long Present" value={skinDuration} onChange={(e) => setSkinDuration(e.target.value)} />
                    </div>
                    <MedicalInput
                      label="What You Notice (Itching, Dryness, Changes)"
                      value={skinNotes}
                      onChange={(e) => setSkinNotes(e.target.value)}
                    />
                    <div className="p-3.5 rounded-xl bg-[#EAF2FF] text-[#10264D] text-xs flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#2458F5] shrink-0" />
                      <span><strong>Your photo is never stored:</strong> Evaluated privately with zero data retention.</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                      <MedicalButton
                        variant="blue"
                        size="lg"
                        className="flex-1"
                        icon={<Camera className="w-5 h-5" />}
                        onClick={handleRunSkinAnalysis}
                      >
                        Analyse Skin Image
                      </MedicalButton>
                      <MedicalButton variant="outline" size="lg" onClick={() => onNavigate('skin')}>
                        Full Tool →
                      </MedicalButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 — MEDICAL REPORT (conditionally shown)
          ═══════════════════════════════════════════════════════ */}
      {(symptomResult || skinResult) && (
        <section ref={resultsRef} className="bg-[#F7FAFF] py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
            {symptomResult && (
              <ProfessionalMedicalReport
                type="symptom"
                symptomReport={symptomResult}
                intakeContext={{
                  patientName: patientName.trim() || symptomResult.patientName || 'Not Provided (Anonymous)',
                  patientAge: patientAge.trim() ? `${patientAge.trim()} years` : symptomResult.patientAge || 'Adult',
                  patientGender: patientGender.trim() || symptomResult.patientGender || 'Not specified',
                  mainComplaint: customNotes.trim() || selectedChoice.label,
                  symptoms: selectedChoice.symptoms,
                  description: customNotes.trim() || `${selectedChoice.label} (${selectedChoice.hint})`,
                  duration: selectedDuration,
                  severity: selectedSeverity,
                }}
                onStartNew={() => { setSymptomResult(null); setSkinResult(null); setStep(1); }}
              />
            )}
            {skinResult && (
              <ProfessionalMedicalReport
                type="skin"
                skinReport={skinResult}
                previewImageUrl={skinPreview}
                intakeContext={{
                  patientName: patientName.trim() || skinResult.patientName || 'Not Provided (Anonymous)',
                  patientAge: patientAge.trim() ? `${patientAge.trim()} years` : skinResult.patientAge || 'Adult',
                  patientGender: patientGender.trim() || skinResult.patientGender || 'Not specified',
                  description: skinNotes,
                  bodyLocation: skinLocation,
                  duration: skinDuration,
                }}
                onStartNew={() => { setSymptomResult(null); setSkinResult(null); setStep(1); }}
              />
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 7 — TRUST & RESPONSIBLE AI
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-y border-[#E7EDF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <FadeUp className="max-w-2xl mx-auto text-center space-y-4">
            <span className="section-label">Privacy &amp; Patient Safety</span>
            <h2 className="section-title">
              Built on medical privacy, clarity, and responsible care
            </h2>
            <p className="section-subtitle mx-auto text-center">
              DermaDetect AI is designed to inform, not to replace the professional care only a qualified physician can provide.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Lock className="w-6 h-6" />,
                color: '#2458F5',
                bg: '#EAF2FF',
                title: 'Your Photo Is Never Stored',
                desc: 'Skin photographs and symptom details are evaluated in real time and cleared immediately after your clinical report is generated.',
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                color: '#2458F5',
                bg: '#EAF2FF',
                title: 'Information, Not a Diagnosis',
                desc: 'Every summary highlights multiple possibilities and helpful questions so you can have an informed discussion with your doctor.',
              },
              {
                icon: <ShieldAlert className="w-6 h-6" />,
                color: '#DC2626',
                bg: '#FEE2E2',
                title: 'Clear Warning Sign Alerts',
                desc: 'Immediate guidance on when a symptom or changing skin spot warrants prompt in-person medical evaluation.',
              },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.08}>
                <div className="p-7 rounded-2xl bg-[#F7FAFF] border border-[#E7EDF5] space-y-4 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: item.bg, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-[#10264D] font-display">{item.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 8 — FAQ
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#F7FAFF]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
          <FadeUp className="text-center space-y-3">
            <span className="section-label">Common Questions</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </FadeUp>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <FadeUp key={item.question} delay={idx * 0.06}>
                  <div className="bg-white border border-[#E7EDF5] rounded-2xl overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F7FAFF] transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base font-bold text-[#10264D] flex-1">
                        {item.question}
                      </span>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${
                        isOpen ? 'bg-[#EAF2FF] text-[#2458F5]' : 'bg-[#F7FAFF] text-[#64748B]'
                      }`}>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-3 text-sm text-[#64748B] leading-relaxed border-t border-[#F0F5FF]">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 9 — FINAL CTA BANNER
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#10264D] relative overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full bg-[#2458F5]/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#DDF7FA]/10 blur-3xl" />
        </div>

        <FadeUp className="relative max-w-3xl mx-auto px-4 text-center space-y-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2458F5]/20 text-[#EAF2FF] border border-[#2458F5]/30 mb-4">
              <Sparkles className="w-3 h-3" />
              Free to use · No registration required
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
              Start your free health assessment today
            </h2>
            <p className="mt-4 text-[#94A3B8] text-lg leading-relaxed">
              No account needed. Your data stays private. Get helpful insights in minutes.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('symptoms')}
              className="btn btn-primary btn-lg flex items-center gap-2"
            >
              <Stethoscope className="w-5 h-5" />
              Check My Symptoms
            </button>
            <button
              type="button"
              onClick={() => onNavigate('skin')}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[0.9375rem] font-semibold transition-all border border-white/20 cursor-pointer min-h-[58px]"
            >
              <Camera className="w-5 h-5" />
              Analyse Skin Image
            </button>
          </div>
          <p className="text-xs text-[#64748B]">
            DermaDetect AI provides educational health information, not medical diagnoses.
            Always consult a qualified healthcare professional for medical advice.
          </p>
        </FadeUp>
      </section>

    </div>
  );
};
