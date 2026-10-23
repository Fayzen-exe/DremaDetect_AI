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
} from 'lucide-react';
import { motion } from 'motion/react';
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
  { id: '2-3 days', label: '2 to 4 days', sub: 'Recent onset' },
  { id: '1-2 weeks', label: '1 to 2 weeks', sub: 'Ongoing for several days' },
  { id: '> 2 weeks', label: 'Over 2 weeks', sub: 'Persistent or recurring' },
];

const SAMPLE_SKIN_PRESETS = [
  {
    id: 'eczema',
    label: 'Atopic Dermatitis (Eczema)',
    duration: '1-4 weeks',
    location: 'Arms or Hands',
    notes: 'Dry, red scaly patch on the inner arm with intermittent itching.',
    image: sampleEczemaImg,
  },
  {
    id: 'nevus',
    label: 'Pigmented Mole (ABCDE Review)',
    duration: '> 1 month',
    location: 'Back or Shoulders',
    notes: 'Two-toned pigmented spot noticed on the upper shoulder.',
    image: sampleNevusImg,
  },
  {
    id: 'hives',
    label: 'Acute Urticaria (Hives)',
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
      'All uploaded skin photographs and symptom descriptions are processed privately in temporary memory solely to generate your screening report. No images or personal identifiers are stored in databases or shared with third parties.',
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

  // Skin Scanner State
  const [skinPreview, setSkinPreview] = useState<string | null>(sampleEczemaImg);
  const [skinNotes, setSkinNotes] = useState<string>(SAMPLE_SKIN_PRESETS[0].notes);
  const [skinDuration, setSkinDuration] = useState<string>('1-4 weeks');
  const [skinLocation, setSkinLocation] = useState<string>('Arms or Hands');

  // Analysis State
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

    try {
      const report = await analyzeSkin({
        patientName: patientName.trim() || undefined,
        patientAge: patientAge.trim() ? `${patientAge.trim()} years` : 'Adult',
        patientGender: patientGender.trim() || 'Not specified',
        imageBase64: skinPreview,
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
    <div className="space-y-24 pb-20">
      {/* SECTION 1: HOMEPAGE HERO SECTION (Balanced 2-Column Layout + Live 3-Video Visual Mosaic) */}
      <section className="relative bg-white border-b border-[#E2E8F0] pt-10 sm:pt-14 pb-16 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12">
            {/* Left Column: Reassuring Headline, Supporting Copy & Primary Actions */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-6 text-left"
            >
              <div className="text-xs font-semibold tracking-wider uppercase text-[#249A96]">
                Personal Health & Dermatology Companion
              </div>

              <h1
                className="text-3xl sm:text-5xl font-extrabold text-[#153B50] tracking-tight leading-[1.14]"
                style={{ textWrap: 'balance' }}
              >
                Understand Your Health. Take the Next Step.
              </h1>

              <p className="text-base sm:text-lg text-[#687986] leading-relaxed max-w-xl">
                Explore your symptoms and skin concerns with AI-assisted health information designed to help you make more informed decisions.
              </p>

              {/* Primary & Secondary CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <MedicalButton
                  variant="teal"
                  size="lg"
                  icon={<Stethoscope className="w-5 h-5" />}
                  onClick={() => onNavigate('symptoms')}
                >
                  Check My Symptoms
                </MedicalButton>

                <MedicalButton
                  variant="navy"
                  size="lg"
                  icon={<Camera className="w-5 h-5 text-[#E9F7F5]" />}
                  onClick={() => onNavigate('skin')}
                >
                  Analyse a Skin Image
                </MedicalButton>
              </div>

              {/* Reassurance & Urgent Warning Guide */}
              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-[#687986] border-t border-[#F1F5F9]">
                <span className="flex items-center gap-1.5 font-medium text-[#253746]">
                  <ShieldCheck className="w-4 h-4 text-[#249A96] shrink-0" />
                  <span>This tool gives information, not a medical diagnosis.</span>
                </span>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={onOpenEmergencyModal}
                  className="text-[#C83F49] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Urgent Warning Signs</span>
                </button>
              </div>
            </motion.div>

            {/* Right Column: Live Ambient 3-Video Visual Composition (Runs Automatically, No Buttons) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-3.5"
            >
              {/* Primary Ambient Video Frame */}
              <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#153B50] shadow-md">
                <div className="aspect-video w-full overflow-hidden">
                  <video
                    src={clinicalOverviewVideo}
                    poster={heroPosterImg}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Secondary Dual Ambient Video Frames (All 3 Videos Running Smoothly Together) */}
              <div className="grid grid-cols-2 gap-3.5">
                <div
                  onClick={() => onNavigate('skin')}
                  className="group rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-video w-full overflow-hidden bg-[#153B50]">
                    <video
                      src={skinAnalysisVideo}
                      poster={heroPosterImg}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between gap-2 bg-white">
                    <span className="text-xs font-bold text-[#153B50] truncate">
                      Skin Surface Review
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#249A96] shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                <div
                  onClick={() => onNavigate('symptoms')}
                  className="group rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-video w-full overflow-hidden bg-[#153B50]">
                    <video
                      src={systemicTriageVideo}
                      poster={heroPosterImg}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between gap-2 bg-white">
                    <span className="text-xs font-bold text-[#153B50] truncate">
                      Guided Symptom Check
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#249A96] shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS (3 Simple Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center space-y-3"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-[#249A96]">
            How It Works
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#153B50] tracking-tight">
            Three simple steps from a health question to clear guidance
          </h2>
          <p className="text-sm sm:text-base text-[#687986]">
            Designed for everyday clarity, complete privacy, and calm preparation before your doctor visit.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              desc: 'Share a clear daylight photograph of a skin spot or rash. Your image is reviewed in temporary memory and never stored.',
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
          ].map((item) => (
            <MedicalCard key={item.num} className="flex flex-col justify-between space-y-4 text-left">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold text-[#249A96] tabular-nums">
                    Step {item.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#153B50]">{item.title}</h3>
                <p className="text-sm text-[#687986] leading-relaxed">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={item.action}
                className="text-xs font-bold text-[#249A96] hover:text-[#153B50] inline-flex items-center gap-1 pt-2 cursor-pointer self-start"
              >
                <span>{item.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </MedicalCard>
          ))}
        </div>
      </section>

      {/* SECTION 3: 3-VIDEO VISUAL CARE WALKTHROUGH (Automatic Playback, No Buttons) */}
      <section className="bg-white border-y border-[#E2E8F0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto text-center space-y-3"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-[#249A96]">
              Designed Around Real Clinical Care
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#153B50] tracking-tight">
              Supportive health guidance at every stage of your concern
            </h2>
            <p className="text-sm sm:text-base text-[#687986]">
              Whether you are checking a new skin spot or trying to understand an ongoing symptom, each tool prepares you for a productive conversation with your physician.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {CLINICAL_VIDEOS_LIST.map((vid, index) => (
              <motion.div
                key={vid.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-[#F7FAFC] border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <MedicalVideoShowcase
                  src={vid.src}
                  poster={heroPosterImg}
                  fallbackImage={heroPosterImg}
                  showOverlayText={false}
                  className="rounded-none border-0 border-b border-[#E2E8F0] shadow-none"
                />
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between text-left bg-white">
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-[#249A96]">
                      {vid.category}
                    </div>
                    <h3 className="text-lg font-bold text-[#153B50]">{vid.title}</h3>
                    <p className="text-xs sm:text-sm text-[#687986] leading-relaxed">
                      {vid.subtitle}
                    </p>
                  </div>
                  <div className="pt-2">
                    <MedicalButton
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate(vid.targetTab)}
                      icon={<ArrowRight className="w-3.5 h-3.5 text-[#249A96]" />}
                    >
                      {vid.ctaLabel}
                    </MedicalButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE RAPID ASSESSMENT WORKSPACE */}
      <section ref={assessmentRef} id="free-check" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <MedicalCard padding="lg" hoverEffect={false} className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-[#E2E8F0] pb-6">
            <div className="space-y-1.5 text-left">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#249A96]">
                Quick Health Check · 3 Simple Questions
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#153B50]">
                {activeToolTab === 'symptoms'
                  ? 'Let’s look at your symptoms together'
                  : 'Check a skin concern privately'}
              </h2>
              <p className="text-sm text-[#687986]">
                {activeToolTab === 'symptoms'
                  ? 'Complete a quick 3-step check below, or open the full guided questionnaire.'
                  : 'Upload a clear photo or select a sample case to see how our skin review works.'}
              </p>
            </div>

            <div className="flex items-center gap-2 p-1.5 bg-[#F7FAFC] rounded-xl border border-[#DDE5ED] self-start">
              <button
                type="button"
                onClick={() => setActiveToolTab('symptoms')}
                className={`min-h-[42px] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeToolTab === 'symptoms'
                    ? 'bg-[#153B50] text-white shadow-xs'
                    : 'text-[#687986] hover:text-[#153B50]'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Symptom Checker</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveToolTab('skin')}
                className={`min-h-[42px] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeToolTab === 'skin'
                    ? 'bg-[#153B50] text-white shadow-xs'
                    : 'text-[#687986] hover:text-[#153B50]'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Skin Analysis</span>
              </button>
            </div>
          </div>

          {errorNotice && (
            <MedicalAlert tone="urgent" title="Notice">
              {errorNotice}
            </MedicalAlert>
          )}

          {isAnalyzing && <MedicalAnalysisSkeleton />}

          {/* Shared Patient Identification Bar for Report Header & PDF Export */}
          {!isAnalyzing && (
            <div className="p-4 rounded-xl bg-[#F7FAFC] border border-[#DDE5ED] space-y-3 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#153B50]">
                  <User className="w-4 h-4 text-[#249A96]" />
                  <span>Patient Details for Medical Report & PDF Export</span>
                </div>
                <span className="text-[11px] font-medium text-[#687986]">
                  Included on your downloadable report
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Patient Full Name (e.g., Ali Khan)"
                  className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:border-[#249A96] focus:outline-none text-xs font-semibold text-[#153B50] placeholder:text-[#94A3B8]"
                />
                <input
                  type="text"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="Age in Years (e.g., 29)"
                  className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:border-[#249A96] focus:outline-none text-xs font-semibold text-[#153B50] tabular-nums placeholder:text-[#94A3B8]"
                />
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] focus:border-[#249A96] focus:outline-none text-xs font-semibold text-[#153B50]"
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

          {/* TAB A: RAPID SYMPTOM CHECKER */}
          {!isAnalyzing && activeToolTab === 'symptoms' && (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#153B50]">
                  <span>Question {step} of 3</span>
                  <span className="text-[#249A96] tabular-nums">
                    {step === 1 ? '33%' : step === 2 ? '66%' : '100%'}
                  </span>
                </div>
                <div className="w-full h-2 bg-[#F7FAFC] border border-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#249A96] transition-all duration-300 rounded-full"
                    style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
                  />
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-[#153B50]">
                    1. What is bothering you most today?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {QUICK_SYMPTOM_CHOICES.map((choice) => (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => {
                          setSelectedChoice(choice);
                          setStep(2);
                        }}
                        className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                          selectedChoice.id === choice.id
                            ? 'bg-[#E9F7F5] border-[#249A96]'
                            : 'bg-[#F7FAFC] border-[#E2E8F0] hover:border-[#249A96]'
                        }`}
                      >
                        <div className="text-sm font-bold text-[#153B50] flex items-center justify-between gap-1.5">
                          <span>{choice.label}</span>
                          <ArrowRight className="w-4 h-4 text-[#249A96] shrink-0" />
                        </div>
                        <div className="text-xs text-[#687986] mt-1">{choice.hint}</div>
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
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-[#153B50]">
                    2. How long have you noticed {customNotes || selectedChoice.label.toLowerCase()}?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {QUICK_DURATION_CHOICES.map((dur) => (
                      <button
                        key={dur.id}
                        type="button"
                        onClick={() => {
                          setSelectedDuration(dur.id);
                          setStep(3);
                        }}
                        className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                          selectedDuration === dur.id
                            ? 'bg-[#E9F7F5] border-[#249A96]'
                            : 'bg-[#F7FAFC] border-[#E2E8F0] hover:border-[#249A96]'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-bold text-[#153B50]">{dur.label}</div>
                          <div className="text-xs text-[#687986] mt-0.5">{dur.sub}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#249A96]" />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <MedicalButton variant="ghost" size="sm" onClick={() => setStep(1)}>
                      ← Previous Question
                    </MedicalButton>
                    <MedicalButton variant="navy" size="sm" onClick={() => setStep(3)}>
                      Next Question →
                    </MedicalButton>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-[#153B50]">
                    3. How much discomfort is it causing you?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {[
                      {
                        id: 'mild' as const,
                        label: 'Mild',
                        desc: 'Noticeable, but able to continue daily activities',
                      },
                      {
                        id: 'moderate' as const,
                        label: 'Moderate',
                        desc: 'Uncomfortable and interfering with routine comfort',
                      },
                      {
                        id: 'severe' as const,
                        label: 'Significant',
                        desc: 'Very distressing or difficult to ignore',
                      },
                    ].map((sev) => (
                      <button
                        key={sev.id}
                        type="button"
                        onClick={() => setSelectedSeverity(sev.id)}
                        className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                          selectedSeverity === sev.id
                            ? 'bg-[#E9F7F5] border-[#249A96]'
                            : 'bg-[#F7FAFC] border-[#E2E8F0] hover:border-[#249A96]'
                        }`}
                      >
                        <div className="text-sm font-bold text-[#153B50]">{sev.label}</div>
                        <div className="text-xs text-[#687986] mt-1">{sev.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E2E8F0]">
                    <MedicalButton variant="ghost" size="sm" onClick={() => setStep(2)}>
                      ← Previous Question
                    </MedicalButton>
                    <MedicalButton
                      variant="teal"
                      size="lg"
                      onClick={handleRunSymptomAssessment}
                    >
                      View Health Insights
                    </MedicalButton>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB B: SKIN SCANNER */}
          {!isAnalyzing && activeToolTab === 'skin' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-4">
                <MedicalUploadDropzone
                  previewUrl={skinPreview}
                  onFileSelect={handleSkinFileUpload}
                  onClear={() => setSkinPreview(null)}
                />

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#687986] block text-left">
                    Or try a sample dermatology photo:
                  </span>
                  <div className="grid grid-cols-3 gap-2.5">
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
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          skinPreview === preset.image
                            ? 'border-[#249A96] bg-[#E9F7F5]/60'
                            : 'border-[#E2E8F0] bg-[#F7FAFC] hover:border-[#249A96]'
                        }`}
                      >
                        <img
                          src={preset.image}
                          alt={preset.label}
                          referrerPolicy="no-referrer"
                          className="w-full h-14 object-cover rounded-lg mb-1.5"
                        />
                        <div className="text-[11px] font-bold text-[#153B50] line-clamp-1">
                          {preset.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <MedicalInput
                    label="Body Area"
                    value={skinLocation}
                    onChange={(e) => setSkinLocation(e.target.value)}
                  />
                  <MedicalInput
                    label="How Long Present"
                    value={skinDuration}
                    onChange={(e) => setSkinDuration(e.target.value)}
                  />
                </div>

                <MedicalInput
                  label="What You Notice (Itching, Dryness, Changes)"
                  value={skinNotes}
                  onChange={(e) => setSkinNotes(e.target.value)}
                />

                <div className="p-3.5 rounded-xl bg-[#E9F7F5] text-[#153B50] text-xs flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#249A96] shrink-0" />
                  <span>
                    <strong>Your photo is never shared:</strong> Reviewed privately in memory and immediately cleared.
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <MedicalButton
                    variant="teal"
                    size="lg"
                    className="flex-1"
                    icon={<Camera className="w-5 h-5" />}
                    onClick={handleRunSkinAnalysis}
                  >
                    Analyse a Skin Image
                  </MedicalButton>
                  <MedicalButton
                    variant="outline"
                    size="lg"
                    onClick={() => onNavigate('skin')}
                  >
                    Full Skin Tool →
                  </MedicalButton>
                </div>
              </div>
            </div>
          )}
        </MedicalCard>
      </section>

      {/* SECTION 5: 12-SECTION PROFESSIONAL MEDICAL REPORT (WHEN GENERATED) */}
      {(symptomResult || skinResult) && (
        <section ref={resultsRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
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
              onStartNew={() => {
                setSymptomResult(null);
                setSkinResult(null);
                setStep(1);
              }}
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
              onStartNew={() => {
                setSymptomResult(null);
                setSkinResult(null);
                setStep(1);
              }}
            />
          )}
        </section>
      )}

      {/* SECTION 6: TRUST, PRIVACY & SAFETY */}
      <section className="bg-white border-y border-[#E2E8F0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#249A96]">
              Privacy & Patient Safety
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#153B50] tracking-tight">
              Built on medical privacy, clarity, and responsible care
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#153B50]">
                Your Photo Is Never Stored
              </h3>
              <p className="text-sm text-[#687986] leading-relaxed">
                Skin images and symptom answers are processed in temporary memory and cleared immediately after your summary is created.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#153B50]">
                Information, Not a Diagnosis
              </h3>
              <p className="text-sm text-[#687986] leading-relaxed">
                Every summary highlights multiple possibilities and helpful questions so you can have an informed discussion with your doctor.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#C83F49]/10 text-[#C83F49] flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#153B50]">
                Clear Warning Sign Alerts
              </h3>
              <p className="text-sm text-[#687986] leading-relaxed">
                Immediate guidance on when a symptom or changing skin spot warrants prompt in-person medical evaluation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#249A96]">
            Common Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#153B50] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={item.question}
                className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F7FAFC]"
                >
                  <span className="text-sm sm:text-base font-bold text-[#153B50] flex-1">
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#249A96] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#687986] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-[#687986] leading-relaxed border-t border-[#F1F5F9] pt-3 text-left">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
